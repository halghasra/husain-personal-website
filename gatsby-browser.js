import React from 'react';
import { ThemeProvider } from './src/components/ThemeContext';
import './src/styles/global.css';

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
);