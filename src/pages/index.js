import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import NotebookPlate from "../components/NotebookPlate"
import EntryList from "../components/EntryList"
import { Sheet, Row, Section, Problem, sheetStyles as sheet } from "../components/Sheet"
import { useCatalogue } from "../hooks/useCatalogue"
import { TYPE_LABELS, typeColor } from "../config/entryTypes"
import * as styles from "../styles/home.module.css"

const IndexPage = ({ data }) => {
  const { entries, total, firstYear } = useCatalogue()
  const latestPosts = data.allMarkdownRemark.nodes
  const typesPresent = Object.keys(TYPE_LABELS).filter(t => entries.some(e => e.type === t))
  const buildCount = entries.filter(e => e.type === "build").length

  return (
    <Layout>
      <SEO title="Husain Alghasra" description="A public notebook for curiosity, research, AI, systems, and knowledge work." />

      <Sheet>
        {/* Hero */}
        <Row
          className={styles.hero}
          margin={
            <>
              <b>Public notebook</b><br />
              London<br />
              51.51° N, 0.13° W<br /><br />
              kept since {firstYear}<br />
              <b>{total}</b> entries
            </>
          }
        >
          <p className={styles.hello}>Hi, I&rsquo;m Husain.</p>
          <h1 className={styles.thesis}>
            I collect questions, take systems apart, and write about <em>the pieces</em> I find.
          </h1>
          <div className={styles.lede}>
            <p>
              This is my public notebook: thoughts, research seeds, reading notes, experiments,
              and the occasional idea that refuses to leave me alone.
            </p>
            <p>
              Some notes are polished. Some are still forming. I keep them here because thinking
              becomes clearer when it has somewhere to live.
            </p>
          </div>
          <div className={styles.acts}>
            <Link to="/notebook" className={styles.primary}>Read the notebook →</Link>
            <Link to="/about">About me</Link>
          </div>
        </Row>

        {/* Plate I: the Neural Map in miniature */}
        <figure className={styles.plate}>
          <NotebookPlate />
          <figcaption className={styles.caption}>
            <span className={styles.plateNo}>Plate I.</span> The notebook as a network. Each point
            is an entry; a line joins two entries that share a tag. Older entries sit to the left,
            newer ones to the right. Click a point to open it, or{" "}
            <Link to="/graph">explore the full Neural Map</Link>.
            <span className={styles.legend}>
              {typesPresent.map(t => (
                <span key={t} style={{ "--c": typeColor(t) }}>
                  {TYPE_LABELS[t].toLowerCase()} · {entries.filter(e => e.type === t).length}
                </span>
              ))}
            </span>
          </figcaption>
        </figure>

        {/* The open question, set as a theorem */}
        <Section
          margin={<><b>Open question</b><br />since Jan 2026<br /><span className={sheet.gall}>still open</span></>}
        >
          <Problem
            label="Question 1"
            tag="traceability"
            statement="How do we build AI systems that can explain where their answers came from?"
          >
            A citation pasted underneath is not enough. I want a real trail of reasoning, evidence,
            uncertainty and context. The question sits between trustworthy AI, knowledge graphs,
            research methods and human judgement.
          </Problem>
          <Link to="/research" className="more">Research direction →</Link>
        </Section>

        {/* Latest entries */}
        <div className={styles.latest}>
          <Row margin={<><b>Latest entries</b><br /><Link to="/notebook">all {total} →</Link></>}>
            <h2 className={sheet.sectionTitle}>From the notebook</h2>
          </Row>
          {latestPosts.length > 0 ? (
            <EntryList posts={latestPosts} />
          ) : (
            <Row><p className={styles.empty}>No notes yet. Check back soon.</p></Row>
          )}
        </div>

        {/* Research + Curio Synapse */}
        <Section margin={<><b>Direction</b><br />&amp; elsewhere</>} title="Research, and the garden next door">
          <div className={styles.two}>
            <div>
              <p>
                My focus is moving towards AI, machine learning and deep learning, and above all
                the structures that make intelligent systems reliable, explainable and useful in
                the real world. I am less interested in treating AI as magic.
              </p>
              <p className={styles.keywords}>
                <b>Keywords:</b> trustworthy AI; traceability; human–AI collaboration; knowledge
                graphs; deep learning.
              </p>
              <Link to="/research" className="more">Research →</Link>
            </div>
            <div>
              <p>
                Some thoughts stay here as notes. Some grow into lessons on <em>Curio Synapse</em>,
                my public learning garden for difficult ideas in science and technology.
              </p>
              <p className={styles.soft}>This site is the notebook. Curio Synapse is the garden.</p>
              <a href="https://curiosynapse.com" className="more" target="_blank" rel="noopener noreferrer">
                Visit Curio Synapse ↗
              </a>
            </div>
          </div>
        </Section>

        {/* Builds */}
        <Section margin={<><b>Builds</b><br />{buildCount} active</>}>
          <p>
            Sometimes the best way to understand an idea is to build a small version of it. The
            workbench keeps prototypes, tools, experiments and systems that started as questions.
          </p>
          <Link to="/builds" className="more">See what I&rsquo;m building →</Link>
        </Section>
      </Sheet>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: {
        fields: { slug: { regex: "/^/(blog|notes|essays|research-seeds|paper-notes|builds)/" } }
        frontmatter: { status: { ne: "draft" } }
      }
      limit: 4
    ) {
      nodes {
        excerpt(pruneLength: 140)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "D MMM YYYY")
          title
          type
          summary
          tags
        }
      }
    }
  }
`

export default IndexPage
