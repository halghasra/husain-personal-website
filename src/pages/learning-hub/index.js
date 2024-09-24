import React from 'react';
import { Link, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import Layout from '../../components/Layout';
import Search from '../../components/Search';
import * as styles from '../../styles/learning-hub.module.css';

const LearningHubPage = ({ data }) => {
  const lessons = data.allMarkdownRemark.nodes;

  return (
    <Layout>
      <div className={styles.learningHubHeader}>
        <h1>Learning Hub</h1>
        <p>Explore lessons on technology, computer science, and more!</p>
      </div>
      <Search posts={lessons} />
      <div className={styles.lessonGrid}>
        {lessons.map((lesson) => {
          const coverImage = getImage(lesson.frontmatter.coverImage);
          return (
            <article key={lesson.fields.slug} className={styles.lessonCard}>
              {coverImage && (
                <GatsbyImage 
                  image={coverImage} 
                  alt={lesson.frontmatter.title} 
                  className={styles.coverImage}
                />
              )}
              <Link to={lesson.fields.slug}>
                <h2>{lesson.frontmatter.title}</h2>
                <p className={styles.lessonDate}>{lesson.frontmatter.date}</p>
                <p className={styles.lessonExcerpt}>{lesson.excerpt}</p>
              </Link>
              <div className={styles.tags}>
                {lesson.frontmatter.tags && lesson.frontmatter.tags.map(tag => (
                  <Link to={`/tags?tag=${tag}`} key={tag} className={styles.tag}>
                    {tag}
                  </Link>
                ))}
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
      sort: { frontmatter: { date: DESC } }
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

export default LearningHubPage;