import React from "react"
import { graphql, Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/Layout"
import AuthorBio from "../components/AuthorBio"
import ShareButtons from "../components/ShareButtons"
import * as styles from "../styles/lesson.module.css"

const LessonTemplate = ({ data, pageContext }) => {
  const lesson = data.markdownRemark
  const { previous, next } = pageContext
  const coverImage = getImage(lesson.frontmatter.coverImage)

  return (
    <Layout>
      <article className={styles.lesson}>
        {coverImage && (
          <GatsbyImage 
            image={coverImage} 
            alt={lesson.frontmatter.title} 
            className={styles.coverImage}
          />
        )}
        <header>
          <h1>{lesson.frontmatter.title}</h1>
          <p>{lesson.frontmatter.date}</p>
          {lesson.frontmatter.tags && lesson.frontmatter.tags.length > 0 && (
            <div className={styles.tags}>
              {lesson.frontmatter.tags.map(tag => (
                <Link to={`/tags?tag=${tag}`} key={tag} className={styles.tag}>
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>
        <section dangerouslySetInnerHTML={{ __html: lesson.html }} />
        <ShareButtons
          url={`${data.site.siteMetadata.siteUrl}${lesson.fields.slug}`}
          title={lesson.frontmatter.title}
          description={lesson.excerpt}
        />
        <AuthorBio />
      </article>
      <nav className={styles.lessonNav}>
        <ul>
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default LessonTemplate

export const pageQuery = graphql`
  query LessonBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        siteUrl
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
        date(formatString: "MMMM DD, YYYY")
        tags
        coverImage {
          childImageSharp {
            gatsbyImageData(width: 800, height: 400, layout: CONSTRAINED)
          }
        }
      }
    }
  }
`