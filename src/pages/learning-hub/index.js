import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import TableOfContents from '../../components/TableOfContents';
import * as styles from '../../styles/learning-hub.module.css';

const LearningHubPage = ({ data }) => {
  const lessons = data.allMarkdownRemark.nodes;

  return (
    <Layout fullWidth>
      <div className={styles.learningHubContainer}>
        {/* Left Sidebar */}
        <aside className={styles.sidebar}>
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <div className={styles.breadcrumbs}>
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/learning-hub">Learning Hub</Link>
          </div>

          <article className={styles.content}>
            <h1>Welcome to the Learning Hub</h1>
            <p className={styles.introduction}>
              Explore comprehensive lessons on distributed systems, computer science fundamentals, 
              and more. Select a course from the sidebar to begin your learning journey.
            </p>

            <section className={styles.availableCourses}>
              <h2>Available Courses</h2>
              <div className={styles.courseGrid}>
                {lessons
                  .filter(lesson => lesson.frontmatter.isMainCourse)
                  .map((course) => (
                    <div key={course.fields.slug} className={styles.courseCard}>
                      <h3>{course.frontmatter.title}</h3>
                      <p>{course.frontmatter.description}</p>
                      <Link to={course.fields.slug} className={styles.courseLink}>
                        Start Learning →
                      </Link>
                    </div>
                  ))}
              </div>
            </section>
          </article>
        </main>

        {/* Right TOC */}
        <aside className={styles.tableOfContents}>
          <TableOfContents headings={[
            { value: 'Welcome to the Learning Hub', id: 'welcome-to-the-learning-hub', depth: 1 },
            { value: 'Available Courses', id: 'available-courses', depth: 2 }
          ]} />
        </aside>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: { frontmatter: { order: ASC } }
      filter: { 
        fileAbsolutePath: { regex: "/content/learning-hub/" }
      }
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          title
          description
          isMainCourse
          order
        }
      }
    }
  }
`;

export default LearningHubPage;