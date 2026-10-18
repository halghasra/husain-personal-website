import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import EntryList from "../components/EntryList"
import { Sheet, Row, PageHead, Section } from "../components/Sheet"
import * as styles from "../styles/reading.module.css"

const STATUS_ORDER = { reading: 0, reviewed: 1, evergreen: 2 }

const PAPER_NOTE_STRUCTURE = [
  "Why I read this",
  "The question the paper is trying to answer",
  "The core idea",
  "What clicked",
  "What I am still unsure about",
  "Why it matters for my research",
  "Connected notes",
]

const ReadingPage = ({ data }) => {
  const allPosts = data.allMarkdownRemark.nodes

  const paperNotes = allPosts
    .filter(p => p.frontmatter.type === "paper-note")
    .sort((a, b) => {
      const sa = STATUS_ORDER[a.frontmatter.status] ?? 99
      const sb = STATUS_ORDER[b.frontmatter.status] ?? 99
      return sa - sb
    })

  const bookNotes = allPosts.filter(
    p =>
      !p.frontmatter.type ||
      p.frontmatter.type === "note" ||
      p.frontmatter.type === "article"
  )

  return (
    <Layout>
      <SEO
        title="Reading"
        description="Papers and books Husain is reading, wrestling with, and trying to connect to bigger questions."
      />
      <Sheet>
        <PageHead
          title="Papers I am reading, wrestling with, and trying to connect."
          margin={<><b>Reading</b><br />{paperNotes.length} papers<br />{bookNotes.length} books</>}
        >
          <p>
            Not just summaries. These are notes on why the work matters, what clicked, and what I
            am still unsure about.
          </p>
        </PageHead>

        {paperNotes.length > 0 && (
          <div className={styles.group}>
            <Row margin={<b>Papers</b>}>
              <h2 className={styles.groupTitle}>Paper notes</h2>
            </Row>
            <EntryList posts={paperNotes} showType={false} showStatus />
          </div>
        )}

        {bookNotes.length > 0 && (
          <div className={styles.group}>
            <Row margin={<b>Books</b>}>
              <h2 className={styles.groupTitle}>Book notes</h2>
            </Row>
            <EntryList posts={bookNotes} showType={false} />
          </div>
        )}

        {paperNotes.length === 0 && bookNotes.length === 0 && (
          <Row>
            <p>Reading notes are being written. Check back soon.</p>
            <p>
              In the meantime, see the <Link to="/notebook">notebook</Link> for related reading
              and thinking.
            </p>
          </Row>
        )}

        <Section margin={<><b>Method</b><br />for each paper</>} title="How I structure paper notes">
          <ol className={styles.structure}>
            {PAPER_NOTE_STRUCTURE.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </Section>
      </Sheet>
    </Layout>
  )
}

export const query = graphql`
  query ReadingQuery {
    allMarkdownRemark(
      filter: {
        fields: {
          slug: { regex: "/^/(blog|paper-notes)/" }
        }
        frontmatter: {
          tags: { in: ["Book Reviews", "Paper Notes", "Reading", "Literature", "Novels"] }
          status: { ne: "draft" }
        }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        fields { slug }
        frontmatter {
          title
          date(formatString: "D MMM YYYY")
          type
          status
          summary
          tags
        }
      }
    }
  }
`

export default ReadingPage
