import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/Layout"
import Sidebar from "../components/Sidebar"
import TableOfContents from "../components/TableOfContents"
import * as styles from "../styles/lesson.module.css"

const LessonTemplate = ({ data }) => {
  const lesson = data.markdownRemark
  const { frontmatter, html, headings, fields } = lesson
  const { categorySlug, topicSlug, unitSlug } = fields

  return (
    <Layout>
      <div className={styles.lessonContainer}>
        <Sidebar />
        <article className={styles.lessonContent}>
          <nav className={styles.breadcrumbs}>
            <Link to="/learning-hub">Learning Hub</Link>
            {categorySlug && <Link to={categorySlug}>{frontmatter.category}</Link>}
            {topicSlug && <Link to={topicSlug}>{frontmatter.topic}</Link>}
            {unitSlug && <Link to={unitSlug}>{frontmatter.unit}</Link>}
          </nav>
          <h1>{frontmatter.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>
        <TableOfContents headings={headings} />
      </div>
    </Layout>
  )
}

export default LessonTemplate

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      headings {
        depth
        value
        id
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        category
        topic
        unit
      }
      fields {
        slug
        categorySlug
        topicSlug
        unitSlug
      }
    }
  }
`