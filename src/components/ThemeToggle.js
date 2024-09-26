import React from 'react';
import * as styles from '../styles/theme-toggle.module.css';

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
    return (
        <label className={styles.toggleSwitch}>
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={toggleTheme}
          />
          <span className={styles.slider}>
            <span className={`${styles.icon} ${styles.sunIcon}`}>☀️</span>
            <span className={`${styles.icon} ${styles.moonIcon}`}>🌙</span>
          </span>
        </label>
      );
    };

export default ThemeToggle;