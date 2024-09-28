import React from 'react';
import { Link } from 'gatsby';
import * as styles from '../styles/footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <Link to="/" className={`${styles.footerLogo} ${styles.logoLink}`}>HG</Link>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Husain Alghasra. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;