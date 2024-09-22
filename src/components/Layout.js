import React, { useContext, useEffect } from 'react';
import { Link } from 'gatsby';
import { ThemeContext } from './ThemeContext';

const Layout = ({ children }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="site-wrapper">
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/learning-hub">Learning Hub</Link>
        </nav>
        <button onClick={toggleTheme} aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
          {isDarkMode ? '🌞' : '🌙'}
        </button>
      </header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()} Husain Alghasra
      </footer>
    </div>
  );
};

export default Layout;