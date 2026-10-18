import React from "react";
import { Link, graphql } from "gatsby";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import Search from "../components/Search";
import EntryList from "../components/EntryList";
import { Sheet, Row, PageHead } from "../components/Sheet";
import * as styles from "../styles/blog-list.module.css";

// Legacy /blog route, kept for old links. The notebook is the main index now.
const BlogList = ({ data, pageContext }) => {
  const posts = data.allMarkdownRemark.edges.map(({ node }) => node)
  const { currentPage, numPages } = pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = currentPage - 1 === 1 ? "/blog" : `/blog/${currentPage - 1}`
  const nextPage = `/blog/${currentPage + 1}`

  return (
    <Layout>
      <SEO title="Blog" description="Older writing: book notes, reviews and articles." />
      <Sheet>
        <PageHead
          title="The old blog."
          margin={<><b>Archive</b><br />page {currentPage} of {numPages}</>}
        >
          <p>Book notes, reviews and articles from before the notebook.</p>
          <p>
            Everything here also lives in the <Link to="/notebook">notebook</Link>.
          </p>
        </PageHead>
        <Row margin={<b>Search</b>} className={styles.searchRow}>
          <Search posts={posts} />
        </Row>
        <div className={styles.list}>
          <EntryList posts={posts} />
        </div>
        <Row margin={null}>
          <nav className={styles.pagination} aria-label="Pages">
            <span>
              {!isFirst && (
                <Link to={prevPage} rel="prev">← newer</Link>
              )}
            </span>
            <span>
              {!isLast && (
                <Link to={nextPage} rel="next">older →</Link>
              )}
            </span>
          </nav>
        </Row>
      </Sheet>
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
      filter: {
        fileAbsolutePath: { regex: "/content/blog/" }
        frontmatter: { status: { ne: "draft" } }
      }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "D MMM YYYY")
            title
            type
            summary
            tags
          }
        }
      }
    }
  }
`;
