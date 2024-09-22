import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../../components/Layout';
import * as styles from '../../styles/learning-hub.module.css';

const LearningHubPage = ({ data }) => {
  const lessons = data.allMarkdownRemark.nodes;

  return (
    <Layout>
      <div className={styles.learningHubHeader}>
        <h1>Learning Hub</h1>
        <p>Explore lessons on technology, computer science, and more!</p>
      </div>
      <div className={styles.lessonGrid}>
        {lessons.map((lesson) => (
          <article key={lesson.fields.slug} className={styles.lessonCard}>
            <Link to={lesson.fields.slug}>
              <h2>{lesson.frontmatter.title}</h2>
              <p className={styles.lessonDate}>{lesson.frontmatter.date}</p>
              <p className={styles.lessonExcerpt}>{lesson.excerpt}</p>
            </Link>
          </article>
        ))}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: { frontmatter: {date: DESC} }
      filter: { fileAbsolutePath: { regex: "/content/learning-hub/" } }
    ) {
      nodes {
        excerpt
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

export default LearningHubPage;