// src/components/ThemeToggleButton.jsx (or wherever you want it)
import React from 'react';
import { useTheme } from '../contexts/ThemeContext'; // Adjust path
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'; // Or your preferred icon library

function ThemeToggleButton() {
    const { theme, toggleTheme } = useTheme(); // Get theme state and toggle function from context

    if (!theme) return null; // Avoid rendering if context is not yet available (optional)

    return (
        <button
            onClick={toggleTheme} // Use the toggle function from context
            className="p-2 rounded-full transition-colors duration-200 ease-in-out
                       text-gray-600 hover:text-gray-900 hover:bg-gray-200
                       dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700"
                       // Removed text-subtle-* and used explicit colors for better control
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? (
                <SunIcon className="w-5 h-5" />
            ) : (
                <MoonIcon className="w-5 h-5" />
            )}
        </button>
    );
}

export default ThemeToggleButton;