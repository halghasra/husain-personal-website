import React from 'react'
import { Link } from 'gatsby'
import * as styles from '../styles/post-meta.module.css'

const PostMeta = ({ post }) => {
  const headings = post.headings.filter(heading => heading.depth <= 3)
  const readingTime = Math.ceil(post.wordCount.words / 200) // Assuming 200 words per minute

  return (
    <div className={styles.postMeta}>
      <div className={styles.readingTime}>
        Estimated reading time: {readingTime} minute{readingTime > 1 ? 's' : ''}
      </div>
      {headings.length > 0 && (
        <div className={styles.tableOfContents}>
          <h2>Table of Contents</h2>
          <ul>
            {headings.map((heading, index) => (
              <li key={index} className={styles[`depth${heading.depth}`]}>
                <Link to={`#${heading.id}`}>{heading.value}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default PostMeta