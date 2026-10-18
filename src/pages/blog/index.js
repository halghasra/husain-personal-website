import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import Search from '../../components/Search';
import EntryList from '../../components/EntryList';
import { Sheet, Row, PageHead } from '../../components/Sheet';
import * as styles from '../../styles/blog-list.module.css';

// Legacy /blog index: every older post on one page. The notebook is the main index now.
const BlogPage = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout>
      <SEO title="Blog" description="Older writing: book notes, reviews and articles." />
      <Sheet>
        <PageHead
          title="The old blog."
          margin={<><b>Archive</b><br />{posts.length} posts</>}
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
      </Sheet>
    </Layout>
  );
};

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: {frontmatter: {date: DESC}}
      filter: {
        fileAbsolutePath: { regex: "/content/blog/" }
        frontmatter: { status: { ne: "draft" } }
      }
    ) {
      nodes {
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
`;

export default BlogPage;
