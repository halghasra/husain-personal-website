import React, { useRef, useEffect, useState } from "react"
import { navigate } from "gatsby"
import * as styles from "../styles/forceGraph.module.css"

const ForceGraph = ({ nodes, edges, typeColors, height = 540 }) => {
  const svgRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const svgEl = svgRef.current
    if (!svgEl || nodes.length === 0) return

    let cancelled = false

    import("d3").then(d3 => {
      if (cancelled) return

      d3.select(svgEl).selectAll("*").remove()

      const rect = svgEl.getBoundingClientRect()
      const w = rect.width || 800
      const h = height

      const svg = d3.select(svgEl).attr("viewBox", `0 0 ${w} ${h}`)

      const g = svg.append("g")

      const zoomBehavior = d3.zoom()
        .scaleExtent([0.15, 5])
        .on("zoom", event => g.attr("transform", event.transform))

      svg.call(zoomBehavior)
      svg.on("dblclick.zoom", () => {
        svg.transition().duration(600).call(zoomBehavior.transform, d3.zoomIdentity)
      })

      // D3 mutates nodes/edges in place — copy first
      const simNodes = nodes.map(n => ({
        ...n,
        x: w / 2 + (Math.random() - 0.5) * 80,
        y: h / 2 + (Math.random() - 0.5) * 80,
      }))
      const nodeById = {}
      simNodes.forEach(n => { nodeById[n.id] = n })

      const simEdges = edges
        .filter(e => nodeById[e.source] && nodeById[e.target])
        .map(e => ({ ...e }))

      const simulation = d3.forceSimulation(simNodes)
        .force("link",
          d3.forceLink(simEdges)
            .id(d => d.id)
            .distance(d => d.edgeType === "explicit" ? 90 : 130)
            .strength(d => d.edgeType === "explicit" ? 0.9 : 0.3)
        )
        .force("charge", d3.forceManyBody().strength(-280))
        .force("center", d3.forceCenter(w / 2, h / 2))
        .force("collide", d3.forceCollide(d => (d.weight || 1) * 5 + 18))
        .alphaDecay(0.025)

      const link = g.append("g").attr("class", "links")
        .selectAll("line")
        .data(simEdges)
        .join("line")
        .attr("stroke", d => d.edgeType === "explicit" ? "rgba(245,158,11,0.35)" : "rgba(255,255,255,0.07)")
        .attr("stroke-width", d => d.edgeType === "explicit" ? 1.5 : 0.75)
        .attr("stroke-dasharray", d => d.edgeType === "shared-tag" ? "4,4" : null)

      const nodeGroup = g.append("g").attr("class", "nodes")
        .selectAll("g")
        .data(simNodes)
        .join("g")
        .style("cursor", "pointer")
        .on("click", (event, d) => {
          event.stopPropagation()
          navigate(d.id)
        })
        .on("mouseenter", (event, d) => {
          setTooltip({ x: event.clientX, y: event.clientY, node: d })
          d3.select(event.currentTarget).select("circle")
            .transition().duration(120)
            .attr("r", (d.weight || 1) * 5 + 11)
            .attr("fill-opacity", 1)
        })
        .on("mousemove", event => {
          setTooltip(prev => prev ? { ...prev, x: event.clientX, y: event.clientY } : null)
        })
        .on("mouseleave", (event, d) => {
          setTooltip(null)
          d3.select(event.currentTarget).select("circle")
            .transition().duration(120)
            .attr("r", (d.weight || 1) * 5 + 5)
            .attr("fill-opacity", 0.85)
        })
        .call(
          d3.drag()
            .on("start", (event, d) => {
              if (!event.active) simulation.alphaTarget(0.3).restart()
              d.fx = d.x; d.fy = d.y
            })
            .on("drag", (event, d) => {
              d.fx = event.x; d.fy = event.y
            })
            .on("end", (event, d) => {
              if (!event.active) simulation.alphaTarget(0)
              d.fx = null; d.fy = null
            })
        )

      nodeGroup.append("circle")
        .attr("r", d => (d.weight || 1) * 5 + 5)
        .attr("fill", d => typeColors[d.type] || "#f59e0b")
        .attr("fill-opacity", 0.85)
        .attr("stroke", d => typeColors[d.type] || "#f59e0b")
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.35)

      nodeGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", d => (d.weight || 1) * 5 + 18)
        .style("font-size", "9px")
        .style("font-family", "var(--font-primary, sans-serif)")
        .style("fill", "rgba(255,255,255,0.45)")
        .style("pointer-events", "none")
        .style("user-select", "none")
        .text(d => d.label.length > 24 ? d.label.substring(0, 22) + "…" : d.label)

      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y)
        nodeGroup.attr("transform", d => `translate(${d.x ?? w / 2},${d.y ?? h / 2})`)
      })
    })

    return () => { cancelled = true }
  }, [nodes, edges, typeColors, height])

  return (
    <div className={styles.container} style={{ height }}>
      <svg ref={svgRef} className={styles.svg} />
      {tooltip?.node && (
        <div
          className={styles.tooltip}
          style={{ left: tooltip.x + 14, top: tooltip.y - 10 }}
        >
          <span className={styles.tooltipTitle}>{tooltip.node.label}</span>
          <span className={styles.tooltipMeta}>
            <span
              className={styles.tooltipType}
              style={{ color: typeColors[tooltip.node.type] || "#f59e0b" }}
            >
              {tooltip.node.type}
            </span>
            {tooltip.node.cluster && (
              <> · {tooltip.node.cluster}</>
            )}
          </span>
          <span className={styles.tooltipHint}>click to open</span>
        </div>
      )}
    </div>
  )
}

export default ForceGraph
