import React from 'react';
import { Link, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import Layout from '../../components/Layout';
import Search from '../../components/Search';
import * as styles from '../../styles/blog-list.module.css';

const BlogPage = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout>
      <div className={styles.blogHeader}>
        <h1>Blog</h1>
        <p>Explore my thoughts, ideas, and experiences</p>
      </div>
      <Search posts={posts} />
      <div className={styles.blogGrid}>
        {posts.map((post) => {
          const coverImage = getImage(post.frontmatter.coverImage);
          return (
            <article key={post.fields.slug} className={styles.blogPostCard}>
              {coverImage && (
                <GatsbyImage 
                  image={coverImage} 
                  alt={post.frontmatter.title} 
                  className={styles.coverImage}
                />
              )}
              <div className={styles.cardContent}>
                <h2>
                  <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
                </h2>
                <p className={styles.postDate}>{post.frontmatter.date}</p>
                <p className={styles.postExcerpt}>{post.excerpt}</p>
                <div className={styles.tags}>
                  {post.frontmatter.tags && post.frontmatter.tags.map(tag => (
                    <Link to={`/tags?tag=${tag}`} key={tag} className={styles.tag}>
                      {tag}
                    </Link>
                  ))}
                </div>
                <Link to={post.fields.slug} className={styles.readMoreLink}>Read more</Link>
              </div>
            </article>
          );
        })}
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
`;

export default BlogPage;