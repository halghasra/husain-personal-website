import React, { useEffect, useMemo, useRef, useState, useContext } from "react"
import { navigate } from "gatsby"
import { useCatalogue } from "../hooks/useCatalogue"
import { ThemeContext } from "./ThemeContext"
import * as styles from "../styles/plate.module.css"

// Same rule as the Neural Map: tags shared by 2 to 7 entries draw an edge.
const TAG_FREQ_CAP = 7
const TYPE_VAR = {
  note: "--t-note", essay: "--t-essay", "research-seed": "--t-seed", "paper-note": "--t-paper",
  "learning-log": "--t-log", build: "--t-build", article: "--t-article",
}

// Older entries start on the left and newer on the right, so time reads across the plate.
const homeX = (i, count, W) => W * (0.1 + 0.8 * (count > 1 ? i / (count - 1) : 0.5))

function layout(entries, edges, W, H) {
  let s = 7
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280
  const P = entries.map((_, i) => ({
    x: homeX(i, entries.length, W) + (rnd() - 0.5) * 60,
    y: H * (0.2 + 0.6 * rnd()), vx: 0, vy: 0,
  }))
  for (let it = 0; it < 420; it++) {
    for (let a = 0; a < P.length; a++) {
      for (let b = a + 1; b < P.length; b++) {
        let dx = P[b].x - P[a].x, dy = P[b].y - P[a].y
        const d2 = dx * dx + dy * dy + 0.01, f = 900 / d2, d = Math.sqrt(d2)
        dx /= d; dy /= d
        P[a].vx -= dx * f; P[a].vy -= dy * f; P[b].vx += dx * f; P[b].vy += dy * f
      }
    }
    edges.forEach(([a, b, w]) => {
      const dx = P[b].x - P[a].x, dy = P[b].y - P[a].y
      const d = Math.hypot(dx, dy) || 1, f = (d - 70) * 0.004 * w
      P[a].vx += (dx / d) * f; P[a].vy += (dy / d) * f; P[b].vx -= (dx / d) * f; P[b].vy -= (dy / d) * f
    })
    P.forEach((p, i) => {
      p.vx += (homeX(i, P.length, W) - p.x) * 0.0025
      p.vy += (H / 2 - p.y) * 0.004
      p.x += Math.max(-8, Math.min(8, p.vx)); p.y += Math.max(-8, Math.min(8, p.vy))
      p.vx *= 0.6; p.vy *= 0.6
      p.x = Math.max(24, Math.min(W - 24, p.x)); p.y = Math.max(30, Math.min(H - 48, p.y))
    })
  }
  return P
}

const NotebookPlate = () => {
  const { entries } = useCatalogue()
  const { isDarkMode } = useContext(ThemeContext)
  const canvasRef = useRef(null)
  const state = useRef({ P: [], W: 0, H: 0, hover: -1 })
  const [hover, setHover] = useState(-1)

  const edges = useMemo(() => {
    const freq = {}
    entries.forEach(e => e.tags.forEach(t => { freq[t] = (freq[t] || 0) + 1 }))
    const out = []
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const shared = entries[i].tags.filter(
          t => entries[j].tags.includes(t) && freq[t] >= 2 && freq[t] <= TAG_FREQ_CAP
        )
        if (shared.length) out.push([i, j, shared.length])
      }
    }
    return out
  }, [entries])

  const degree = useMemo(() => {
    const d = entries.map(() => 0)
    edges.forEach(([a, b]) => { d[a]++; d[b]++ })
    return d
  }, [entries, edges])

  // Year ticks: the first entry of each year that starts a new stretch of writing
  const ticks = useMemo(() => {
    const seen = new Set()
    const t = []
    entries.forEach((e, i) => {
      if (!seen.has(e.year)) { seen.add(e.year); t.push([i, e.year]) }
    })
    return t
  }, [entries])

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext("2d")
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let raf = 0
    const tok = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim()

    const draw = t => {
      const { P, W, H, hover: hv } = state.current
      const rule = tok("--rule"), cyan = tok("--cyan"), faint = tok("--ink-faint")
      ctx.clearRect(0, 0, W, H)

      ctx.font = "11px 'Fragment Mono', ui-monospace, monospace"
      ctx.fillStyle = faint
      ctx.textAlign = "center"
      // Walk from the newest year back, so recent years win when labels would collide
      let lastX = Infinity
      ticks.slice().reverse().forEach(([i, label]) => {
        const x = homeX(i, entries.length, W)
        if (lastX - x < 44) return
        ctx.fillText(label, x, H - 30)
        lastX = x
      })

      const Q = P.map((p, i) =>
        reduced ? p : { x: p.x + Math.sin(t / 2400 + i * 1.7) * 1.6, y: p.y + Math.cos(t / 2900 + i * 2.3) * 1.6 }
      )
      edges.forEach(([a, b]) => {
        const lit = hv === a || hv === b
        ctx.strokeStyle = lit ? cyan : rule
        ctx.globalAlpha = lit ? 0.9 : 0.85
        ctx.lineWidth = lit ? 1.1 : 0.7
        ctx.beginPath(); ctx.moveTo(Q[a].x, Q[a].y); ctx.lineTo(Q[b].x, Q[b].y); ctx.stroke()
      })
      ctx.globalAlpha = 1
      entries.forEach((e, i) => {
        const r = 2.4 + Math.min(4, degree[i] * 0.22)
        ctx.fillStyle = tok(TYPE_VAR[e.type] || "--t-note")
        if (i === hv) { ctx.shadowColor = cyan; ctx.shadowBlur = 14 }
        ctx.beginPath(); ctx.arc(Q[i].x, Q[i].y, i === hv ? r + 2 : r, 0, Math.PI * 2); ctx.fill()
        ctx.shadowBlur = 0
      })
      if (!reduced) raf = requestAnimationFrame(draw)
    }

    const size = () => {
      const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1
      if (!r.width) return
      state.current.W = r.width
      state.current.H = r.height
      cv.width = r.width * dpr
      cv.height = r.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      state.current.P = layout(entries, edges, r.width, r.height)
      if (reduced) draw(0)
    }

    const pick = ev => {
      const r = cv.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top
      let best = -1, bd = 196
      state.current.P.forEach((p, i) => {
        const d = (p.x - x) ** 2 + (p.y - y) ** 2
        if (d < bd) { bd = d; best = i }
      })
      return best
    }
    const onMove = ev => {
      const best = pick(ev)
      state.current.hover = best
      setHover(best)
      cv.style.cursor = best >= 0 ? "pointer" : "crosshair"
      if (reduced) draw(0)
    }
    const onLeave = () => { state.current.hover = -1; setHover(-1); if (reduced) draw(0) }
    const onClick = ev => {
      const best = pick(ev)
      if (best >= 0) navigate(entries[best].slug)
    }

    size()
    if (!reduced) raf = requestAnimationFrame(draw)
    if (document.fonts) document.fonts.ready.then(() => reduced && draw(0))
    window.addEventListener("resize", size)
    cv.addEventListener("mousemove", onMove)
    cv.addEventListener("mouseleave", onLeave)
    cv.addEventListener("click", onClick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", size)
      cv.removeEventListener("mousemove", onMove)
      cv.removeEventListener("mouseleave", onLeave)
      cv.removeEventListener("click", onClick)
    }
  }, [entries, edges, degree, ticks, isDarkMode])

  const h = hover >= 0 ? entries[hover] : null
  const hoverText = h
    ? `N° ${h.n} · ${h.title.length > 46 ? h.title.slice(0, 44) + "…" : h.title}`
    : "hover a node"

  return (
    <div className={styles.frame}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-label={`A network of all ${entries.length} notebook entries, joined where they share a tag`}
        role="img"
      />
      <span className={`${styles.corner} ${styles.tl}`}>PL. I</span>
      <span className={`${styles.corner} ${styles.tr}`}>neural map</span>
      <span className={`${styles.corner} ${styles.bl}`}>
        {entries.length} nodes · {edges.length} edges
      </span>
      <span className={`${styles.corner} ${styles.br}`} aria-live="polite">{hoverText}</span>
    </div>
  )
}

export default NotebookPlate
