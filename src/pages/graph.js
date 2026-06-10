import React, { useState, useEffect, useMemo } from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import ForceGraph from "../components/ForceGraph"
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

const TAG_FREQ_CAP = 7

function buildGraphData(allNodes) {
  const nodes = allNodes.map(n => ({
    id: n.fields.slug,
    label: n.frontmatter.title,
    type: n.frontmatter.type || "note",
    tags: n.frontmatter.tags || [],
    topics: n.frontmatter.topics || [],
    linked_notes: n.frontmatter.linked_notes || [],
    weight: n.frontmatter.graph?.weight || 1,
    cluster: n.frontmatter.graph?.cluster || null,
  }))

  const edges = []
  const addedExplicit = new Set()

  const tailToSlug = {}
  allNodes.forEach(n => {
    const parts = n.fields.slug.split("/").filter(Boolean)
    const tail = parts[parts.length - 1]
    tailToSlug[tail] = n.fields.slug
  })

  allNodes.forEach(n => {
    const sourceId = n.fields.slug
    ;(n.frontmatter.linked_notes || []).forEach(linkedSlug => {
      const targetId = tailToSlug[linkedSlug]
      if (!targetId || targetId === sourceId) return
      const key = [sourceId, targetId].sort().join("||")
      if (!addedExplicit.has(key)) {
        addedExplicit.add(key)
        edges.push({ source: sourceId, target: targetId, edgeType: "explicit" })
      }
    })
  })

  const tagFreq = {}
  allNodes.forEach(n => {
    ;(n.frontmatter.tags || []).forEach(tag => {
      tagFreq[tag] = (tagFreq[tag] || 0) + 1
    })
  })

  const tagToSlugs = {}
  allNodes.forEach(n => {
    ;(n.frontmatter.tags || []).forEach(tag => {
      const freq = tagFreq[tag]
      if (freq < 2 || freq > TAG_FREQ_CAP) return
      if (!tagToSlugs[tag]) tagToSlugs[tag] = []
      tagToSlugs[tag].push(n.fields.slug)
    })
  })

  const addedTagEdges = new Set()
  Object.values(tagToSlugs).forEach(slugs => {
    for (let i = 0; i < slugs.length; i++) {
      for (let j = i + 1; j < slugs.length; j++) {
        const key = [slugs[i], slugs[j]].sort().join("||")
        if (!addedTagEdges.has(key) && !addedExplicit.has(key)) {
          addedTagEdges.add(key)
          edges.push({ source: slugs[i], target: slugs[j], edgeType: "shared-tag" })
        }
      }
    }
  })

  return { nodes, edges }
}

const GraphPage = ({ data }) => {
  const [activeType, setActiveType] = useState("all")
  const [activeView, setActiveView] = useState("graph")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => { setIsClient(true) }, [])

  const allNodes = data.allMarkdownRemark.nodes

  const types = useMemo(
    () => ["all", ...Array.from(new Set(allNodes.map(n => n.frontmatter.type || "note")))],
    [allNodes]
  )

  const { nodes: graphNodes, edges: graphEdges } = useMemo(
    () => buildGraphData(allNodes),
    [allNodes]
  )

  const filteredGraphNodes = useMemo(
    () => activeType === "all" ? graphNodes : graphNodes.filter(n => n.type === activeType),
    [graphNodes, activeType]
  )

  const filteredGraphEdges = useMemo(() => {
    if (activeType === "all") return graphEdges
    const visibleIds = new Set(filteredGraphNodes.map(n => n.id))
    return graphEdges.filter(e => visibleIds.has(e.source) && visibleIds.has(e.target))
  }, [graphEdges, filteredGraphNodes, activeType])

  const filteredListNodes = useMemo(
    () => activeType === "all"
      ? allNodes
      : allNodes.filter(n => (n.frontmatter.type || "note") === activeType),
    [allNodes, activeType]
  )

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

        <div className={styles.controls}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${activeView === "graph" ? styles.viewBtnActive : ""}`}
              onClick={() => setActiveView("graph")}
            >
              Graph
            </button>
            <button
              className={`${styles.viewBtn} ${activeView === "list" ? styles.viewBtnActive : ""}`}
              onClick={() => setActiveView("list")}
            >
              List
            </button>
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
        </div>

        <div className={styles.stats}>
          <span className={styles.statItem}>{filteredGraphNodes.length} nodes</span>
          <span className={styles.statDivider}>/</span>
          <span className={styles.statItem}>{filteredGraphEdges.length} connections</span>
          <span className={styles.statDivider}>/</span>
          <span className={styles.statItem}>{graphNodes.length} total</span>
        </div>

        {activeView === "graph" && (
          <div className={styles.graphViewArea}>
            {isClient ? (
              <>
                <ForceGraph
                  nodes={filteredGraphNodes}
                  edges={filteredGraphEdges}
                  typeColors={TYPE_COLORS}
                  height={540}
                />
                <p className={styles.graphHint}>
                  Scroll to zoom &middot; Drag to pan &middot; Double-click to reset &middot; Click a node to open
                </p>
              </>
            ) : (
              <div className={styles.graphPlaceholder} style={{ height: 540 }}>
                <span>Loading graph&hellip;</span>
              </div>
            )}
          </div>
        )}

        {activeView === "list" && (
          <ul className={styles.nodeList}>
            {filteredListNodes.map(node => {
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
        )}

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
          {activeView === "graph" && (
            <div className={styles.edgeLegend}>
              <div className={styles.legendItem}>
                <svg width="24" height="10">
                  <line x1="0" y1="5" x2="24" y2="5" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" />
                </svg>
                <span className={styles.legendName}>explicit link</span>
              </div>
              <div className={styles.legendItem}>
                <svg width="24" height="10">
                  <line x1="0" y1="5" x2="24" y2="5" stroke="rgba(255,255,255,0.35)" strokeWidth="0.75" strokeDasharray="4,4" />
                </svg>
                <span className={styles.legendName}>shared tag</span>
              </div>
            </div>
          )}
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
          linked_notes
          graph {
            show
            weight
            cluster
          }
        }
      }
    }
  }
`

export default GraphPage
