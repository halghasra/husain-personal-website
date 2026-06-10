import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import * as styles from "../styles/reading.module.css"

const STATUS_ORDER = { reading: 0, reviewed: 1, evergreen: 2 }

const ReadingPage = ({ data }) => {
  const allPosts = data.allMarkdownRemark.nodes

  const paperNotes = allPosts.filter(
    p => p.frontmatter.type === "paper-note"
  )

  const bookNotes = allPosts.filter(
    p =>
      !p.frontmatter.type ||
      p.frontmatter.type === "note" ||
      p.frontmatter.type === "article"
  )

  return (
    <Layout>
      <SEO
        title="Reading"
        description="Papers and books Husain is reading, wrestling with, and trying to connect to bigger questions."
      />
      <div className={styles.readingWrapper}>
        <header className={styles.pageHeader}>
          <p className={styles.pageLabel}>Reading</p>
          <h1 className={styles.pageHeading}>
            Papers I am reading, wrestling with, and trying to connect.
          </h1>
          <p className={styles.pageSubtitle}>
            Not just summaries. These are notes on why the work matters, what clicked,
            and what I am still unsure about.
          </p>
        </header>

        {paperNotes.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Paper notes</h2>
            <ul className={styles.postList}>
              {paperNotes
                .sort((a, b) => {
                  const sa = STATUS_ORDER[a.frontmatter.status] ?? 99
                  const sb = STATUS_ORDER[b.frontmatter.status] ?? 99
                  return sa - sb
                })
                .map(post => (
                  <li key={post.fields.slug} className={styles.postItem}>
                    <Link to={post.fields.slug} className={styles.postLink}>
                      <div className={styles.postMeta}>
                        <span className={`${styles.statusBadge} ${styles["status_" + (post.frontmatter.status || "draft")]}`}>
                          {post.frontmatter.status || "draft"}
                        </span>
                        <time className={styles.postDate}>{post.frontmatter.date}</time>
                      </div>
                      <h3 className={styles.postTitle}>{post.frontmatter.title}</h3>
                      {post.frontmatter.summary && (
                        <p className={styles.postSummary}>{post.frontmatter.summary}</p>
                      )}
                      {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                        <div className={styles.postTags}>
                          {post.frontmatter.tags.slice(0, 3).map(tag => (
                            <span key={tag} className={styles.postTag}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        )}

        {bookNotes.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Book notes</h2>
            <ul className={styles.postList}>
              {bookNotes.map(post => (
                <li key={post.fields.slug} className={styles.postItem}>
                  <Link to={post.fields.slug} className={styles.postLink}>
                    <div className={styles.postMeta}>
                      {post.frontmatter.status && (
                        <span className={`${styles.statusBadge} ${styles["status_" + post.frontmatter.status]}`}>
                          {post.frontmatter.status}
                        </span>
                      )}
                      <time className={styles.postDate}>{post.frontmatter.date}</time>
                    </div>
                    <h3 className={styles.postTitle}>{post.frontmatter.title}</h3>
                    {post.frontmatter.summary && (
                      <p className={styles.postSummary}>{post.frontmatter.summary}</p>
                    )}
                    {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                      <div className={styles.postTags}>
                        {post.frontmatter.tags.slice(0, 3).map(tag => (
                          <span key={tag} className={styles.postTag}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {paperNotes.length === 0 && bookNotes.length === 0 && (
          <div className={styles.empty}>
            <p>Reading notes are being written. Check back soon.</p>
            <p>
              In the meantime, see the <Link to="/notebook">notebook</Link> for related
              reading and thinking.
            </p>
          </div>
        )}

        <section className={styles.paperStructureSection}>
          <h2 className={styles.sectionHeading}>How I structure paper notes</h2>
          <div className={styles.structureCard}>
            <ul className={styles.structureList}>
              <li>Why I read this</li>
              <li>The question the paper is trying to answer</li>
              <li>The core idea</li>
              <li>What clicked</li>
              <li>What I am still unsure about</li>
              <li>Why it matters for my research</li>
              <li>Connected notes</li>
            </ul>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query ReadingQuery {
    allMarkdownRemark(
      filter: {
        fields: {
          slug: { regex: "/^/(blog|paper-notes)/" }
        }
        frontmatter: {
          tags: { in: ["Book Reviews", "Paper Notes", "Reading", "Literature", "Novels"] }
        }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        fields { slug }
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

export default ReadingPage
