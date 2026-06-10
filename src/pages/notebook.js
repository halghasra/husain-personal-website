import React, { useState } from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import * as styles from "../styles/notebook.module.css"

const TYPE_LABELS = {
  note: "Note",
  essay: "Essay",
  "research-seed": "Research Seed",
  "paper-note": "Paper Note",
  "learning-log": "Learning Log",
  build: "Build",
  article: "Article",
}

const NotebookPage = ({ data }) => {
  const [activeFilter, setActiveFilter] = useState("all")

  const allPosts = data.allMarkdownRemark.nodes

  const filtered =
    activeFilter === "all"
      ? allPosts
      : allPosts.filter(p => {
          const t = p.frontmatter.type || "note"
          return t === activeFilter
        })

  const types = ["all", ...Array.from(new Set(allPosts.map(p => p.frontmatter.type || "note")))]

  return (
    <Layout>
      <SEO
        title="Notebook"
        description="A living archive of thoughts, notes, essays, and research seeds. Imperfect and evolving."
      />
      <div className={styles.notebookWrapper}>
        <header className={styles.pageHeader}>
          <p className={styles.pageLabel}>Notebook</p>
          <h1 className={styles.pageHeading}>A living archive of thoughts.</h1>
          <p className={styles.pageSubtitle}>
            Notes, essays, research seeds, and learning logs. Imperfect and evolving.
          </p>
        </header>

        <div className={styles.filters}>
          {types.map(type => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`${styles.filterBtn} ${activeFilter === type ? styles.filterBtnActive : ""}`}
            >
              {type === "all" ? "All" : TYPE_LABELS[type] || type}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <ul className={styles.postList}>
            {filtered.map(post => (
              <li key={post.fields.slug} className={styles.postItem}>
                <Link to={post.fields.slug} className={styles.postLink}>
                  <div className={styles.postMeta}>
                    <span className={styles.postType}>
                      {TYPE_LABELS[post.frontmatter.type] || "Note"}
                    </span>
                    {post.frontmatter.status && (
                      <span className={styles.postStatus}>{post.frontmatter.status}</span>
                    )}
                    <time className={styles.postDate}>{post.frontmatter.date}</time>
                  </div>
                  <h2 className={styles.postTitle}>{post.frontmatter.title}</h2>
                  {(post.frontmatter.summary || post.excerpt) && (
                    <p className={styles.postExcerpt}>
                      {post.frontmatter.summary || post.excerpt}
                    </p>
                  )}
                  {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                    <div className={styles.postTags}>
                      {post.frontmatter.tags.slice(0, 4).map(tag => (
                        <span key={tag} className={styles.postTag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>No entries match this filter.</p>
        )}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query NotebookQuery {
    allMarkdownRemark(
      filter: {
        fields: {
          slug: { regex: "/^/(blog|notes|essays|research-seeds|paper-notes|builds)/" }
        }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        excerpt(pruneLength: 140)
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "DD MMM YYYY")
          type
          status
          summary
          tags
        }
      }
    }
  }
`

export default NotebookPage
