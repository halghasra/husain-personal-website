import React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/Layout"
import Search from "../components/Search"
import * as styles from "../styles/learning-hub.module.css"

const LessonList = ({ data, pageContext }) => {
  const lessons = data.allMarkdownRemark.edges
  const { currentPage, numPages } = pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = currentPage - 1 === 1 ? "/learning-hub" : `/learning-hub/${currentPage - 1}`
  const nextPage = `/learning-hub/${currentPage + 1}`

  return (
    <Layout>
      <div className={styles.learningHubHeader}>
        <h1>Learning Hub</h1>
        <p>Explore lessons on technology, computer science, and more!</p>
      </div>
      <Search posts={lessons.map(({ node }) => node)} />
      <div className={styles.lessonGrid}>
        {lessons.map(({ node }) => {
          const coverImage = getImage(node.frontmatter.coverImage)
          return (
            <article key={node.fields.slug} className={styles.lessonCard}>
              {coverImage && (
                <GatsbyImage 
                  image={coverImage} 
                  alt={node.frontmatter.title} 
                  className={styles.coverImage}
                />
              )}
              <Link to={node.fields.slug}>
                <h2>{node.frontmatter.title}</h2>
                <p className={styles.lessonDate}>{node.frontmatter.date}</p>
                <p className={styles.lessonExcerpt}>{node.excerpt}</p>
              </Link>
              <div className={styles.tags}>
                {node.frontmatter.tags && node.frontmatter.tags.map(tag => (
                  <Link to={`/tag/${tag}`} key={tag} className={styles.tag}>
                    {tag}
                  </Link>
                ))}
              </div>
            </article>
          )
        })}
      </div>
      <nav className={styles.pagination}>
        {!isFirst && (
          <Link to={prevPage} rel="prev" className={styles.paginationLink}>
            ← Previous Page
          </Link>
        )}
        {!isLast && (
          <Link to={nextPage} rel="next" className={styles.paginationLink}>
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
            tags
            coverImage {
              childImageSharp {
                gatsbyImageData(width: 600, height: 300, layout: CONSTRAINED)
              }
            }
          }
        }
      }
    }
  }
`