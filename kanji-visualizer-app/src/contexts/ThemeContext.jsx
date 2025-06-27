// src/contexts/ThemeContext.jsx
import React, {
  useState,
  useEffect,
  createContext,
  useMemo,
  useCallback,
  useContext,
} from "react"; // Added useContext
import PropTypes from "prop-types";

export const ThemeContext = createContext(undefined);

// Custom hook to use the ThemeContext easily
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export function ThemeProvider({ children }) {
  // To ALWAYS default to light mode on first visit:
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      return storedTheme; // Use saved theme if exists
    }
    return "light";
  });

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme); // Keep saving preference
      return newTheme;
    });
  }, []); // Empty dependency array is correct here

  useEffect(() => {
    const root = document.documentElement; // Target <html> element
    const body = document.body;

    // --- Simplified Logic ---
    // 1. Manage the 'dark' class on the <html> element for Tailwind
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // 2. Optionally manage specific body classes NOT handled by Tailwind's dark: prefix
    // (Like your animated gradient, which should only apply in dark mode)
    const darkOnlyBodyClasses = ["bg-animated-gradient", "animate-gradient-bg"];
    if (theme === "dark") {
      body.classList.add(...darkOnlyBodyClasses);
    } else {
      body.classList.remove(...darkOnlyBodyClasses);
    }

    // Base body classes like font, antialiased etc. can be applied once
    // either here (if not using addBase) or preferably via addBase in tailwind.config.js
    // The bg-bg-light/dark and text-text-light/dark are handled by addBase + the dark class on <html>
  }, [theme]); // Effect runs when theme changes

  // Memoize context value
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
