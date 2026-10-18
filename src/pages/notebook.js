import React, { useState } from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import EntryList from "../components/EntryList"
import { Sheet, Row, PageHead, sheetStyles as sheet } from "../components/Sheet"
import { useCatalogue } from "../hooks/useCatalogue"
import { typeLabel } from "../config/entryTypes"
import * as styles from "../styles/notebook.module.css"

const NotebookPage = ({ data }) => {
  const [activeFilter, setActiveFilter] = useState("all")
  const { total, firstYear, lastYear } = useCatalogue()

  const allPosts = data.allMarkdownRemark.nodes
  const typeOf = p => p.frontmatter.type || "note"
  const filtered = activeFilter === "all" ? allPosts : allPosts.filter(p => typeOf(p) === activeFilter)
  const types = ["all", ...Array.from(new Set(allPosts.map(typeOf)))]

  // Group by year, newest first: the notebook reads as a chronicle
  const years = []
  filtered.forEach(p => {
    const y = p.frontmatter.year
    if (!years.length || years[years.length - 1].year !== y) years.push({ year: y, posts: [] })
    years[years.length - 1].posts.push(p)
  })

  return (
    <Layout>
      <SEO
        title="Notebook"
        description="A living archive of thoughts, notes, essays, and research seeds. Imperfect and evolving."
      />
      <Sheet>
        <PageHead
          title="A living archive of thoughts."
          margin={<><b>Notebook</b><br />{firstYear}–{lastYear}<br />{total} entries</>}
        >
          <p>Notes, essays, research seeds and reading notes, numbered in the order I wrote them.</p>
          <p>Imperfect and evolving.</p>
        </PageHead>

        <Row margin={<b>Filter</b>} className={styles.filterRow}>
          <div className={sheet.filters} role="group" aria-label="Filter entries by type">
            {types.map(type => {
              const count = type === "all" ? allPosts.length : allPosts.filter(p => typeOf(p) === type).length
              const active = activeFilter === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveFilter(type)}
                  aria-pressed={active}
                  className={`${sheet.filter} ${active ? sheet.filterActive : ""}`}
                >
                  {type === "all" ? "all" : typeLabel(type).toLowerCase()}
                  <sup>{count}</sup>
                </button>
              )
            })}
          </div>
        </Row>

        {years.length > 0 ? (
          years.map(({ year, posts }) => (
            <section key={year} className={styles.year} aria-label={year}>
              <Row margin={<span className={styles.yearLabel}>{year}</span>}>
                <span className={styles.yearCount}>
                  {posts.length} {posts.length === 1 ? "entry" : "entries"}
                </span>
              </Row>
              <EntryList posts={posts} />
            </section>
          ))
        ) : (
          <Row><p className={styles.empty}>No entries match this filter.</p></Row>
        )}
      </Sheet>
    </Layout>
  )
}

export const query = graphql`
  query NotebookQuery {
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
        excerpt(pruneLength: 140)
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "D MMM")
          year: date(formatString: "YYYY")
          type
          status
          summary
          tags
        }
      }
    }
  }
`

export default NotebookPage
