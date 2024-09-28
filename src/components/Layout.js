import React, { useContext, useEffect } from 'react';
import { Link } from 'gatsby';
import { ThemeContext } from './ThemeContext';
import ThemeToggle from './ThemeToggle';
import Footer from './Footer';
import * as styles from '../styles/layout.module.css';

const Layout = ({ children }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className={styles.siteWrapper}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={`${styles.logo} ${styles.logoLink}`}>HG</Link>
          <div className={styles.navAndToggle}>
            <nav className={styles.nav}>
              <Link to="/" className={styles.navLink} activeClassName={styles.activeLink}>Home</Link>
              <Link to="/about" className={styles.navLink} activeClassName={styles.activeLink}>About</Link>
              <Link to="/blog" className={styles.navLink} activeClassName={styles.activeLink}>Blog</Link>
              <Link to="/learning-hub" className={styles.navLink} activeClassName={styles.activeLink}>Learning Hub</Link>
            </nav>
            <div className={styles.themeToggleWrapper}>
              <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            </div>
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;