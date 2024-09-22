import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/Layout';
import * as styles from '../styles/category.module.css';

const CategoryTemplate = ({ pageContext, data }) => {
  const { category } = pageContext;
  const { edges, totalCount } = data.allMarkdownRemark;

  return (
    <Layout>
      <div className={styles.categoryHeader}>
        <h1>{category}</h1>
        <p>{totalCount} post{totalCount === 1 ? '' : 's'} in this category</p>
      </div>
      <div className={styles.postList}>
        {edges.map(({ node }) => (
          <article key={node.fields.slug} className={styles.postItem}>
            <h2>
              <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
            </h2>
            <small>{node.frontmatter.date}</small>
            <p>{node.excerpt}</p>
            <Link to={node.fields.slug}>Read more</Link>
          </article>
        ))}
      </div>
    </Layout>
  );
};

export default CategoryTemplate;

export const pageQuery = graphql`
  query($category: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { frontmatter: { date: DESC }}
      filter: { frontmatter: { categories: { in: [$category] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
          }
          excerpt
        }
      }
    }
  }
`;