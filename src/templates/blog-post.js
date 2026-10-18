import React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import AuthorBio from "../components/AuthorBio"
import ShareButtons from "../components/ShareButtons"
import Comments from "../components/Comments"
import { Sheet, Row, sheetStyles as sheet } from "../components/Sheet"
import { useCatalogue } from "../hooks/useCatalogue"
import { typeLabel } from "../config/entryTypes"
import * as styles from "../styles/note.module.css"

// Essays, book notes, articles and builds. Same ruled sheet and prose as notes.
const BlogPostTemplate = ({ data, pageContext }) => {
  const post = data.markdownRemark
  const fm = post.frontmatter
  const siteUrl = data.site.siteMetadata?.siteUrl || ``
  const { previous, next } = pageContext
  const coverImage = getImage(fm.coverImage)
  const { numberOf } = useCatalogue()

  const n = numberOf(post.fields.slug)
  const minutes = Math.max(1, Math.ceil((post.wordCount?.words || 0) / 200))
  const headings = post.headings.filter(h => h.depth >= 2 && h.depth <= 3)
  let section = 0
  const toc = headings.map(h => ({ ...h, sec: h.depth === 2 ? ++section : null }))
  const label = p => (numberOf(p.fields.slug) ? `N° ${numberOf(p.fields.slug)} ` : "")

  return (
    <Layout>
      <SEO post={post} siteMetadata={data.site.siteMetadata} />
      <Sheet>
        <Row
          as="header"
          className={styles.noteHead}
          margin={
            <>
              <Link to="/notebook" className={styles.back}>← notebook</Link>
              <span className={styles.metaBlock}>
                {n && <b>N° {n}</b>} · {typeLabel(fm.type).toLowerCase()}<br />
                <time>{fm.date}</time><br />
                {minutes} min read
                {fm.status && fm.status !== "published" && (
                  <><br /><span className={sheet.gall}>{fm.status}</span></>
                )}
              </span>
            </>
          }
        >
          <h1 className={styles.noteTitle}>{fm.title}</h1>
          {fm.summary && <p className={styles.noteLede}>{fm.summary}</p>}
          {fm.tags && fm.tags.length > 0 && (
            <div className={styles.tags}>
              {fm.tags.map(tag => (
                <Link to={`/tags?tag=${tag}`} key={tag} className="tag">
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </Row>

        <Row
          margin={
            toc.length > 0 && (
              <nav className={styles.toc} aria-label="On this page">
                <b>Contents</b>
                <ol>
                  {toc.map(h => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className={`${styles.tocLink} ${h.depth === 3 ? styles.tocLinkSub : ""}`}
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
            {coverImage && (
              <GatsbyImage
                image={coverImage}
                alt={fm.title}
                className={styles.cover}
                loading="eager"
              />
            )}
            <div className={styles.noteBody} dangerouslySetInnerHTML={{ __html: post.html }} />

            <div className={styles.endmatter}>
              <ShareButtons
                url={`${siteUrl}${post.fields.slug}`}
                title={fm.title}
                description={post.excerpt}
              />
              <AuthorBio />
            </div>
            <div className={styles.comments}>
              <Comments post={post} siteUrl={siteUrl} />
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

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
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
      fields {
        slug
      }
      frontmatter {
        title
        summary
        type
        status
        date(formatString: "D MMMM YYYY")
        tags
        coverImage {
          childImageSharp {
            gatsbyImageData(width: 800, height: 400, layout: CONSTRAINED)
          }
          publicURL
        }
      }
      headings {
        id
        value
        depth
      }
      wordCount {
        words
      }
    }
  }
`
