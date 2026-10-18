import React, { useContext, useState } from "react"
import { Link } from "gatsby"
import { ThemeContext } from "./ThemeContext"
import ThemeToggle from "./ThemeToggle"
import Footer from "./Footer"
import * as styles from "../styles/layout.module.css"

const NAV = [
  { to: "/", label: "home" },
  { to: "/notebook", label: "notebook", partial: true },
  { to: "/graph", label: "neural map" },
  { to: "/research", label: "research" },
  { to: "/reading", label: "reading" },
  { to: "/builds", label: "builds" },
  { to: "/about", label: "about" },
]

const Layout = ({ children, fullWidth }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className={`${styles.siteWrapper} ${fullWidth ? styles.siteWrapperFull : ""}`}>
      <header className={styles.mast}>
        <Link to="/" className={styles.sig} aria-label="Husain Alghasra, home">
          Husain <i>Alghasra</i>
        </Link>

        <button
          type="button"
          className={styles.menuToggle}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
        >
          {menuOpen ? "close" : "index"}
        </button>

        <div className={`${styles.mastRight} ${menuOpen ? styles.navOpen : ""}`}>
          <nav id="site-nav" className={styles.nav} aria-label="Site" onClick={() => setMenuOpen(false)}>
            {NAV.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={styles.navLink}
                activeClassName={styles.activeLink}
                partiallyActive={item.partial || false}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://curiosynapse.com"
              className={`${styles.navLink} ${styles.navLinkExternal}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              curio synapse ↗
            </a>
          </nav>
          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>
      </header>

      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
