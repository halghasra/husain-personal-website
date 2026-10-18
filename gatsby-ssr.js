import React from 'react';
import { ThemeProvider } from './src/components/ThemeContext';

const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..600' +
  '&family=Literata:ital,opsz,wght@0,7..72,300..600;1,7..72,300..500' +
  '&family=Fragment+Mono:ital@0;1&display=swap';

// Runs before first paint so a reader who chose the paper theme never sees a dark flash.
// Dark is the default; only an explicit "light" choice switches it.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.classList.add(t==='light'?'light':'dark');}catch(e){document.documentElement.classList.add('dark');}})();`;

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
export const onRenderBody = ({ setHtmlAttributes, setHeadComponents, setPreBodyComponents }) => {
  setHtmlAttributes({ lang: `en` });
  setHeadComponents([
    <link key="gf-pre" rel="preconnect" href="https://fonts.googleapis.com" />,
    <link key="gs-pre" rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />,
    <link key="fonts" rel="stylesheet" href={FONTS_URL} />,
  ]);
  setPreBodyComponents([
    <script key="theme" dangerouslySetInnerHTML={{ __html: themeScript }} />,
  ]);
};

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
);
