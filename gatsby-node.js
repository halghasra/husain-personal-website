const path = require('path')
const _ = require('lodash')
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  // Query for markdown nodes to use in creating pages.
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
              categories
              tags
              coverImage {
                childImageSharp {
                  gatsbyImageData(width: 800, height: 400, layout: CONSTRAINED)
                }
              }
            }
          }
        }
      categoriesGroup: allMarkdownRemark(limit: 2000) {
        group(field: { frontmatter: { categories: SELECT } }) {
          fieldValue
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  // Create blog post pages
  const posts = result.data.allMarkdownRemark.edges.filter(
    edge => edge.node.fields.slug.startsWith('/blog/')
  )
  const postsPerPage = 6
  const numPages = Math.ceil(posts.length / postsPerPage)

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

  // Create individual blog post pages
  posts.forEach(({ node }, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/blog-post.js`),
      context: {
        slug: node.fields.slug,
        previous,
        next,
      },
    })
  })

  // Create learning hub pages (similar to blog posts)
  const lessons = result.data.allMarkdownRemark.edges.filter(
    edge => edge.node.fields.slug.startsWith('/learning-hub/')
  )
  const lessonsPerPage = 6
  const numLessonPages = Math.ceil(lessons.length / lessonsPerPage)

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

  // Create individual lesson pages
  lessons.forEach((lesson, index) => {
    const previous = index === lessons.length - 1 ? null : lessons[index + 1].node
    const next = index === 0 ? null : lessons[index - 1].node

    createPage({
      path: lesson.node.fields.slug,
      component: path.resolve(`./src/templates/lesson.js`),
      context: {
        slug: lesson.node.fields.slug,
        previous,
        next,
      },
    })
  })

  // Create category pages
  const categoryTemplate = path.resolve('src/templates/category.js')
  const categories = result.data.categoriesGroup.group

  categories.forEach(category => {
    createPage({
      path: `/category/${_.kebabCase(category.fieldValue)}/`,
      component: categoryTemplate,
      context: {
        category: category.fieldValue,
      },
    })
  })
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '../components/layout': path.resolve(__dirname, 'src/components/Layout.js'),
      },
    },
  })
}