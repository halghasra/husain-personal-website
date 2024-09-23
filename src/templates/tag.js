import React, { useState } from 'react'
import { Link, graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import Layout from '../components/Layout'
import * as styles from '../styles/tags.module.css'

const TagsPage = ({ data }) => {
  const allTags = data.tagsGroup.group
  const allPosts = data.allMarkdownRemark.nodes
  const [selectedTag, setSelectedTag] = useState(null)

  const filteredPosts = selectedTag
    ? allPosts.filter(post => post.frontmatter.tags.includes(selectedTag))
    : allPosts

  return (
    <Layout>
      <div className={styles.tagsHeader}>
        <h1>Tags</h1>
        <p>Browse all topics covered in the blog and learning hub</p>
      </div>
      <div className={styles.tagsContainer}>
        <button
          className={`${styles.tagButton} ${!selectedTag ? styles.activeTag : ''}`}
          onClick={() => setSelectedTag(null)}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag.fieldValue}
            className={`${styles.tagButton} ${selectedTag === tag.fieldValue ? styles.activeTag : ''}`}
            onClick={() => setSelectedTag(tag.fieldValue)}
          >
            {tag.fieldValue} ({tag.totalCount})
          </button>
        ))}
      </div>
      <div className={styles.postsGrid}>
        {filteredPosts.map(post => {
          const coverImage = getImage(post.frontmatter.coverImage)
          return (
            <article key={post.fields.slug} className={styles.postCard}>
              {coverImage && (
                <GatsbyImage image={coverImage} alt={post.frontmatter.title} className={styles.coverImage} />
              )}
              <div className={styles.postContent}>
                <h2>
                  <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
                </h2>
                <p className={styles.postDate}>{post.frontmatter.date}</p>
                <p className={styles.postExcerpt}>{post.excerpt}</p>
                <Link to={post.fields.slug} className={styles.readMoreLink}>
                  Read more
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </Layout>
  )
}

export default TagsPage

export const pageQuery = graphql`
  query {
    tagsGroup: allMarkdownRemark(limit: 2000) {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt(pruneLength: 160)
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
`