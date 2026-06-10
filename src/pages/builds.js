import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { siteConfig } from "../config/siteConfig"
import * as styles from "../styles/builds.module.css"

const FEATURED_BUILDS = [
  {
    title: "husainalghasra.com",
    slug: null,
    description:
      "This website. Built with Gatsby, React, and Markdown. A living public notebook and knowledge garden.",
    tags: ["Gatsby", "React", "Markdown"],
    link: siteConfig.url,
    status: "active",
  },
  {
    title: "Curio Synapse",
    slug: null,
    description:
      "A public learning garden for difficult ideas in science and technology. Where notes grow into structured lessons.",
    tags: ["Learning", "Knowledge garden"],
    link: siteConfig.socials.curioSynapse,
    status: "active",
  },
]

const BuildsPage = ({ data }) => {
  const buildPosts = data.allMarkdownRemark.nodes

  return (
    <Layout>
      <SEO
        title="Builds"
        description="Prototypes, tools, experiments, and software projects. Things that started as questions."
      />
      <div className={styles.buildsWrapper}>
        <header className={styles.pageHeader}>
          <p className={styles.pageLabel}>Builds</p>
          <h1 className={styles.pageHeading}>Projects &amp; Experiments</h1>
          <p className={styles.pageSubtitle}>
            This is where I keep track of what I am building.
          </p>
          <p className={styles.pageBody}>
            Some are small experiments. Some are prototypes. Some are attempts to understand
            an idea by forcing it to become real.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Active projects</h2>
          <ul className={styles.buildGrid}>
            {FEATURED_BUILDS.map(build => (
              <li key={build.title} className={styles.buildCard}>
                <div className={styles.buildCardHeader}>
                  <h3 className={styles.buildTitle}>{build.title}</h3>
                  <span className={`${styles.buildStatus} ${styles["status_" + build.status]}`}>
                    {build.status}
                  </span>
                </div>
                <p className={styles.buildDescription}>{build.description}</p>
                <div className={styles.buildTags}>
                  {build.tags.map(tag => (
                    <span key={tag} className={styles.buildTag}>{tag}</span>
                  ))}
                </div>
                {build.link && (
                  <a
                    href={build.link}
                    className={styles.buildLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit &rarr;
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>

        {buildPosts.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Build notes</h2>
            <ul className={styles.postList}>
              {buildPosts.map(post => (
                <li key={post.fields.slug} className={styles.postItem}>
                  <Link to={post.fields.slug} className={styles.postLink}>
                    <time className={styles.postDate}>{post.frontmatter.date}</time>
                    <h3 className={styles.postTitle}>{post.frontmatter.title}</h3>
                    {post.frontmatter.summary && (
                      <p className={styles.postSummary}>{post.frontmatter.summary}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={styles.githubSection}>
          <p>
            More code and experiments on{" "}
            <a
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </section>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query BuildsQuery {
    allMarkdownRemark(
      filter: {
        fields: { slug: { regex: "/^/blog/" } }
        frontmatter: { type: { eq: "build" } }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        fields { slug }
        frontmatter {
          title
          date(formatString: "DD MMM YYYY")
          summary
          tags
        }
      }
    }
  }
`

export default BuildsPage
