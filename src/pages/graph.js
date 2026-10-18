import React, { useState, useEffect, useMemo } from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import ForceGraph from "../components/ForceGraph"
import { Sheet, Row, PageHead, sheetStyles as sheet } from "../components/Sheet"
import { useCatalogue } from "../hooks/useCatalogue"
import { TYPE_COLORS, typeLabel } from "../config/entryTypes"
import * as styles from "../styles/graph.module.css"

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

  const { numberOf } = useCatalogue()
  const typeCount = t => allNodes.filter(n => (n.frontmatter.type || "note") === t).length

  return (
    <Layout>
      <SEO
        title="Neural Map"
        description="A living map of notes, essays, readings and research seeds, showing how ideas connect."
      />
      <Sheet>
        <PageHead
          title="A living map of ideas."
          margin={<><b>Neural Map</b><br />{graphNodes.length} nodes<br />{graphEdges.length} connections</>}
        >
          <p>The graph is not here to look clever. It is here to show how one thought becomes another.</p>
        </PageHead>

        <Row margin={<b>View</b>} className={styles.controlRow}>
          <div className={sheet.filters} role="group" aria-label="Choose a view">
            {["graph", "list"].map(v => (
              <button
                key={v}
                type="button"
                aria-pressed={activeView === v}
                className={`${sheet.filter} ${activeView === v ? sheet.filterActive : ""}`}
                onClick={() => setActiveView(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </Row>
        <Row margin={<b>Filter</b>} className={styles.controlRow}>
          <div className={sheet.filters} role="group" aria-label="Filter by type">
            {types.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setActiveType(type)}
                aria-pressed={activeType === type}
                className={`${sheet.filter} ${activeType === type ? sheet.filterActive : ""}`}
                style={activeType === type && type !== "all" ? { borderBottomColor: TYPE_COLORS[type] } : {}}
              >
                {type === "all" ? "all" : typeLabel(type).toLowerCase()}
                <sup>{type === "all" ? allNodes.length : typeCount(type)}</sup>
              </button>
            ))}
          </div>
        </Row>

        {activeView === "graph" && (
          <figure className={styles.plate}>
            {isClient ? (
              <ForceGraph
                nodes={filteredGraphNodes}
                edges={filteredGraphEdges}
                typeColors={TYPE_COLORS}
                height={560}
              />
            ) : (
              <div className={styles.graphPlaceholder} style={{ height: 560 }}>
                <span>Loading graph&hellip;</span>
              </div>
            )}
            <figcaption className={styles.caption}>
              <span className={styles.plateNo}>Plate II.</span> {filteredGraphNodes.length} entries
              and {filteredGraphEdges.length} connections. Solid lines are links I made on purpose;
              dashed lines join entries that share a tag. Hover a node for its title, scroll to zoom
              in and read every title, drag to pan, double-click to reset, and click a node to open it.
            </figcaption>
          </figure>
        )}

        {activeView === "list" && (
          <ol className={styles.nodeList}>
            {filteredListNodes.map(node => {
              const type = node.frontmatter.type || "note"
              const n = numberOf(node.fields.slug)
              return (
                <li key={node.fields.slug} className={styles.nodeItem} style={{ "--c": TYPE_COLORS[type] }}>
                  <div className={styles.nodeMargin}>
                    {n && <span className={styles.nodeNum}>N° {n}</span>}
                    <time>{node.frontmatter.date}</time>
                  </div>
                  <Link to={node.fields.slug} className={styles.nodeLink}>
                    <span className={styles.nodeDot} aria-hidden="true" />
                    <span className={styles.nodeTitle}>{node.frontmatter.title}</span>
                    <span className={styles.nodeMeta}>
                      <span className={styles.nodeType}>{typeLabel(type).toLowerCase()}</span>
                      {node.frontmatter.tags && node.frontmatter.tags.length > 0 && (
                        <> · {node.frontmatter.tags.slice(0, 4).join(", ").toLowerCase()}</>
                      )}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>
        )}

        <Row margin={<b>Key</b>} className={styles.legendRow}>
          <div className={styles.legend}>
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <span key={type} className={styles.legendItem} style={{ "--c": color }}>
                {typeLabel(type).toLowerCase()}
              </span>
            ))}
          </div>
          {activeView === "graph" && (
            <div className={styles.legend}>
              <span className={styles.edgeItem}>
                <svg width="24" height="10" aria-hidden="true">
                  <line x1="0" y1="5" x2="24" y2="5" style={{ stroke: "var(--cyan)" }} strokeWidth="1.5" />
                </svg>
                explicit link
              </span>
              <span className={styles.edgeItem}>
                <svg width="24" height="10" aria-hidden="true">
                  <line x1="0" y1="5" x2="24" y2="5" style={{ stroke: "var(--ink-faint)" }} strokeWidth="0.75" strokeDasharray="4,4" />
                </svg>
                shared tag
              </span>
            </div>
          )}
        </Row>
      </Sheet>
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
        frontmatter: { status: { ne: "draft" } }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        fields { slug }
        frontmatter {
          title
          date(formatString: "D MMM YYYY")
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
