import React from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import * as styles from '../styles/category.module.css';

const Categories = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark {
        group(field: {frontmatter: {categories: SELECT}}) {
          fieldValue
          totalCount
        }
      }
    }
  `);

  return (
    <div className={styles.categoriesContainer}>
      <h2>Categories</h2>
      <ul className={styles.categoryList}>
        {data.allMarkdownRemark.group.map(category => (
          <li key={category.fieldValue}>
            <Link to={`/category/${category.fieldValue.toLowerCase()}`}>
              {category.fieldValue} ({category.totalCount})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;