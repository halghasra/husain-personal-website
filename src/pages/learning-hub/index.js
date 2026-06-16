import React from 'react';
import { Link, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import * as styles from '../../styles/learning-hub.module.css';

const LearningHubPage = ({ data }) => {
  const lessons = data.allMarkdownRemark.nodes;
  const featured = lessons[0];
  const rest = lessons.slice(1);

  const featuredImage = featured ? getImage(featured.frontmatter.coverImage) : null;

  return (
    <Layout>
      <SEO
        title="Learning Hub"
        description="Course notes, lessons, and study guides. Built to last."
      />
      <div className={styles.hubPage}>

        <header className={styles.hubHeader}>
          <span className={styles.hubEyebrow}>Learning Hub</span>
          <h1 className={styles.hubTitle}>Learn by building understanding.</h1>
          <p className={styles.hubLede}>
            Deep-dive lessons, course notes, and study guides across AI, distributed systems, and computer science fundamentals.
          </p>
        </header>

        {/* Featured — latest lesson */}
        {featured && (
          <section className={styles.featuredSection}>
            <p className={styles.sectionLabel}>Latest</p>
            <Link to={featured.fields.slug} className={styles.featuredCard}>
              {featuredImage ? (
                <GatsbyImage
                  image={featuredImage}
                  alt={featured.frontmatter.title}
                  className={styles.featuredImage}
                />
              ) : featured.frontmatter.coverImage?.publicURL ? (
                <img
                  src={featured.frontmatter.coverImage.publicURL}
                  alt={featured.frontmatter.title}
                  className={styles.featuredImage}
                />
              ) : (
                <div className={styles.featuredImagePlaceholder} />
              )}
              <div className={styles.featuredBody}>
                <div className={styles.featuredMeta}>
                  {featured.frontmatter.category && (
                    <span className={styles.categoryTag}>{featured.frontmatter.category}</span>
                  )}
                  {featured.frontmatter.date && (
                    <span className={styles.metaDate}>{featured.frontmatter.date}</span>
                  )}
                </div>
                <h2 className={styles.featuredTitle}>{featured.frontmatter.title}</h2>
                <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                <span className={styles.featuredCta}>Read lesson →</span>
              </div>
            </Link>
          </section>
        )}

        {/* All other lessons */}
        {rest.length > 0 && (
          <section className={styles.allSection}>
            <p className={styles.sectionLabel}>All lessons</p>
            <div className={styles.lessonGrid}>
              {rest.map(lesson => {
                const cardImage = getImage(lesson.frontmatter.coverImage);
                return (
                  <Link key={lesson.fields.slug} to={lesson.fields.slug} className={styles.lessonCard}>
                    <div className={styles.cardImageWrap}>
                      {cardImage ? (
                        <GatsbyImage
                          image={cardImage}
                          alt={lesson.frontmatter.title}
                          className={styles.cardImage}
                        />
                      ) : lesson.frontmatter.coverImage?.publicURL ? (
                        <img
                          src={lesson.frontmatter.coverImage.publicURL}
                          alt={lesson.frontmatter.title}
                          className={styles.cardImage}
                        />
                      ) : (
                        <div className={styles.cardImagePlaceholder}>
                          <span>{lesson.frontmatter.category?.[0] ?? '·'}</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.cardBody}>
                      {lesson.frontmatter.category && (
                        <span className={styles.categoryTag}>{lesson.frontmatter.category}</span>
                      )}
                      <h3 className={styles.cardTitle}>{lesson.frontmatter.title}</h3>
                      <p className={styles.cardExcerpt}>{lesson.excerpt}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: {
        fileAbsolutePath: { regex: "/content/learning-hub/" }
      }
    ) {
      nodes {
        excerpt(pruneLength: 180)
        fields {
          slug
        }
        frontmatter {
          title
          category
          topic
          date(formatString: "MMMM D, YYYY")
          coverImage {
            publicURL
            childImageSharp {
              gatsbyImageData(
                width: 900
                height: 480
                layout: CONSTRAINED
                transformOptions: { fit: COVER }
              )
            }
          }
        }
      }
    }
  }
`;

export default LearningHubPage;
