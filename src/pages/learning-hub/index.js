import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../../components/Layout';

const LearningHubPage = ({ data }) => {
  const lessons = data.allMarkdownRemark.nodes;

  return (
    <Layout>
      <h1>Learning Hub</h1>
      <div className="lesson-list">
        {lessons.map((lesson) => (
          <article key={lesson.fields.slug} className="lesson-preview">
            <h2>
              <Link to={lesson.fields.slug}>{lesson.frontmatter.title}</Link>
            </h2>
            <small>{lesson.frontmatter.date}</small>
            <p>{lesson.excerpt}</p>
            <Link to={lesson.fields.slug}>Start lesson</Link>
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