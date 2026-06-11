import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import * as styles from "../styles/home.module.css"

const IndexPage = ({ data }) => {
  const NOTEBOOK_PREFIXES = ["/blog/", "/notes/", "/essays/", "/research-seeds/", "/paper-notes/", "/builds/"]
  const latestPosts = data.allMarkdownRemark.nodes
    .filter(node => NOTEBOOK_PREFIXES.some(p => node.fields.slug.startsWith(p)))
    .slice(0, 4)

  return (
    <Layout>
      <SEO title="Husain Alghasra" description="A public notebook for curiosity, research, AI, systems, and knowledge work." />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>Public notebook</p>
          <h1 className={styles.heroHeading}>
            Hi, I&rsquo;m Husain.
          </h1>
          <p className={styles.heroSubtitle}>
            I collect questions, take systems apart, and write about the pieces I find.
          </p>
          <p className={styles.heroBody}>
            This is my public notebook. A place for thoughts, research seeds, reading notes,
            experiments, and the occasional idea that refuses to leave me alone.
          </p>
          <p className={styles.heroBodySecondary}>
            Some notes are polished. Some are still forming. I keep them here because thinking
            becomes clearer when it has somewhere to live.
          </p>
          <div className={styles.heroActions}>
            <Link to="/notebook" className={styles.heroCta}>Browse the notebook</Link>
            <Link to="/about" className={styles.heroCtaSecondary}>About me</Link>
          </div>
        </div>
      </section>

      {/* Currently thinking about */}
      <section className={styles.thinkingSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Currently thinking about</span>
        </div>
        <div className={styles.thinkingCard}>
          <p className={styles.thinkingText}>
            How do we build AI systems that can explain where their answers came from?
          </p>
          <p className={styles.thinkingDetail}>
            Not just with a citation pasted underneath, but with a real trail of reasoning,
            evidence, uncertainty, and context. This question sits somewhere between trustworthy AI,
            knowledge graphs, research methods, and human judgement.
          </p>
          <Link to="/research" className={styles.thinkingLink}>
            See research direction &rarr;
          </Link>
        </div>
      </section>

      {/* Latest notebook entries */}
      <section className={styles.notebookSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Latest from the notebook</span>
          <Link to="/notebook" className={styles.sectionViewAll}>View all &rarr;</Link>
        </div>
        {latestPosts.length > 0 ? (
          <ul className={styles.postList}>
            {latestPosts.map(post => (
              <li key={post.fields.slug} className={styles.postItem}>
                <Link to={post.fields.slug} className={styles.postLink}>
                  <div className={styles.postMeta}>
                    <span className={styles.postType}>note</span>
                    <time className={styles.postDate}>{post.frontmatter.date}</time>
                  </div>
                  <h3 className={styles.postTitle}>{post.frontmatter.title}</h3>
                  {post.excerpt && (
                    <p className={styles.postExcerpt}>{post.excerpt}</p>
                  )}
                  {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                    <div className={styles.postTags}>
                      {post.frontmatter.tags.slice(0, 3).map(tag => (
                        <span key={tag} className={styles.postTag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyNote}>No notes yet. Check back soon.</p>
        )}
      </section>

      {/* Two-column: Research + Curio Synapse */}
      <div className={styles.twoCol}>
        <section className={styles.researchSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Research direction</span>
          </div>
          <p className={styles.sectionBody}>
            My current focus is moving towards AI, machine learning, deep learning, trustworthy AI,
            traceability, and human-AI collaboration.
          </p>
          <p className={styles.sectionBody}>
            I am less interested in treating AI as magic, and more interested in understanding the
            structures that make intelligent systems reliable, explainable, and useful in the real world.
          </p>
          <div className={styles.focusAreas}>
            <span className={styles.focusTag}>Trustworthy AI</span>
            <span className={styles.focusTag}>Traceability</span>
            <span className={styles.focusTag}>Human-AI collaboration</span>
            <span className={styles.focusTag}>Knowledge graphs</span>
            <span className={styles.focusTag}>Deep learning</span>
          </div>
          <Link to="/research" className={styles.sectionLink}>
            Research &rarr;
          </Link>
        </section>

        <section className={styles.curioSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Curio Synapse</span>
          </div>
          <p className={styles.sectionBody}>
            Some thoughts stay here as notes. Some grow into Curio Synapse lessons.
          </p>
          <p className={styles.sectionBody}>
            Curio Synapse is my public learning garden for difficult ideas in science and
            technology. It is where I turn messy curiosity into clearer explanations,
            mental models, and learning paths.
          </p>
          <a
            href="https://curiosynapse.com"
            className={styles.sectionLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Curio Synapse &rarr;
          </a>
        </section>
      </div>

      {/* Neural Map preview */}
      <section className={styles.graphSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Neural Map</span>
        </div>
        <div className={styles.graphCard}>
          <div className={styles.graphPreview} aria-hidden="true">
            <svg
              viewBox="0 0 280 170"
              className={styles.graphPreviewSvg}
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Shared-tag edges (dashed) */}
              <line x1="68" y1="72" x2="110" y2="128" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.8" strokeDasharray="4,3" />
              <line x1="110" y1="128" x2="52" y2="140" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.8" strokeDasharray="4,3" />
              <line x1="215" y1="75" x2="205" y2="140" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.8" strokeDasharray="4,3" />
              <line x1="150" y1="42" x2="110" y2="128" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.8" strokeDasharray="4,3" />

              {/* Explicit edges (solid amber) */}
              <line x1="68" y1="72" x2="150" y2="42" stroke="rgba(245,158,11,0.55)" strokeWidth="1.5" />
              <line x1="150" y1="42" x2="215" y2="75" stroke="rgba(245,158,11,0.55)" strokeWidth="1.5" />
              <line x1="215" y1="75" x2="110" y2="128" stroke="rgba(245,158,11,0.35)" strokeWidth="1" />

              {/* note (amber) */}
              <circle cx="68" cy="72" r="8" fill="#f59e0b" fillOpacity="0.88" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.3" />
              <text x="68" y="88" textAnchor="middle" fontSize="7.5" fill="currentColor" fillOpacity="0.5" fontFamily="sans-serif">note</text>

              {/* essay (blue) — hub, slightly larger */}
              <circle cx="150" cy="42" r="11" fill="#3b82f6" fillOpacity="0.88" stroke="#3b82f6" strokeWidth="2" strokeOpacity="0.3" />
              <text x="150" y="60" textAnchor="middle" fontSize="7.5" fill="currentColor" fillOpacity="0.5" fontFamily="sans-serif">essay</text>

              {/* research-seed (green) */}
              <circle cx="215" cy="75" r="9" fill="#10b981" fillOpacity="0.88" stroke="#10b981" strokeWidth="2" strokeOpacity="0.3" />
              <text x="215" y="92" textAnchor="middle" fontSize="7.5" fill="currentColor" fillOpacity="0.5" fontFamily="sans-serif">research</text>

              {/* article (cyan) */}
              <circle cx="110" cy="128" r="7" fill="#06b6d4" fillOpacity="0.88" stroke="#06b6d4" strokeWidth="2" strokeOpacity="0.3" />
              <text x="110" y="142" textAnchor="middle" fontSize="7.5" fill="currentColor" fillOpacity="0.5" fontFamily="sans-serif">article</text>

              {/* build (orange) */}
              <circle cx="205" cy="140" r="8" fill="#f97316" fillOpacity="0.88" stroke="#f97316" strokeWidth="2" strokeOpacity="0.3" />
              <text x="205" y="155" textAnchor="middle" fontSize="7.5" fill="currentColor" fillOpacity="0.5" fontFamily="sans-serif">build</text>

              {/* note 2 (amber, smaller) */}
              <circle cx="52" cy="140" r="6" fill="#f59e0b" fillOpacity="0.75" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.25" />
            </svg>
          </div>
          <div className={styles.graphText}>
            <p>
              A living map of notes, readings, research seeds, and Curio Synapse lessons.
            </p>
            <p>
              It shows how ideas connect, where questions are forming, and which thoughts are
              slowly becoming something larger.
            </p>
            <Link to="/graph" className={styles.sectionLink}>
              Explore the map &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Builds preview */}
      <section className={styles.buildsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Builds and experiments</span>
          <Link to="/builds" className={styles.sectionViewAll}>View all &rarr;</Link>
        </div>
        <p className={styles.sectionBody}>
          Sometimes the best way to understand an idea is to build a small version of it.
          This section keeps track of prototypes, tools, experiments, and systems that
          started as questions.
        </p>
        <Link to="/builds" className={styles.sectionLink}>
          See what I&rsquo;m building &rarr;
        </Link>
      </section>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      limit: 10
    ) {
      nodes {
        excerpt(pruneLength: 120)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "DD MMM YYYY")
          title
          tags
        }
      }
    }
  }
`

export default IndexPage
