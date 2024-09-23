import React from "react";
import { Link, graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Layout from "../components/Layout";
import Search from "../components/Search";
import * as styles from "../styles/blog-list.module.css";

const BlogList = ({ data, pageContext }) => {
  const posts = data.allMarkdownRemark.edges
  const { currentPage, numPages } = pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = currentPage - 1 === 1 ? "/blog" : `/blog/${currentPage - 1}`
  const nextPage = `/blog/${currentPage + 1}`

  return (
    <Layout>
      <h1>Blog</h1>
      <Search posts={posts.map(({ node }) => node)} />
      <div className={styles.blogList}>
        {posts.map(({ node }) => {
          const coverImage = getImage(node.frontmatter.coverImage);
          return (
            <article key={node.fields.slug} className={styles.blogPostPreview}>
              {coverImage && (
                <GatsbyImage 
                  image={coverImage} 
                  alt={node.frontmatter.title} 
                  className={styles.coverImage}
                />
              )}
              <h2>
                <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
              </h2>
              <small>{node.frontmatter.date}</small>
              <p>{node.excerpt}</p>
              <div className={styles.tags}>
                {node.frontmatter.tags && node.frontmatter.tags.map(tag => (
                  <Link to={`/tag/${tag}`} key={tag} className={styles.tag}>
                    {tag}
                  </Link>
                ))}
              </div>
              <Link to={node.fields.slug} className={styles.readMoreLink}>Read more</Link>
            </article>
          );
        })}
      </div>
      <nav className={styles.pagination}>
        {!isFirst && (
          <Link to={prevPage} rel="prev" className={styles.paginationLink}>
            ← Previous Page
          </Link>
        )}
        {!isLast && (
          <Link to={nextPage} rel="next" className={styles.paginationLink}>
            Next Page →
          </Link>
        )}
      </nav>
    </Layout>
  );
};

export default BlogList;

export const blogListQuery = graphql`
  query blogListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      limit: $limit
      skip: $skip
      filter: { fileAbsolutePath: { regex: "/content/blog/" } }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            tags
            coverImage {
              childImageSharp {
                gatsbyImageData(width: 600, height: 300, layout: CONSTRAINED)
              }
            }
          }
        }
      }
    }
  }
`;