import React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import PostMeta from "../components/PostMeta"
import AuthorBio from "../components/AuthorBio"
import ShareButtons from "../components/ShareButtons"
import Comments from "../components/Comments"
import * as styles from "../styles/blog-post.module.css"

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const siteUrl = data.site.siteMetadata?.siteUrl || ``
  const { previous, next } = pageContext
  const coverImage = getImage(post.frontmatter.coverImage)

  return (
    <Layout>
      <SEO post={post} siteMetadata={data.site.siteMetadata} />
      <article className={styles.blogPost}>
        {coverImage && (
          <GatsbyImage 
            image={coverImage} 
            alt={post.frontmatter.title} 
            className={styles.coverImage}
            loading="eager" // Load the image immediately
            fadeIn={true}
            placeholder="blurred"
          />
        )}
        <header>
          <h1>{post.frontmatter.title}</h1>
          <p>{post.frontmatter.date}</p>
          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
            <div className={styles.tags}>
              {post.frontmatter.tags.map(tag => (
                <Link to={`/tags?tag=${tag}`} key={tag} className={styles.tag}>
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>
        <PostMeta post={post} />
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
        <ShareButtons
          url={`${siteUrl}${post.fields.slug}`}
          title={post.frontmatter.title}
          description={post.excerpt}
        />
        <AuthorBio />
        <div className={styles.comments}>
          <Comments post={post} siteUrl={siteUrl} />
        </div>
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
        date(formatString: "MMMM DD, YYYY")
        tags
        coverImage {
          childImageSharp {
            gatsbyImageData(width: 800, height: 400, layout: CONSTRAINED)
          }
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