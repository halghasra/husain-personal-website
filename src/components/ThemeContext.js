import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  isDarkMode: true,
  toggleTheme: () => {},
});

// Dark (cyanotype) is the default. The paper theme is an explicit choice, saved in localStorage.
// gatsby-ssr.js applies the saved class before first paint; this keeps it in sync afterwards.
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    try {
      setIsDarkMode(localStorage.getItem('theme') !== 'light');
    } catch (e) {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDarkMode);
    root.classList.toggle('light', !isDarkMode);
    try {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    } catch (e) {}
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(d => !d);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
