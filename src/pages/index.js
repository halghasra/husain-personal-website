import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/Layout';
import Logo from '../components/Logo';
import * as styles from '../styles/home.module.css';

const IndexPage = ({ data }) => {
  const latestPosts = data.allMarkdownRemark.nodes.filter(node => node.fields.slug.startsWith('/blog/'));
  const latestLessons = data.allMarkdownRemark.nodes.filter(node => node.fields.slug.startsWith('/learning-hub/'));

  return (
    <Layout>
      <div className={styles.hero}>
        <Logo />
        <h1 className={styles.heroTitle}>Husain Alghasra</h1>
        <p className={styles.heroSubtitle}>THE FUTURE BELONGS TO THE CURIOUS!</p>
      </div>

      <div className={styles.introduction}>
        <h2>Welcome to a World Driven by Curiosity</h2>
        <p>Hello, I'm Husain.</p>
        <p>Curiosity isn't just a word to me—it's my way of life. It's the spark that drives me to question everything, from the everyday to the extraordinary. Here, in my little corner of the internet, we don't settle for the status quo. Instead, we explore every "why" and "what if" that comes our way.</p>
        <p>Whether diving into complex ideas or celebrating the joy of a new discovery, this space is for anyone who believes that learning never stops. I share my thoughts, review books, and explore random musings that fuel our endless quest for knowledge.</p>
        <p>I can't stand the mundane. For me, "What if…?" is more than a question—it's the lens through which I see the world. If you're fascinated by the endless possibilities that curiosity can unlock, you've come to the right place.</p>
        <p><strong>Join the Curious Movement</strong>, where every question opens a new door. Let's embark on this journey of discovery together because the future? It belongs to us—the eternally curious.</p>
      </div>

      <div className={styles.featuredContent}>
        <section className={styles.featuredSection}>
          <h2>Latest Blog Posts</h2>
          <ul className={styles.postList}>
            {latestPosts.slice(0, 3).map(post => (
              <li key={post.fields.slug} className={styles.postItem}>
                <Link to={post.fields.slug}>
                  <h3>{post.frontmatter.title}</h3>
                  <p>{post.frontmatter.date}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/blog" className={styles.viewAllLink}>See all posts</Link>
        </section>

        <section className={styles.featuredSection}>
          <h2>Latest Lessons</h2>
          <ul className={styles.postList}>
            {latestLessons.slice(0, 3).map(lesson => (
              <li key={lesson.fields.slug} className={styles.postItem}>
                <Link to={lesson.fields.slug}>
                  <h3>{lesson.frontmatter.title}</h3>
                  <p>{lesson.frontmatter.date}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/learning-hub" className={styles.viewAllLink}>See all lessons</Link>
        </section>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      limit: 6
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
        }
      }
    }
  }
`;

export default IndexPage;