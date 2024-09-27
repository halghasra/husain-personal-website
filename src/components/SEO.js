import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ post, siteMetadata }) => {
    const schemaOrgJSONLD = {
      '@context': 'http://schema.org',
      '@type': 'BlogPosting',
      'headline': post.frontmatter.title,
      'image': post.frontmatter.coverImage ? `${siteMetadata.siteUrl}${post.frontmatter.coverImage.childImageSharp.gatsbyImageData.images.fallback.src}` : '',
      'datePublished': post.frontmatter.date,
      'dateModified': post.frontmatter.lastModified || post.frontmatter.date,
      'author': {
        '@type': 'Person',
        'name': siteMetadata.author,
      },
      'description': post.excerpt,
    }
  
    return (
      <Helmet>
        <title>{post.frontmatter.title} | {siteMetadata.title}</title>
        <meta name="description" content={post.excerpt} />
        <script type="application/ld+json">
          {JSON.stringify(schemaOrgJSONLD)}
        </script>
        <meta property="og:title" content={post.frontmatter.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={`${siteMetadata.siteUrl}${post.frontmatter.coverImage.childImageSharp.gatsbyImageData.images.fallback.src}`} />
        <meta property="og:url" content={`${siteMetadata.siteUrl}${post.fields.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
    )
  }
  
  export default SEO