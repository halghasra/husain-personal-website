import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import * as styles from "../styles/home.module.css"

const IndexPage = ({ data }) => {
  // Log all nodes first
  console.log(
    "All nodes:",
    data.allMarkdownRemark.nodes.map(node => ({
      slug: node.fields.slug,
      source: node.parent?.sourceInstanceName,
      title: node.frontmatter.title,
    }))
  )

  // Try filtering by slug pattern instead
  const latestPosts = data.allMarkdownRemark.nodes
    .filter(node => node.fields.slug.startsWith("/blog/"))
    .slice(0, 3)

  console.log("Found blog posts:", latestPosts.length)

  return (
    <Layout>
      <div className={styles.hero}>
        <h1 className={styles.heroLogo}>HG</h1>
        <h1 className={styles.heroTitle}>Husain Alghasra</h1>
        <p className={styles.heroSubtitle}>
          THE FUTURE BELONGS TO THE CURIOUS!
        </p>
      </div>

      <div className={styles.introduction}>
        <h2>Welcome to My World</h2>
        <p>Somewhere between curiosity and obsession, you'll find me.</p>
        <p>
          I'm Husain. For as long as I can remember, I've had this itch—the kind
          that makes you take things apart just to see if you can put them back
          together. Sometimes it's tech, sometimes it's ideas, and sometimes
          it's just a stubborn need to understand the why behind everything.
        </p>
        <p>
          This site? It's not some polished brand or a perfectly curated
          knowledge hub. It's just me, in my element—tinkering with thoughts,
          building things that (hopefully) work, and writing about whatever
          refuses to leave my head.
        </p>
        <p>
          By day, I build software for the insurance world—because, believe it
          or not, there's something fascinating about taking an ancient industry
          and making it move faster. By night, I'm probably knee-deep in a side
          project, arguing with a bug that shouldn't exist, or wondering why I
          thought a double espresso at 11 PM was a good idea.
        </p>
        <p>
          There's no grand vision here, no life-changing manifesto—just a place
          where I write, think, and share. If you like ideas, odd questions, and
          the kind of curiosity that makes you lose track of time, then stick
          around. We might have some things in common.
        </p>
      </div>

      <div className={styles.featuredContent}>
        <section className={styles.featuredSection}>
          <h2>Latest Posts</h2>
          {latestPosts.length > 0 ? (
            <>
              <ul className={styles.postList}>
                {latestPosts.map(post => (
                  <li key={post.fields.slug} className={styles.postItem}>
                    <Link to={post.fields.slug}>
                      {post.frontmatter.coverImage?.childImageSharp && (
                        <GatsbyImage
                          image={getImage(post.frontmatter.coverImage)}
                          alt={post.frontmatter.title}
                        />
                      )}
                      <h3>{post.frontmatter.title}</h3>
                      <p>{post.frontmatter.date}</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/blog" className={styles.viewAllLink}>
                See all posts
              </Link>
            </>
          ) : (
            <p>No posts found</p>
          )}
        </section>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { slug: { regex: "/^/blog/" } } }
      sort: { frontmatter: { date: DESC } }
      limit: 6
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          coverImage {
            childImageSharp {
              gatsbyImageData(width: 600, height: 300, layout: CONSTRAINED)
            }
          }
        }
      }
    }
  }
`

export default IndexPage
