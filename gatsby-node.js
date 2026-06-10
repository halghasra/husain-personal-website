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
  } else if (source === 'learning-hub') {
    slug = createFilePath({ node, getNode, basePath: `content` })
    slug = `/learning-hub${slug}`
  } else {
    slug = createFilePath({ node, getNode })
  }

  createNodeField({ node, name: `slug`, value: slug })

  if (source === 'learning-hub') {
    const parts = slug.split('/').filter(Boolean)
    createNodeField({
      node,
      name: 'categorySlug',
      value: parts[1] ? `/learning-hub/${parts[1]}` : null,
    })
    createNodeField({
      node,
      name: 'topicSlug',
      value: parts[2] ? `/learning-hub/${parts[1]}/${parts[2]}` : null,
    })
    createNodeField({
      node,
      name: 'unitSlug',
      value: parts[3] ? `/learning-hub/${parts[1]}/${parts[2]}/${parts[3]}` : null,
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              tags
              description
              isMainCourse
              order
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

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node
    const slug = post.node.fields.slug

    let template = 'blog-post.js'
    if (slug.startsWith('/learning-hub/')) {
      template = 'lesson.js'
    }

    createPage({
      path: slug,
      component: path.resolve(`./src/templates/${template}`),
      context: { slug, previous, next },
    })
  })

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

  // Learning hub list
  const lessonsPerPage = 6
  const learningHubPosts = posts.filter(p => p.node.fields.slug.startsWith('/learning-hub/'))
  const numLessonPages = Math.ceil(learningHubPosts.length / lessonsPerPage)

  if (numLessonPages > 0) {
    Array.from({ length: numLessonPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/learning-hub` : `/learning-hub/${i + 1}`,
        component: path.resolve('./src/templates/lesson-list.js'),
        context: {
          limit: lessonsPerPage,
          skip: i * lessonsPerPage,
          numPages: numLessonPages,
          currentPage: i + 1,
        },
      })
    })
  }
}
