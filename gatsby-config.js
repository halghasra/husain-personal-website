require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Husain Alghasra`,
    description: `A public notebook for curiosity, research, AI, systems, and knowledge work.`,
    author: {
      name: `Husain Alghasra`,
      summary: `Curious about how things work. Based in London.`,
    },
    social: {
      twitter: `husainalghasra`,
      github: `halghasra`,
      linkedin: `halghasra`,
      x: `husainalghasra`,
    },
    siteUrl: `https://husainalghasra.com/`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/content/blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `notes`,
        path: `${__dirname}/content/notes`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `essays`,
        path: `${__dirname}/content/essays`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `research-seeds`,
        path: `${__dirname}/content/research-seeds`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `paper-notes`,
        path: `${__dirname}/content/paper-notes`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `builds`,
        path: `${__dirname}/content/builds`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `learning-hub`,
        path: `${__dirname}/content/learning-hub`,
      },
    },
    {
      resolve: 'gatsby-plugin-webfonts',
      options: {
        fonts: {
          google: [
            {
              family: "Montserrat",
              variants: ["400", "500", "600", "700"],
            },
            {
              family: "Merriweather",
              variants: ["300", "400", "700"],
            },
          ],
        },
      },
    },
    'gatsby-plugin-minify',
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: process.env.GATSBY_DISQUS_NAME,
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 720,
              linkImagesToOriginal: false,
              withWebp: true,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Husain Alghasra`,
        short_name: `HG`,
        start_url: `/`,
        background_color: `#141210`,
        theme_color: `#f59e0b`,
        display: `minimal-ui`,
        icon: `src/images/favicon-32x32.png`,
      },
    },
  ],
}
