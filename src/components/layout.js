import React from 'react';
import { Link } from 'gatsby';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children }) => {
  return (
    <div className="site-wrapper">
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/learning-hub">Learning Hub</Link>
        </nav>
        <ThemeToggle />
      </header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()} Husain Alghasra
      </footer>
    </div>
  );
};

export default Layout;