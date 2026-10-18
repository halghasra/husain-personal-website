import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { Sheet, PageHead, Section } from '../components/Sheet'
import * as styles from '../styles/404.module.css'

const NotFoundPage = () => {
  return (
    <Layout>
      <SEO title="Page not found" />
      <Sheet>
        <PageHead
          title="No entry at this address."
          margin={<><b>Error 404</b><br /><span className={styles.gall}>page not found</span></>}
        >
          <p>The page may have moved when the notebook was reorganised, or the link has a typo.</p>
        </PageHead>
        <Section margin={<b>Try instead</b>}>
          <ul className={styles.linkList}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/notebook">The notebook</Link></li>
            <li><Link to="/graph">The Neural Map</Link></li>
            <li><Link to="/tags">Tags</Link></li>
            <li><Link to="/about">About me</Link></li>
          </ul>
        </Section>
      </Sheet>
    </Layout>
  )
}

export default NotFoundPage
