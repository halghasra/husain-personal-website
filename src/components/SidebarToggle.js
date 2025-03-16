import React from 'react';
import * as styles from '../styles/sidebar.module.css';

const SidebarToggle = ({ isOpen, onClick }) => (
  <button 
    className={styles.sidebarToggle}
    onClick={onClick}
    aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
  >
    {isOpen ? "×" : "☰"}
  </button>
);

export default SidebarToggle; 