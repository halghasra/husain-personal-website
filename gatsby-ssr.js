import React from 'react';
import { ThemeProvider } from './src/components/ThemeContext';

/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
export const onRenderBody = ({ setHtmlAttributes, setBodyAttributes }) => {
  setHtmlAttributes({ lang: `en` });
  setBodyAttributes({ className: 'light' }); // Default to light theme
};

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
);
