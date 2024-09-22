import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/Layout"

const LessonTemplate = ({ data, pageContext }) => {
  const lesson = data.markdownRemark
  const { previous, next } = pageContext

  return (
    <Layout>
      <article>
        <header>
          <h1>{lesson.frontmatter.title}</h1>
          <p>{lesson.frontmatter.date}</p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: lesson.html }} />
      </article>

      <nav>
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default LessonTemplate

export const pageQuery = graphql`
  query LessonBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`