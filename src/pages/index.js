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
        <p className={styles.heroSubtitle}>The world belongs to the curious!</p>
      </div>

      <div className={styles.introduction}>
        <h2>Welcome to a World Driven by Curiosity</h2>
        <p>Hello, I'm Husain.</p>
        <p>Curiosity isn't just a word to me—it's a manifesto. It's the courage to question the norms, the known, and even the unknown. Here, in my corner of the internet, we don't just accept the world as it is; we poke, prod, and ponder over every "why" and "what if" that crosses our minds.</p>
        <p>From the depths of intricate ideas to the simple joy of a new discovery, this space is dedicated to those who believe that learning never ends. I share insights, dissect book reviews, and unravel the fabric of thoughts on seemingly random musings.</p>
        <p>But here's the thing: I detest the mundane. "What if…?" isn't just a phrase—it's the lens through which I view the world. If you're intrigued by the endless possibilities that questions can unravel, then you're in the right place.</p>
        <p><strong>Welcome to the Curious Movement, where every question is the key to a new door. Let's embark on this journey of discovery together, because the future? It belongs to us—the eternally curious.</strong></p>
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