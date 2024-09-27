import React from 'react';
import { Disqus } from 'gatsby-plugin-disqus';

const Comments = ({ post, siteUrl }) => {
    if (!process.env.GATSBY_DISQUS_SHORTNAME) {
        console.warn('Disqus shortname is not set. Comments will not be rendered.');
        return <p>Comments are currently unavailable.</p>;
      }
  const disqusConfig = {
    url: `${siteUrl}${post.fields.slug}`,
    identifier: post.id,
    title: post.frontmatter.title,
  };

  return (
    <div>
      <h3>Comments</h3>
      <Disqus config={disqusConfig} />
    </div>
  );
};

export default Comments;