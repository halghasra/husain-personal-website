import React from 'react';
import * as styles from '../styles/theme-toggle.module.css';

// A small "lamp" switch: dark cyanotype or paper.
const ThemeToggle = ({ isDarkMode, toggleTheme }) => (
  <button
    type="button"
    className={styles.lamp}
    onClick={toggleTheme}
    aria-label={isDarkMode ? 'Switch to the paper theme' : 'Switch to the dark theme'}
    title={isDarkMode ? 'Switch to paper' : 'Switch to dark'}
  >
    <span className={styles.dot} aria-hidden="true" />
    <span>{isDarkMode ? 'dark' : 'paper'}</span>
  </button>
);

export default ThemeToggle;
