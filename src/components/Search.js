import React, { useState } from 'react';
import { Link } from 'gatsby';
import * as styles from '../styles/search.module.css';

const Search = ({ posts }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setQuery(searchQuery);

    if (searchQuery.length > 2) {
      const filteredResults = posts.filter(
        post =>
          post.frontmatter.title.toLowerCase().includes(searchQuery) ||
          post.excerpt.toLowerCase().includes(searchQuery)
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search posts..."
        value={query}
        onChange={handleSearch}
        className={styles.searchInput}
      />
      {results.length > 0 && (
        <ul className={styles.searchResults}>
          {results.map((result) => (
            <li key={result.fields.slug}>
              <Link to={result.fields.slug}>
                {result.frontmatter.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;