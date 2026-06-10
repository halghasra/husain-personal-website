import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

const SEO = ({ title, description, post, siteMetadata: propsMeta }) => {
  const data = useStaticQuery(graphql`
    query SEOSiteMetadata {
      site {
        siteMetadata {
          title
          description
          siteUrl
          author {
            name
          }
        }
      }
    }
  `)

  const meta = propsMeta || data.site.siteMetadata
  const siteTitle = meta?.title || "Husain Alghasra"
  const siteUrl = meta?.siteUrl || "https://husainalghasra.com"

  const pageTitle = post?.frontmatter?.title || title || siteTitle
  const pageDescription =
    post?.excerpt || description || meta?.description || ""

  const coverImageSrc =
    post?.frontmatter?.coverImage?.childImageSharp?.gatsbyImageData?.images
      ?.fallback?.src

  const ogImage = coverImageSrc ? `${siteUrl}${coverImageSrc}` : ""

  const schemaOrgJSONLD = {
    "@context": "http://schema.org",
    "@type": "BlogPosting",
    headline: pageTitle,
    image: ogImage,
    datePublished: post?.frontmatter?.date || "",
    dateModified: post?.frontmatter?.lastModified || post?.frontmatter?.date || "",
    author: {
      "@type": "Person",
      name: meta?.author?.name || "Husain Alghasra",
    },
    description: pageDescription,
  }

  return (
    <Helmet>
      <title>
        {pageTitle === siteTitle ? siteTitle : `${pageTitle} | ${siteTitle}`}
      </title>
      <meta name="description" content={pageDescription} />
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSONLD)}
      </script>
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {post?.fields?.slug && (
        <meta
          property="og:url"
          content={`${siteUrl}${post.fields.slug}`}
        />
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  )
}

export default SEO
