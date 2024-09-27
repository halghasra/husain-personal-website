import React from 'react';
import { Disqus } from 'gatsby-plugin-disqus';

const Comments = ({ post, siteUrl }) => {
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