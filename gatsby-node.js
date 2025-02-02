const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)

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
      category: String
      topic: String
      unit: String
      order: Int
      tags: [String]
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
  if (node.internal.type === `MarkdownRemark`) {
    const parent = getNode(node.parent)
    if (!parent) {
      return
    }

    let slug
    if (parent.sourceInstanceName === 'blog' || parent.sourceInstanceName === 'learning-hub') {
      slug = createFilePath({ node, getNode, basePath: `content` })
      slug = `/${parent.sourceInstanceName}${slug}`
    } else {
      slug = createFilePath({ node, getNode })
    }

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })

    const parts = slug.split('/').filter(Boolean)
    if (parts[0] === 'learning-hub') {
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
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              tags
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

  // Create blog posts pages
  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: path.resolve(`./src/templates/${post.node.fields.slug.startsWith('/learning-hub/') ? 'lesson.js' : 'blog-post.js'}`),
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })

  // Create blog list pages
  const postsPerPage = 6
  const blogPosts = posts.filter(post => post.node.fields.slug.startsWith('/blog/'))
  const numPages = Math.ceil(blogPosts.length / postsPerPage)

  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/blog` : `/blog/${i + 1}`,
      component: path.resolve("./src/templates/blog-list.js"),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    })
  })

  // Create learning hub list pages
  const lessonsPerPage = 6
  const learningHubPosts = posts.filter(post => post.node.fields.slug.startsWith('/learning-hub/'))
  const numLessonPages = Math.ceil(learningHubPosts.length / lessonsPerPage)

  Array.from({ length: numLessonPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/learning-hub` : `/learning-hub/${i + 1}`,
      component: path.resolve("./src/templates/lesson-list.js"),
      context: {
        limit: lessonsPerPage,
        skip: i * lessonsPerPage,
        numPages: numLessonPages,
        currentPage: i + 1,
      },
    })
  })
}

