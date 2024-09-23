import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"
import * as styles from "../styles/tags.module.css"

const TagsPage = ({ data }) => {
  const allTags = data.allMarkdownRemark.group

  return (
    <Layout>
      <div className={styles.tagsHeader}>
        <h1>Tags</h1>
        <p>Browse all topics covered in the blog and learning hub</p>
      </div>
      <div className={styles.tagsContainer}>
        {allTags.map(tag => (
          <Link
            to={`/tag/${tag.fieldValue.toLowerCase()}/`}
            key={tag.fieldValue}
            className={styles.tagCard}
          >
            <h2>{tag.fieldValue}</h2>
            <p>{tag.totalCount} post{tag.totalCount === 1 ? '' : 's'}</p>
          </Link>
        ))}
      </div>
    </Layout>
  )
}

export default TagsPage

export const pageQuery = graphql`
  query {
    allMarkdownRemark {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`