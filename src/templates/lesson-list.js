import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"

const LessonList = ({ data, pageContext }) => {
  const lessons = data.allMarkdownRemark.edges
  const { currentPage, numPages } = pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = currentPage - 1 === 1 ? "/learning-hub" : `/learning-hub/${currentPage - 1}`
  const nextPage = `/learning-hub/${currentPage + 1}`

  return (
    <Layout>
      <h1>Learning Hub</h1>
      {lessons.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug
        return (
          <article key={node.fields.slug}>
            <h2>
              <Link to={node.fields.slug}>{title}</Link>
            </h2>
            <small>{node.frontmatter.date}</small>
            <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
          </article>
        )
      })}
      <nav>
        {!isFirst && (
          <Link to={prevPage} rel="prev">
            ← Previous Page
          </Link>
        )}
        {!isLast && (
          <Link to={nextPage} rel="next">
            Next Page →
          </Link>
        )}
      </nav>
    </Layout>
  )
}

export default LessonList

export const lessonListQuery = graphql`
  query lessonListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      limit: $limit
      skip: $skip
      filter: { fileAbsolutePath: { regex: "/content/learning-hub/" } }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`