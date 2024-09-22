import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"
import AuthorBio from "../components/AuthorBio"
import ShareButtons from "../components/ShareButtons"
import * as styles from "../styles/blog-post.module.css"

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { previous, next } = pageContext

  return (
    <Layout location={location} title={siteTitle}>
      <article className={styles.blogPost}>
        <header>
          <h1>{post.frontmatter.title}</h1>
          <p>{post.frontmatter.date}</p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
        <ShareButtons
          url={`${data.site.siteMetadata.siteUrl}${post.fields.slug}`}
          title={post.frontmatter.title}
          description={post.excerpt}
        />
        <AuthorBio />
      </article>
      <nav className={styles.blogPostNav}>
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


export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
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
      }
    }
  }
`