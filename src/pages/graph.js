import React, { useState } from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import * as styles from "../styles/graph.module.css"

const TYPE_COLORS = {
  note: "#f59e0b",
  essay: "#3b82f6",
  "research-seed": "#10b981",
  "paper-note": "#8b5cf6",
  "learning-log": "#ec4899",
  build: "#f97316",
  article: "#06b6d4",
}

const GraphPage = ({ data }) => {
  const [activeType, setActiveType] = useState("all")

  const allNodes = data.allMarkdownRemark.nodes
  const types = ["all", ...Array.from(new Set(allNodes.map(n => n.frontmatter.type || "note")))]

  const filtered =
    activeType === "all"
      ? allNodes
      : allNodes.filter(n => (n.frontmatter.type || "note") === activeType)

  return (
    <Layout>
      <SEO
        title="Neural Map"
        description="A living map of notes, readings, research seeds, and Curio Synapse lessons showing how ideas connect."
      />
      <div className={styles.graphWrapper}>
        <header className={styles.pageHeader}>
          <p className={styles.pageLabel}>Neural Map</p>
          <h1 className={styles.pageHeading}>A living map of ideas.</h1>
          <p className={styles.pageSubtitle}>
            The graph is not here to look clever. It is here to show how one thought becomes another.
          </p>
        </header>

        <div className={styles.graphNotice}>
          <p>
            The interactive graph is in development. Below is a relationship view showing
            all notes and how they are tagged and typed.
          </p>
        </div>

        <div className={styles.filters}>
          {types.map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`${styles.filterBtn} ${activeType === type ? styles.filterBtnActive : ""}`}
              style={
                activeType === type && type !== "all"
                  ? { borderColor: TYPE_COLORS[type], color: TYPE_COLORS[type] }
                  : {}
              }
            >
              {type === "all" ? "All" : type}
            </button>
          ))}
        </div>

        <div className={styles.stats}>
          <span className={styles.statItem}>{filtered.length} entries</span>
          <span className={styles.statDivider}>/</span>
          <span className={styles.statItem}>{allNodes.length} total</span>
        </div>

        <ul className={styles.nodeList}>
          {filtered.map(node => {
            const type = node.frontmatter.type || "note"
            const color = TYPE_COLORS[type] || "#f59e0b"
            return (
              <li key={node.fields.slug} className={styles.nodeItem}>
                <Link to={node.fields.slug} className={styles.nodeLink}>
                  <span
                    className={styles.nodeDot}
                    style={{ background: color }}
                    aria-hidden="true"
                  />
                  <div className={styles.nodeContent}>
                    <div className={styles.nodeMeta}>
                      <span className={styles.nodeType} style={{ color }}>
                        {type}
                      </span>
                      <time className={styles.nodeDate}>{node.frontmatter.date}</time>
                    </div>
                    <h3 className={styles.nodeTitle}>{node.frontmatter.title}</h3>
                    {node.frontmatter.tags && node.frontmatter.tags.length > 0 && (
                      <div className={styles.nodeTags}>
                        {node.frontmatter.tags.slice(0, 4).map(tag => (
                          <span key={tag} className={styles.nodeTag}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className={styles.legendSection}>
          <p className={styles.legendLabel}>Node types</p>
          <div className={styles.legend}>
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <div key={type} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: color }} />
                <span className={styles.legendName}>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query GraphQuery {
    allMarkdownRemark(
      filter: {
        fields: {
          slug: { regex: "/^/(blog|notes|essays|research-seeds|paper-notes|builds)/" }
        }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        fields { slug }
        frontmatter {
          title
          date(formatString: "DD MMM YYYY")
          type
          tags
          topics
        }
      }
    }
  }
`

export default GraphPage
