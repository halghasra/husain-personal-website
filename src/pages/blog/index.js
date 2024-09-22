import React from 'react';
import { Link, graphql, navigate } from 'gatsby';
import Layout from '../../components/Layout';

const BlogPage = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout>
      <h1>Blog</h1>
      <div className="blog-list">
      {posts.map((post) => (
        <article key={post.fields.slug} className="blog-post-preview">
          <h2>
            <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
          </h2>
          <small>{post.frontmatter.date}</small>
          <p>{post.excerpt}</p>
          <button onClick={() => navigate(post.fields.slug)}>Read more</button>
        </article>
      ))}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: {frontmatter: {date: DESC}}
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