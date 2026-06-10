import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import * as styles from "../styles/research.module.css"

const FOCUS_AREAS = [
  {
    title: "Trustworthy AI",
    body: "How do we design AI systems that can be checked, challenged, and trusted? Not just through performance metrics, but through transparency of process, auditability of decisions, and the ability to fail gracefully.",
  },
  {
    title: "Traceability",
    body: "How do we preserve the trail between data, reasoning, output, and decision? I am interested in the chain of provenance: from source to inference, from evidence to conclusion.",
  },
  {
    title: "Human-AI Collaboration",
    body: "How do we design systems where AI helps humans think better, rather than replacing judgement with automation? The interface between human cognition and machine output is one of the most underexplored problems in applied AI.",
  },
  {
    title: "Knowledge Graphs and Memory",
    body: "How do we structure information so that ideas can be found, connected, and reused over time? This links to Curio Synapse: building systems that preserve the trail of learning.",
  },
  {
    title: "Deep Learning Foundations",
    body: "What makes modern neural networks powerful, fragile, interpretable, or opaque? Understanding the mechanisms under the performance numbers matters if we want to build systems we can trust.",
  },
]

const ResearchPage = ({ data }) => {
  const researchPosts = data.allMarkdownRemark.nodes

  return (
    <Layout>
      <SEO
        title="Research"
        description="Active questions, research seeds, and academic direction in AI, machine learning, trustworthy systems, and traceability."
      />
      <div className={styles.researchWrapper}>
        <header className={styles.pageHeader}>
          <p className={styles.pageLabel}>Research</p>
          <h1 className={styles.pageHeading}>
            Questions I might spend years trying to answer.
          </h1>
          <p className={styles.pageSubtitle}>
            This is not a finished research profile yet.
            It is where I keep the questions.
          </p>
        </header>

        <div className={styles.statement}>
          <p>
            My work is currently moving towards artificial intelligence, machine learning,
            deep learning, trustworthy AI, traceability, explainability, and human-AI decision support.
          </p>
          <p>
            I am especially interested in the gap between a model producing an answer and a human
            being able to trust, verify, and act on it. That gap is not a UX problem. It is a
            fundamentally hard problem in epistemics, system design, and the relationship between
            algorithmic reasoning and human judgement.
          </p>
        </div>

        <section className={styles.focusSection}>
          <h2 className={styles.sectionHeading}>Research focus areas</h2>
          <div className={styles.focusGrid}>
            {FOCUS_AREAS.map(area => (
              <div key={area.title} className={styles.focusCard}>
                <h3 className={styles.focusTitle}>{area.title}</h3>
                <p className={styles.focusBody}>{area.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.activeSection}>
          <h2 className={styles.sectionHeading}>Active question</h2>
          <div className={styles.activeCard}>
            <p className={styles.activeQuestion}>
              How do we build AI systems that can explain where their answers came from?
            </p>
            <p className={styles.activeDetail}>
              Not just with a citation pasted underneath, but with a real trail of reasoning,
              evidence, uncertainty, and context. The answer sits somewhere between knowledge
              graphs, natural language reasoning, information retrieval, and the philosophy of
              evidence.
            </p>
          </div>
        </section>

        {researchPosts.length > 0 && (
          <section className={styles.postsSection}>
            <h2 className={styles.sectionHeading}>Research seeds</h2>
            <p className={styles.postsIntro}>
              These are early-stage notes connected to research questions. Some will grow into
              proper essays or paper notes.
            </p>
            <ul className={styles.postList}>
              {researchPosts.map(post => (
                <li key={post.fields.slug} className={styles.postItem}>
                  <Link to={post.fields.slug} className={styles.postLink}>
                    <div className={styles.postMeta}>
                      <span className={styles.postType}>
                        {post.frontmatter.type || "note"}
                      </span>
                      <time className={styles.postDate}>{post.frontmatter.date}</time>
                    </div>
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

        <section className={styles.curioSection}>
          <h2 className={styles.sectionHeading}>Neural Map</h2>
          <p>
            See how research seeds, reading notes, and essays connect in the{" "}
            <Link to="/graph">Neural Map</Link>.
          </p>
        </section>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query ResearchQuery {
    allMarkdownRemark(
      filter: {
        fields: {
          slug: { regex: "/^/(blog|notes|essays|research-seeds|paper-notes|builds)/" }
        }
        frontmatter: { type: { in: ["research-seed", "essay"] } }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        fields { slug }
        frontmatter {
          title
          date(formatString: "DD MMM YYYY")
          type
          summary
          tags
        }
      }
    }
  }
`

export default ResearchPage
