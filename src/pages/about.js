import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { siteConfig } from "../config/siteConfig"
import { Sheet, Row, PageHead } from "../components/Sheet"
import * as styles from "../styles/about.module.css"

const AboutPage = () => {
  return (
    <Layout>
      <SEO title="About" description="About Husain Alghasra, his route into technology and research, and the questions he is following now." />
      <Sheet>
        <PageHead
          title="I have always been bothered by not knowing how things work."
          margin={<><b>About</b><br />Husain Alghasra<br />London</>}
        >
          <p>Not knowing has never embarrassed me as much as leaving the question alone.</p>
        </PageHead>

        <Row className={styles.part} margin={<b>Preface</b>}>
          <p>
            The pattern has followed me for years. Something feels confusing, broken, hidden or
            strangely powerful, and I start pulling at the thread. It may become a note, a small
            program, a book I have filled with questions, or a project that lasts much longer than
            I expected. This site is where I keep the trail.
          </p>

        </Row>
        <Row className={styles.part} margin={<><b>Early curiosity</b><br />self-taught<br /><span className={styles.gall}>June 2002, the World Cup</span></>}>
          <h2>Early curiosity</h2>
          <p>
            My relationship with technology began through self-learning. The web gave curiosity
            a physical result: a page, a tool, a small experiment, a system that could do something
            it could not do the day before.
          </p>
          <p>
            I learned by trying, breaking, searching and rebuilding. That habit never really left me.
          </p>
          <p>
            One early memory that stuck: it was 2002, I fell asleep and missed Argentina&rsquo;s
            opening match in the World Cup. I woke up too late, grabbed a newspaper, and realised
            I had no way of knowing the score when it actually happened. So I built a rough little
            page in HTML and updated it while I watched the matches. It was not much of a website,
            but it changed the scale of what I thought I could teach myself.
          </p>

        </Row>
        <Row className={styles.part} margin={<><b>Laboratory</b><br />insurance technology</>}>
          <h2>The real-world laboratory</h2>
          <p>
            My professional work has mostly lived inside insurance technology. From the outside it
            can look like a dry collection of policies and forms. Inside, it is a dense meeting of
            risk, data, judgement, regulation, documents, workflows and human uncertainty. It became
            my practical education in systems thinking.
          </p>
          <p>
            It taught me to be suspicious of solutions that look modern before they understand the
            problem. A system has to survive contact with the people who use it, the rules that
            constrain it, and the untidy cases its diagram forgot.
          </p>

        </Row>
        <Row className={styles.part} margin={<><b>Academia</b><br />AI, ML, deep learning</>}>
          <h2>Why academia matters to me</h2>
          <p>
            I am now studying artificial intelligence more formally, moving from years of building
            systems towards the mathematics, computer science and research beneath them.
          </p>
          <p>
            Academia matters to me because it makes vague confidence expensive. It asks where a
            claim came from, what would disprove it, and whether the method deserves the conclusion.
            I want those disciplines in my work. I also want to connect them to the practical systems
            I already know, where neat assumptions tend to meet untidy reality.
          </p>
          <p>
            The questions that interest me most sit around trustworthy AI, traceability,
            explainability, human-AI collaboration, and knowledge systems.
          </p>

        </Row>
        <Row className={styles.part} margin={<><b>Elsewhere</b><br />curiosynapse.com</>}>
          <h2>Curio Synapse</h2>
          <p>
            Curio Synapse is where some of these investigations become structured lessons. Here,
            an idea is allowed to remain a working note, with uncertainty and loose ends still
            visible. There, I stay with it for longer and try to make a difficult subject clear
            without pretending that it was simple all along.
          </p>

        </Row>
        <Row className={styles.part} margin={<><b>The thread</b></>}>
          <h2>The thread underneath it all</h2>
          <p>
            I care about curiosity, but not as a personality trait or a decorative word. I mean the
            active kind: the urge to open the system, follow the mechanism, check the source, and
            notice when two distant ideas are describing the same shape.
          </p>
          <p>
            I do not expect every question here to resolve neatly. Some will become essays or
            research; some will expose how much more I need to learn. Both outcomes belong in the
            notebook. Curiosity loses something important when it is allowed to publish only its
            successes.
          </p>
        </Row>
        <Row className={styles.formal} margin={<b>In brief</b>}>
          <div>
            <p className={styles.formalText}>
              I am a technology practitioner and AI student based in London. My professional
              background is in product and insurance systems; my academic interests are moving
              towards machine learning, trustworthy AI, traceability and the design of knowledge
              systems. I write to understand those subjects, and to leave a useful trail for the
              next person who is trying to understand them too.
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
        </Row>
      </Sheet>
    </Layout>
  )
}

export default AboutPage
