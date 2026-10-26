import React from "react"
import { siteConfig } from "../config/siteConfig"
import { useCatalogue } from "../hooks/useCatalogue"
import * as styles from "../styles/footer.module.css"

// The colophon: who keeps the notebook and where else to find me.
const Footer = () => {
  const { total } = useCatalogue()

  return (
    <footer className={styles.colophon}>
      <div className={styles.margin}>
        <b>Colophon</b>
      </div>
      <div className={styles.body}>
        <p>
          Kept by Husain Alghasra in London. A record of questions, working notes,
          and the connections I do not want to lose.
        </p>
        <div className={styles.links}>
          <a href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer">github</a>
          <a href={siteConfig.socials.x} target="_blank" rel="noopener noreferrer">x</a>
          <a href={siteConfig.socials.linkedin} target="_blank" rel="noopener noreferrer">linkedin</a>
          <a href={siteConfig.socials.curioSynapse} target="_blank" rel="noopener noreferrer">curio synapse</a>
        </div>
        <p className={styles.small}>
          © {new Date().getFullYear()} · entries N° 1–{total}
        </p>
      </div>
    </footer>
  )
}

export default Footer
