const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)

const NOTEBOOK_SOURCES = new Set([
  'blog', 'notes', 'essays', 'research-seeds', 'paper-notes', 'builds',
])

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }
    type Frontmatter {
      title: String!
      date: Date @dateformat
      created: Date @dateformat
      updated: Date @dateformat
      type: String
      status: String
      summary: String
      topics: [String]
      tags: [String]
      linked_notes: [String]
      category: String
      topic: String
      unit: String
      order: Int
      description: String
      isMainCourse: Boolean
      coverImage: File @fileByRelativePath
      planted: String
      last_tended: String
      graph: GraphConfig
    }
    type GraphConfig {
      show: Boolean
      weight: Int
      cluster: String
    }
    type Fields {
      slug: String!
      categorySlug: String
      topicSlug: String
      unitSlug: String
    }
  `
  createTypes(typeDefs)
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type !== `MarkdownRemark`) return

  const parent = getNode(node.parent)
  if (!parent) return

  const source = parent.sourceInstanceName
  let slug

  if (NOTEBOOK_SOURCES.has(source)) {
    slug = createFilePath({ node, getNode, basePath: `content` })
    if (source === 'blog') {
      slug = `/blog${slug}`
    } else {
      slug = `/${source}${slug}`
    }
  } else {
    slug = createFilePath({ node, getNode })
  }

  createNodeField({ node, name: `slug`, value: slug })

}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark(
        sort: { frontmatter: { date: DESC } }
        filter: { frontmatter: { status: { ne: "draft" } } }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              tags
              description
              linked_notes
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    console.error(result.errors)
    return
  }

  const posts = result.data.allMarkdownRemark.edges

  // Notes get the long-form reading template (table of contents, connected notes).
  // Everything else keeps the original blog post template.
  const notes = posts.filter(p => p.node.fields.slug.startsWith('/notes/'))
  const others = posts.filter(p => !p.node.fields.slug.startsWith('/notes/'))

  // linked_notes in frontmatter hold the last part of a slug ("how-a-machine-searches").
  // Map them to full slugs so a page can list its connected notes.
  const tailToSlug = {}
  posts.forEach(p => {
    const parts = p.node.fields.slug.split('/').filter(Boolean)
    tailToSlug[parts[parts.length - 1]] = p.node.fields.slug
  })

  const makePages = (list, template) => {
    list.forEach((post, index) => {
      const previous = index === list.length - 1 ? null : list[index + 1].node
      const next = index === 0 ? null : list[index - 1].node
      const slug = post.node.fields.slug
      const linked = (post.node.frontmatter.linked_notes || [])
        .map(tail => tailToSlug[tail])
        .filter(Boolean)
      createPage({
        path: slug,
        component: path.resolve(`./src/templates/${template}`),
        context: { slug, previous, next, linked },
      })
    })
  }

  makePages(notes, 'note.js')
  makePages(others, 'blog-post.js')

  // Paginated blog list (legacy /blog route kept for compatibility)
  const postsPerPage = 6
  const blogPosts = posts.filter(p => p.node.fields.slug.startsWith('/blog/'))
  const numBlogPages = Math.ceil(blogPosts.length / postsPerPage)

  Array.from({ length: numBlogPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/blog` : `/blog/${i + 1}`,
      component: path.resolve('./src/templates/blog-list.js'),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages: numBlogPages,
        currentPage: i + 1,
      },
    })
  })
}
