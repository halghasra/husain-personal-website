import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../../components/Layout';

const LearningHubPage = ({ data }) => {
  const lessons = data.allMarkdownRemark.nodes;

  return (
    <Layout>
      <h1>Learning Hub</h1>
      {lessons.map((lesson) => (
        <article key={lesson.fields.slug}>
          <h2>
            <Link to={lesson.fields.slug}>{lesson.frontmatter.title}</Link>
          </h2>
          <small>{lesson.frontmatter.date}</small>
          <p>{lesson.excerpt}</p>
        </article>
      ))}
    </Layout>
  );
};

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
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