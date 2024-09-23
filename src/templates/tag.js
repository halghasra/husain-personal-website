import React from 'react'
import { Link, graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import Layout from '../components/Layout'
import * as styles from '../styles/tag.module.css'

const TagTemplate = ({ pageContext, data }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark

  return (
    <Layout>
      <div className={styles.tagHeader}>
        <h1>#{tag}</h1>
        <p>{totalCount} post{totalCount === 1 ? '' : 's'} tagged with "{tag}"</p>
      </div>
      <div className={styles.taggedPostGrid}>
        {edges.map(({ node }) => {
          const { title, date, coverImage } = node.frontmatter
          const { slug } = node.fields
          const image = getImage(coverImage)
          return (
            <article key={slug} className={styles.taggedPostCard}>
              {image && (
                <GatsbyImage image={image} alt={title} className={styles.coverImage} />
              )}
              <div className={styles.cardContent}>
                <h2>
                  <Link to={slug}>{title}</Link>
                </h2>
                <p className={styles.postDate}>{date}</p>
                <p className={styles.postExcerpt}>{node.excerpt}</p>
                <Link to={slug} className={styles.readMoreLink}>Read more</Link>
              </div>
            </article>
          )
        })}
      </div>
      <Link to="/tags" className={styles.allTagsLink}>View all tags</Link>
    </Layout>
  )
}

export default TagTemplate

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { frontmatter: { date: DESC }}
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            coverImage {
              childImageSharp {
                gatsbyImageData(width: 600, height: 300, layout: CONSTRAINED)
              }
            }
          }
          excerpt(pruneLength: 160)
        }
      }
    }
  }
`