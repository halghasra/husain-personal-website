import React from 'react';
import { Link, graphql, navigate } from 'gatsby';
import Layout from '../../components/Layout';
import Search from '../../components/Search';
import * as styles from '../../styles/blog-list.module.css';

const BlogPage = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout>
      <h1>Blog</h1>
      <Search posts={posts} />
      <div className={styles.blogList}>
        {posts.map((post) => (
          <article key={post.fields.slug} className={styles.blogPostPreview}>
            <h2>
              <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
            </h2>
            <small>{post.frontmatter.date}</small>
            <p>{post.excerpt}</p>
            <button className={styles.readMoreButton} onClick={() => navigate(post.fields.slug)}>Read more</button>
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