import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { siteConfig } from "../config/siteConfig"
import * as styles from "../styles/about.module.css"

const AboutPage = () => {
  return (
    <Layout>
      <SEO title="About" description="Who Husain Alghasra is, where he came from, and what he cares about." />
      <div className={styles.aboutWrapper}>
        <header className={styles.aboutHeader}>
          <p className={styles.headerLabel}>About</p>
          <h1 className={styles.headerHeading}>
            I have always been bothered by not knowing how things work.
          </h1>
          <p className={styles.headerSubtitle}>
            Not in a dramatic way. More like an itch.
          </p>
        </header>

        <div className={styles.aboutContent}>
          <p>
            The pattern has followed me for years. I find something that feels confusing,
            broken, hidden, or strangely powerful, and I start pulling at the thread. Sometimes
            it becomes a note. Sometimes it becomes a project. Sometimes it becomes an obsession
            that lasts longer than I expected.
          </p>

          <h2>Early curiosity</h2>
          <p>
            My relationship with technology started through self-learning. I was drawn to the
            web because it felt like a place where curiosity could turn into something visible.
            A page, a tool, a small experiment, a system that did something it could not do yesterday.
          </p>
          <p>
            I learned by trying, breaking, searching, rebuilding, and asking better questions.
            That way of learning never really left me.
          </p>
          <p>
            One early memory that stuck: it was 2002, I fell asleep and missed Argentina&rsquo;s
            opening match in the World Cup. I woke up too late, grabbed a newspaper, and realised
            I had no way of knowing the score <em>when it actually happened</em>. So I built
            something. A rough little page in HTML that I updated as I watched matches. It was not
            impressive. But it showed me something I have never forgotten: I could teach myself
            anything if I needed to.
          </p>

          <h2>The real-world laboratory</h2>
          <p>
            My professional work has mostly lived inside insurance technology. It sounds dry from
            the outside, but underneath the surface it is full of complex systems: risk, data,
            judgement, regulation, workflows, documents, decisions, and human uncertainty.
          </p>
          <p>
            That world became a laboratory for systems thinking.
          </p>
          <p>
            It taught me that good technology is not just about making something look modern.
            It is about understanding the shape of a problem deeply enough to build something
            that people can actually use, trust, and maintain.
          </p>

          <h2>Why academia matters to me</h2>
          <p>
            I am now moving deeper into artificial intelligence, machine learning, deep learning,
            and research.
          </p>
          <p>
            For me, academia is not a badge. It is a way to build better foundations. I want to
            understand the theory properly, connect it to practice, and contribute something useful
            rather than only consuming what others have built.
          </p>
          <p>
            The questions that interest me most sit around trustworthy AI, traceability,
            explainability, human-AI collaboration, and knowledge systems.
          </p>

          <h2>Curio Synapse</h2>
          <p>
            Curio Synapse is where some of my thinking becomes more public and more structured.
          </p>
          <p>
            This site is the notebook. Curio Synapse is the garden.
          </p>
          <p>
            Here, ideas can stay messy for a while. There, I try to turn difficult ideas into
            explanations that are clear, memorable, and worth sharing.
          </p>

          <h2>The thread underneath it all</h2>
          <p>
            I care about curiosity because it is the beginning of almost everything useful.
          </p>
          <p>
            Not passive curiosity. Active curiosity. The kind that opens the system, follows
            the mechanism, checks the source, and asks what else might be possible.
          </p>

          <blockquote>
            <p>
              &ldquo;The reasonable man adapts himself to the world: the unreasonable one persists
              in trying to adapt the world to himself. Therefore all progress depends on the
              unreasonable man.&rdquo;
            </p>
            <footer>George Bernard Shaw</footer>
          </blockquote>

          <div className={styles.formalCard}>
            <p className={styles.formalLabel}>Formal summary</p>
            <p className={styles.formalText}>
              I work across product, technology, insurance systems, AI-assisted workflows, and
              knowledge platforms. My professional experience gives me a practical laboratory for
              understanding complex systems, while my academic direction is increasingly focused
              on AI, machine learning, deep learning, trustworthy AI, and traceability.
            </p>
            <div className={styles.socialRow}>
              <a
                href={siteConfig.socials.github}
                className={styles.socialItem}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href={siteConfig.socials.x}
                className={styles.socialItem}
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>
              <a
                href={siteConfig.socials.linkedin}
                className={styles.socialItem}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                href={siteConfig.socials.curioSynapse}
                className={styles.socialItem}
                target="_blank"
                rel="noopener noreferrer"
              >
                Curio Synapse
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AboutPage
