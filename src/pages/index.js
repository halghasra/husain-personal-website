import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/Layout';

const IndexPage = ({ data }) => {
  const latestPosts = data.allMarkdownRemark.nodes.filter(node => node.fields.slug.startsWith('/blog/'));
  const latestLessons = data.allMarkdownRemark.nodes.filter(node => node.fields.slug.startsWith('/learning-hub/'));

  return (
    <Layout>
      <h1>Welcome to Husain Alghasra's Personal Website</h1>
      <p>Explore my blog posts, lessons, and more!</p>

      <section>
        <h2>Latest Blog Posts</h2>
        <ul>
          {latestPosts.slice(0, 3).map(post => (
            <li key={post.fields.slug}>
              <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
              <p>{post.frontmatter.date}</p>
            </li>
          ))}
        </ul>
        <Link to="/blog">See all posts</Link>
      </section>

      <section>
        <h2>Latest Lessons</h2>
        <ul>
          {latestLessons.slice(0, 3).map(lesson => (
            <li key={lesson.fields.slug}>
              <Link to={lesson.fields.slug}>{lesson.frontmatter.title}</Link>
              <p>{lesson.frontmatter.date}</p>
            </li>
          ))}
        </ul>
        <Link to="/learning-hub">See all lessons</Link>
      </section>
    </Layout>
  );
};

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
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