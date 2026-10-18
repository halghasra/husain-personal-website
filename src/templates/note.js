import React, { useEffect, useState } from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import ShareButtons from "../components/ShareButtons"
import AuthorBio from "../components/AuthorBio"
import Comments from "../components/Comments"
import { Sheet, Row, sheetStyles as sheet } from "../components/Sheet"
import { useCatalogue } from "../hooks/useCatalogue"
import { typeLabel } from "../config/entryTypes"
import * as styles from "../styles/note.module.css"

// Long-form reading template for notebook notes (content/notes).
// Margin: catalogue data and a sticky, numbered contents. Main column: the note, then connected notes.
const NoteTemplate = ({ data, pageContext }) => {
  const note = data.markdownRemark
  const { frontmatter, html, headings, fields, wordCount } = note
  const siteUrl = data.site.siteMetadata?.siteUrl || ``
  const connected = data.connected.nodes
  const { previous, next } = pageContext
  const { numberOf } = useCatalogue()

  const tocHeadings = headings.filter(h => h.depth >= 2 && h.depth <= 3)
  const minutes = Math.max(1, Math.ceil((wordCount?.words || 0) / 220))
  const description =
    frontmatter.seo?.description || frontmatter.summary || note.excerpt

  // Section numbers match the § counters drawn on the h2s in the body
  let section = 0
  const numberedToc = tocHeadings.map(h => ({ ...h, sec: h.depth === 2 ? ++section : null }))

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

  const n = numberOf(fields.slug)
  const label = p => {
    const num = numberOf(p.fields.slug)
    return num ? `N° ${num} ` : ""
  }

  return (
    <Layout>
      <SEO
        post={{ ...note, excerpt: description }}
        siteMetadata={data.site.siteMetadata}
      />
      <Sheet>
        <Row
          as="header"
          className={styles.noteHead}
          margin={
            <>
              <Link to="/notebook" className={styles.back}>← notebook</Link>
              <span className={styles.metaBlock}>
                {n && <b>N° {n}</b>} · {typeLabel(frontmatter.type).toLowerCase()}<br />
                <time>{frontmatter.date}</time><br />
                {frontmatter.updated && frontmatter.updated !== frontmatter.date && (
                  <>updated {frontmatter.updated}<br /></>
                )}
                {minutes} min read
                {frontmatter.status && (
                  <><br /><span className={sheet.gall}>{frontmatter.status}</span></>
                )}
              </span>
            </>
          }
        >
          <h1 className={styles.noteTitle}>{frontmatter.title}</h1>
          {frontmatter.summary && <p className={styles.noteLede}>{frontmatter.summary}</p>}
          {frontmatter.topics && frontmatter.topics.length > 0 && (
            <p className={styles.topics}>{frontmatter.topics.join(" · ")}</p>
          )}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className={styles.tags}>
              {frontmatter.tags.map(tag => (
                <Link to={`/tags?tag=${tag}`} key={tag} className="tag">
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </Row>

        <Row
          margin={
            numberedToc.length > 0 && (
              <nav className={styles.toc} aria-label="On this page">
                <b>Contents</b>
                <ol>
                  {numberedToc.map(h => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className={[
                          styles.tocLink,
                          h.depth === 3 ? styles.tocLinkSub : "",
                          activeId === h.id ? styles.tocLinkActive : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {h.sec && <span className={styles.tocNum}>{h.sec}</span>}
                        {h.value}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )
          }
        >
          <article>
            <div
              className={styles.noteBody}
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {connected.length > 0 && (
              <section className={styles.connected}>
                <h2 className={styles.connectedTitle}>Connected notes</h2>
                <ol>
                  {connected.map(c => (
                    <li key={c.fields.slug}>
                      <span className={styles.connNum}>
                        {numberOf(c.fields.slug) ? `N° ${numberOf(c.fields.slug)}` : ""}
                      </span>
                      <div>
                        <Link to={c.fields.slug}>{c.frontmatter.title}</Link>
                        {c.frontmatter.summary && <p>{c.frontmatter.summary}</p>}
                      </div>
                    </li>
                  ))}
                </ol>
                <Link to="/graph" className="more">
                  See how it all connects on the Neural Map →
                </Link>
              </section>
            )}

            <div className={styles.endmatter}>
              <ShareButtons
                url={`${siteUrl}${fields.slug}`}
                title={frontmatter.title}
                description={description}
              />
              <AuthorBio />
            </div>
            <div className={styles.comments}>
              <Comments post={note} siteUrl={siteUrl} />
            </div>

            <nav className={styles.pager} aria-label="Previous and next">
              <span>
                {previous && (
                  <Link to={previous.fields.slug} rel="prev">
                    ← {label(previous)}{previous.frontmatter.title}
                  </Link>
                )}
              </span>
              <span>
                {next && (
                  <Link to={next.fields.slug} rel="next">
                    {label(next)}{next.frontmatter.title} →
                  </Link>
                )}
              </span>
            </nav>
          </article>
        </Row>
      </Sheet>
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
        type
        status
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
