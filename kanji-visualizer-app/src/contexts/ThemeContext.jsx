// src/contexts/ThemeContext.jsx
import React, { useState, useEffect, createContext, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

// Ensure context is exported if used elsewhere directly
export const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        return storedTheme;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
        const newTheme = prevTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        return newTheme;
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement; // Target <html> element
    const body = document.body;
    const bodyClass = body.classList;

    // Set 'dark' or 'light' class on <html> for Tailwind 'dark:' prefix
    root.className = theme;

    // Define classes based on theme
    const lightClasses = ['bg-bg-light', 'text-text-light'];
    const darkClasses = ['bg-bg-dark', 'text-text-dark', 'bg-animated-gradient', 'animate-gradient-bg']; // Include animated background for dark

    // Apply base classes (ensure they are not removed)
    bodyClass.add('font-sans', 'antialiased', 'transition-colors', 'duration-300');

    // Remove classes from the other theme and add classes for the current theme
    if (theme === 'light') {
        bodyClass.remove(...darkClasses);
        bodyClass.add(...lightClasses);
    } else {
        bodyClass.remove(...lightClasses);
        bodyClass.add(...darkClasses);
    }

  }, [theme]); // Effect runs when theme changes

  // Memoize context value
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired
};