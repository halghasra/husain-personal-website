import React, { useEffect, useState } from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import ShareButtons from "../components/ShareButtons"
import AuthorBio from "../components/AuthorBio"
import Comments from "../components/Comments"
import * as styles from "../styles/note.module.css"

// Long-form reading template for notebook notes (content/notes).
// Left: sticky "on this page" contents. Right: the note, then connected notes.
const NoteTemplate = ({ data, pageContext }) => {
  const note = data.markdownRemark
  const { frontmatter, html, headings, fields, wordCount } = note
  const siteUrl = data.site.siteMetadata?.siteUrl || ``
  const connected = data.connected.nodes
  const { previous, next } = pageContext

  const tocHeadings = headings.filter(h => h.depth >= 2 && h.depth <= 3)
  const minutes = Math.max(1, Math.ceil((wordCount?.words || 0) / 220))
  const description =
    frontmatter.seo?.description || frontmatter.summary || note.excerpt

  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    if (!tocHeadings.length || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: "-10% 0px -80% 0px", threshold: 0 }
    )
    tocHeadings.forEach(h => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout fullWidth>
      <SEO
        post={{ ...note, excerpt: description }}
        siteMetadata={data.site.siteMetadata}
      />
      <div className={styles.noteContainer}>
        <aside className={styles.noteSidebar}>
          <div className={styles.sidebarInner}>
            <Link to="/notebook" className={styles.sidebarBack}>
              ← Notebook
            </Link>

            {frontmatter.topics && frontmatter.topics.length > 0 && (
              <div className={styles.sidebarMeta}>
                <span className={styles.sidebarCategory}>{frontmatter.topics[0]}</span>
                {frontmatter.topics.slice(1).map(t => (
                  <span key={t} className={styles.sidebarTopic}>{t}</span>
                ))}
              </div>
            )}

            {tocHeadings.length > 0 && (
              <>
                <p className={styles.sidebarLabel}>On this page</p>
                <nav className={styles.sidebarToc}>
                  {tocHeadings.map(h => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={[
                        styles.tocLink,
                        h.depth === 3 ? styles.tocLinkSub : "",
                        activeId === h.id ? styles.tocLinkActive : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {h.value}
                    </a>
                  ))}
                </nav>
              </>
            )}
          </div>
        </aside>

        <main className={styles.noteMain}>
          <article className={styles.noteContent}>
            <header className={styles.noteHeader}>
              <p className={styles.noteEyebrow}>Note</p>
              <h1 className={styles.noteTitle}>{frontmatter.title}</h1>
              {frontmatter.summary && (
                <p className={styles.noteLede}>{frontmatter.summary}</p>
              )}
              <p className={styles.noteMeta}>
                <time>{frontmatter.date}</time>
                {frontmatter.updated && frontmatter.updated !== frontmatter.date && (
                  <span> · Updated {frontmatter.updated}</span>
                )}
                <span> · {minutes} min read</span>
              </p>
              {frontmatter.tags && frontmatter.tags.length > 0 && (
                <div className={styles.tags}>
                  {frontmatter.tags.map(tag => (
                    <Link to={`/tags?tag=${tag}`} key={tag} className={styles.tag}>
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            <div
              className={styles.noteBody}
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {connected.length > 0 && (
              <section className={styles.connected}>
                <p className={styles.sidebarLabel}>Connected notes</p>
                <ul>
                  {connected.map(c => (
                    <li key={c.fields.slug}>
                      <Link to={c.fields.slug}>{c.frontmatter.title}</Link>
                      {c.frontmatter.summary && <span>{c.frontmatter.summary}</span>}
                    </li>
                  ))}
                </ul>
                <Link to="/graph" className={styles.graphLink}>
                  See how it all connects on the Neural Map →
                </Link>
              </section>
            )}

            <ShareButtons
              url={`${siteUrl}${fields.slug}`}
              title={frontmatter.title}
              description={description}
            />
            <AuthorBio />
            <div className={styles.comments}>
              <Comments post={note} siteUrl={siteUrl} />
            </div>

            <nav className={styles.pager}>
              <span>
                {previous && (
                  <Link to={previous.fields.slug} rel="prev">
                    ← {previous.frontmatter.title}
                  </Link>
                )}
              </span>
              <span>
                {next && (
                  <Link to={next.fields.slug} rel="next">
                    {next.frontmatter.title} →
                  </Link>
                )}
              </span>
            </nav>
          </article>
        </main>
      </div>
    </Layout>
  )
}

export default NoteTemplate

export const pageQuery = graphql`
  query NoteBySlug($slug: String!, $linked: [String]) {
    site {
      siteMetadata {
        title
        siteUrl
        author {
          name
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      headings {
        depth
        value
        id
      }
      wordCount {
        words
      }
      fields {
        slug
      }
      frontmatter {
        title
        summary
        date(formatString: "D MMMM YYYY")
        updated(formatString: "D MMMM YYYY")
        topics
        tags
        seo {
          description
        }
      }
    }
    connected: allMarkdownRemark(filter: { fields: { slug: { in: $linked } } }) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          summary
        }
      }
    }
  }
`
