import React from 'react';

const TableOfContents = ({ headings }) => {
  return (
    <nav className="table-of-contents">
      <h3>Table of Contents</h3>
      <ul>
        {headings.map(heading => (
          <li key={heading.id} style={{ marginLeft: `${(heading.depth - 1) * 20}px` }}>
            <a href={`#${heading.id}`}>{heading.value}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;