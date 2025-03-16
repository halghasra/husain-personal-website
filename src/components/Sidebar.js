import React from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import * as styles from '../styles/sidebar.module.css';

const Sidebar = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        filter: { fields: { slug: { regex: "/^/learning-hub/" } } }
        sort: { fields: [frontmatter___order, frontmatter___title], order: [ASC, ASC] }
      ) {
        nodes {
          frontmatter {
            title
            category
            topic
            unit
            order
            isMainCourse
          }
          fields {
            slug
          }
        }
      }
    }
  `);

  // Organize the data into a hierarchical structure
  const organizeContent = (nodes) => {
    const structure = {};
    
    nodes.forEach(node => {
      const { category, topic, unit, isMainCourse, title } = node.frontmatter;
      
      if (isMainCourse) {
        if (!structure[category]) {
          structure[category] = {
            title: category,
            mainCourse: { title, slug: node.fields.slug },
            topics: {}
          };
        }
      } else if (category && topic) {
        if (!structure[category]) {
          structure[category] = { title: category, topics: {} };
        }
        if (!structure[category].topics[topic]) {
          structure[category].topics[topic] = {
            title: topic,
            units: []
          };
        }
        structure[category].topics[topic].units.push({
          title: unit || title,
          slug: node.fields.slug
        });
      }
    });

    return structure;
  };

  const contentStructure = organizeContent(data.allMarkdownRemark.nodes);

  return (
    <nav className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        {Object.entries(contentStructure).map(([categoryKey, category]) => (
          <div key={categoryKey} className={styles.category}>
            <h2 className={styles.categoryTitle}>{category.title}</h2>
            
            {category.mainCourse && (
              <Link 
                to={category.mainCourse.slug}
                className={styles.mainCourseLink}
                activeClassName={styles.active}
              >
                {category.mainCourse.title}
              </Link>
            )}

            {Object.entries(category.topics).map(([topicKey, topic]) => (
              <div key={topicKey} className={styles.topic}>
                <h3 className={styles.topicTitle}>{topic.title}</h3>
                <ul className={styles.unitList}>
                  {topic.units.map((unit, index) => (
                    <li key={index}>
                      <Link 
                        to={unit.slug}
                        className={styles.unitLink}
                        activeClassName={styles.active}
                      >
                        {unit.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;