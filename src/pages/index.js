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
        <h1 className={styles.heroTitle}>Welcome to Husain Alghasra's Personal Website</h1>
        <p className={styles.heroSubtitle}>Explore my blog posts, lessons, and more!</p>
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