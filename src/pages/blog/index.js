import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../../components/Layout';

const BlogPage = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout>
      <h1>Blog</h1>
      {posts.map((post) => (
        <article key={post.fields.slug}>
          <h2>
            <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
          </h2>
          <small>{post.frontmatter.date}</small>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </Layout>
  );
};

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fileAbsolutePath: { regex: "/content/blog/" } }
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

export default BlogPage;