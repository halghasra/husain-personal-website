import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import EntryList from "../components/EntryList"
import { Sheet, Row, PageHead, Section, Problem } from "../components/Sheet"
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
      <Sheet>
        <PageHead
          title="Questions I might spend years trying to answer."
          margin={<><b>Research</b><br />{FOCUS_AREAS.length} areas<br />1 open question</>}
        >
          <p>This is not a finished research profile yet. It is where I keep the questions.</p>
        </PageHead>

        <Section margin={<b>Abstract</b>} className={styles.abstract}>
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
          <p className={styles.keywords}>
            <b>Keywords:</b> {FOCUS_AREAS.map(a => a.title.toLowerCase()).join("; ")}.
          </p>
        </Section>

        <Section margin={<b>Focus areas</b>} title="Research focus areas">
          <dl className={styles.areas}>
            {FOCUS_AREAS.map(area => (
              <div key={area.title} className={styles.area}>
                <dt>{area.title}</dt>
                <dd>{area.body}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section margin={<><b>Open question</b><br />active</>} title="Active question">
          <Problem
            label="Question 1"
            tag="traceability"
            statement="How do we build AI systems that can explain where their answers came from?"
          >
            Not just with a citation pasted underneath, but with a real trail of reasoning,
            evidence, uncertainty, and context. The answer sits somewhere between knowledge
            graphs, natural language reasoning, information retrieval, and the philosophy of
            evidence.
          </Problem>
        </Section>

        {researchPosts.length > 0 && (
          <div className={styles.group}>
            <Row margin={<><b>Seeds</b><br />&amp; essays</>}>
              <h2 className={styles.groupTitle}>Research seeds</h2>
              <p className={styles.intro}>
                These are early-stage notes connected to research questions. Some will grow into
                proper essays or paper notes.
              </p>
            </Row>
            <EntryList posts={researchPosts} />
          </div>
        )}

        <Section margin={<b>See also</b>}>
          <p>
            See how research seeds, reading notes, and essays connect in the{" "}
            <Link to="/graph">Neural Map</Link>.
          </p>
        </Section>
      </Sheet>
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
        frontmatter: { type: { in: ["research-seed", "essay"] }, status: { ne: "draft" } }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        fields { slug }
        frontmatter {
          title
          date(formatString: "D MMM YYYY")
          type
          summary
          tags
        }
      }
    }
  }
`

export default ResearchPage
