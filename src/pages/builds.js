import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { siteConfig } from "../config/siteConfig"
import EntryList from "../components/EntryList"
import { Sheet, Row, PageHead, Section, sheetStyles as sheet } from "../components/Sheet"
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
      <Sheet>
        <PageHead
          title="Projects & experiments."
          margin={<><b>Builds</b><br />{FEATURED_BUILDS.length} active</>}
        >
          <p>This is where I keep track of what I am building.</p>
          <p>
            Some are small experiments. Some are prototypes. Some are attempts to understand an
            idea by forcing it to become real.
          </p>
        </PageHead>

        <Section margin={<b>On the bench</b>} title="Active projects">
          <ul className={styles.builds}>
            {FEATURED_BUILDS.map(build => (
              <li key={build.title} className={styles.build}>
                <h3 className={styles.buildTitle}>
                  {build.title} <span className={sheet.gall}>{build.status}</span>
                </h3>
                <p className={styles.buildDescription}>{build.description}</p>
                <p className={styles.buildTags}>{build.tags.join(" · ").toLowerCase()}</p>
                {build.link && (
                  <a href={build.link} className="more" target="_blank" rel="noopener noreferrer">
                    Visit ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Section>

        {buildPosts.length > 0 && (
          <div className={styles.group}>
            <Row margin={<b>Build notes</b>}>
              <h2 className={styles.groupTitle}>Build notes</h2>
            </Row>
            <EntryList posts={buildPosts} showType={false} />
          </div>
        )}

        <Section margin={<b>Elsewhere</b>}>
          <p>
            More code and experiments on{" "}
            <a href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            .
          </p>
        </Section>
      </Sheet>
    </Layout>
  )
}

export const query = graphql`
  query BuildsQuery {
    allMarkdownRemark(
      filter: {
        fields: { slug: { regex: "/^/(blog|builds)/" } }
        frontmatter: { type: { eq: "build" }, status: { ne: "draft" } }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        fields { slug }
        frontmatter {
          title
          date(formatString: "D MMM YYYY")
          summary
          tags
        }
      }
    }
  }
`

export default BuildsPage
