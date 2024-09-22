import React, { useContext } from 'react';
import { Link } from 'gatsby';
import { ThemeContext } from './ThemeContext';

const Layout = ({ children }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={`site-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/learning-hub">Learning Hub</Link>
        </nav>
        <button onClick={toggleTheme}>
          {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
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