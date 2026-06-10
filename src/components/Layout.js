import React, { useContext, useEffect, useState } from "react"
import { Link } from "gatsby"
import { ThemeContext } from "./ThemeContext"
import ThemeToggle from "./ThemeToggle"
import Footer from "./Footer"
import * as styles from "../styles/layout.module.css"

const Layout = ({ children, fullWidth }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  const wrapperClass = `${styles.siteWrapper} ${
    fullWidth ? styles.siteWrapperFull : styles.siteWrapperDefault
  }`

  return (
    <div className={wrapperClass}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logoLink}>
            <span className={styles.logo}>HG</span>
          </Link>

          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <span className={menuOpen ? styles.menuIconOpen : styles.menuIcon} />
          </button>

          <div className={`${styles.navAndToggle} ${menuOpen ? styles.navOpen : ""}`}>
            <nav className={styles.nav} onClick={() => setMenuOpen(false)}>
              <Link to="/" className={styles.navLink} activeClassName={styles.activeLink}>
                Home
              </Link>
              <Link to="/notebook" className={styles.navLink} activeClassName={styles.activeLink} partiallyActive>
                Notebook
              </Link>
              <Link to="/research" className={styles.navLink} activeClassName={styles.activeLink}>
                Research
              </Link>
              <Link to="/reading" className={styles.navLink} activeClassName={styles.activeLink}>
                Reading
              </Link>
              <Link to="/builds" className={styles.navLink} activeClassName={styles.activeLink}>
                Builds
              </Link>
              <Link to="/about" className={styles.navLink} activeClassName={styles.activeLink}>
                About
              </Link>
              <a
                href="https://curiosynapse.com"
                className={`${styles.navLink} ${styles.navLinkExternal}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Curio Synapse
              </a>
            </nav>
            <div className={styles.themeToggleWrapper}>
              <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
