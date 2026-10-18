import React from "react"
import { Link } from "gatsby"
import { useCatalogue } from "../hooks/useCatalogue"
import { typeLabel, typeColor } from "../config/entryTypes"
import * as styles from "../styles/entry-list.module.css"

// A table of contents: catalogue number and date in the margin, title and summary in the main column.
// `posts` are markdown nodes with fields.slug and frontmatter { title, date, type, status, summary, tags }.
const EntryList = ({ posts, showType = true, showStatus = false, tagCount = 3 }) => {
  const { numberOf } = useCatalogue()

  return (
    <ol className={styles.entries}>
      {posts.map(post => {
        const fm = post.frontmatter
        const n = numberOf(post.fields.slug)
        const summary = fm.summary || post.excerpt
        const tags = (fm.tags || []).slice(0, tagCount)
        return (
          <li key={post.fields.slug} className={styles.entry} style={{ "--c": typeColor(fm.type) }}>
            <div className={styles.margin}>
              {n && <span className={styles.num}>N° {n}</span>}
              {fm.date && <time className={styles.date}>{fm.date}</time>}
            </div>
            <Link to={post.fields.slug} className={styles.link}>
              <h3 className={styles.title}>{fm.title}</h3>
              {summary && <p className={styles.summary}>{summary}</p>}
              <p className={styles.kind}>
                {showType && <span className={styles.type}>{typeLabel(fm.type).toLowerCase()}</span>}
                {showStatus && fm.status && <span className={styles.status}>{fm.status}</span>}
                {tags.length > 0 && <span>{tags.join(", ").toLowerCase()}</span>}
              </p>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}

export default EntryList
