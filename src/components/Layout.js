import React, { useContext, useEffect } from 'react';
import { Link } from 'gatsby';
import { ThemeContext } from './ThemeContext';
import ThemeToggle from './ThemeToggle';
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
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/about" className={styles.navLink}>About</Link>
            <Link to="/blog" className={styles.navLink}>Blog</Link>
            <Link to="/learning-hub" className={styles.navLink}>Learning Hub</Link>
          </nav>
          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        © {new Date().getFullYear()} Husain Alghasra
      </footer>
    </div>
  );
};

export default Layout;