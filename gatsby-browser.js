import React from 'react';
import { ThemeProvider } from './src/components/ThemeContext';
import './src/styles/global.css';
import './src/styles/fonts.css';
import './src/styles/lesson-callouts.css';

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
);