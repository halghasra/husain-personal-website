import React, { useEffect, useState } from "react"
import { graphql, Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import * as styles from "../styles/lesson.module.css"

const LessonTemplate = ({ data }) => {
  const lesson = data.markdownRemark
  const { frontmatter, html, headings, fields } = lesson
  const coverImage = getImage(frontmatter.coverImage)

  // Show h2 and h3 only in the sidebar TOC
  const tocHeadings = headings.filter(h => h.depth >= 2 && h.depth <= 3)

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
  }, [])

  return (
    <Layout fullWidth>
      <SEO post={lesson} siteMetadata={data.site.siteMetadata} />
      <div className={styles.lessonContainer}>

        {/* Left sidebar — lesson TOC */}
        <aside className={styles.lessonSidebar}>
          <div className={styles.sidebarInner}>
            <Link to="/learning-hub" className={styles.sidebarBack}>
              ← Learning Hub
            </Link>

            {(frontmatter.category || frontmatter.topic) && (
              <div className={styles.sidebarMeta}>
                {frontmatter.category && (
                  <span className={styles.sidebarCategory}>{frontmatter.category}</span>
                )}
                {frontmatter.topic && (
                  <span className={styles.sidebarTopic}>{frontmatter.topic}</span>
                )}
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

        {/* Main content */}
        <main className={styles.lessonMain}>
          <article className={styles.lessonContent}>
            {coverImage ? (
              <GatsbyImage
                image={coverImage}
                alt={frontmatter.title}
                className={styles.coverImage}
              />
            ) : frontmatter.coverImage?.publicURL ? (
              <img
                src={frontmatter.coverImage.publicURL}
                alt={frontmatter.title}
                className={styles.coverImage}
              />
            ) : null}

            <h1 className={styles.lessonTitle}>{frontmatter.title}</h1>

            <div
              className={styles.lessonBody}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </article>
        </main>
      </div>
    </Layout>
  )
}

export default LessonTemplate

export const pageQuery = graphql`
  query($slug: String!) {
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
      excerpt(pruneLength: 160)
      html
      headings {
        depth
        value
        id
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        category
        topic
        unit
        coverImage {
          publicURL
          childImageSharp {
            gatsbyImageData(width: 1200, layout: CONSTRAINED)
          }
        }
      }
      fields {
        slug
        categorySlug
        topicSlug
        unitSlug
      }
    }
  }
`
