import React from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';

const Sidebar = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        filter: {fields: {slug: {regex: "/^\/learning-hub\//"}}},
        sort: {fields: {slug: ASC}}
      ) {
        edges {
          node {
            fields {
              slug
              categorySlug
              topicSlug
              unitSlug
            }
            frontmatter {
              title
              category
              topic
              unit
            }
          }
        }
      }
    }
  `);

  const organizeHierarchy = (edges) => {
    const hierarchy = {};
    edges.forEach(({ node }) => {
      const { category, topic, unit } = node.frontmatter;
      if (category) {
        if (!hierarchy[category]) hierarchy[category] = {};
        if (topic) {
          if (!hierarchy[category][topic]) hierarchy[category][topic] = {};
          if (unit) {
            hierarchy[category][topic][unit] = node;
          } else {
            hierarchy[category][topic] = node;
          }
        } else {
          hierarchy[category] = node;
        }
      }
    });
    return hierarchy;
  };

  const hierarchy = organizeHierarchy(data.allMarkdownRemark.edges);

  return (
    <nav className="sidebar">
      {Object.entries(hierarchy).map(([category, topics]) => (
        <div key={category}>
          <h3>{category}</h3>
          {typeof topics === 'object' && !topics.fields ? (
            Object.entries(topics).map(([topic, units]) => (
              <div key={topic}>
                <h4>{topic}</h4>
                {typeof units === 'object' && !units.fields ? (
                  <ul>
                    {Object.entries(units).map(([unit, node]) => (
                      <li key={unit}>
                        <Link to={node.fields.slug}>{unit}</Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Link to={units.fields.slug}>{units.frontmatter.title}</Link>
                )}
              </div>
            ))
          ) : (
            <Link to={topics.fields.slug}>{topics.frontmatter.title}</Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Sidebar;