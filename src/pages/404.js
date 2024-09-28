import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/Layout'
import * as styles from '../styles/404.module.css'

const NotFoundPage = () => {
  return (
    <Layout>
      <div className={styles.notFoundContainer}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Page Not Found</h2>
        <p className={styles.description}>
          Oops! The page you're looking for has vanished into the digital void.
        </p>
        <p className={styles.suggestion}>
          Perhaps you'd like to explore one of these instead?
        </p>
        <ul className={styles.linkList}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/learning-hub">Learning Hub</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
        <Link to="/" className={styles.homeButton}>
          Back to Home
        </Link>
      </div>
    </Layout>
  )
}

export default NotFoundPage