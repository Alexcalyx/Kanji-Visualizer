// src/components/Layout.jsx
import React, { useContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
// Context for theme state
import { ThemeContext } from '../contexts/ThemeContext'; // Adjust path if needed
// Background component
import ParticlesBackground from './ParticlesBackground';
// The new theme toggle button component
// import ThemeToggleButton from './ThemeToggleButton'; // Adjust path if needed

function Layout() {
    // Get theme state from context for styling elements within Layout
    const { theme } = useContext(ThemeContext);
    // Get location to conditionally render parts of the nav
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    // --- Styles --- (Based on theme state)
    // These styles apply directly to the Layout's elements
    const navStyle = `p-4 shadow-lg sticky top-0 z-50 border-b glassmorphism ${
      theme === 'light' ? 'glassmorphism-light border-white/20' : 'glassmorphism-dark border-slate-700/40'
    }`;
    // Define primary color (adjust if you want this to change with theme)
    const primaryColor = 'text-primary-neon';
    // Base style for navigation links
    const navLinkBase = 'text-sm sm:text-base font-heading transition-colors duration-200 px-2 py-1 rounded-md whitespace-nowrap';
    // Theme-dependent styles for navigation links
    const navLinkStyle = `${navLinkBase} ${
      theme === 'light'
        ? 'text-slate-600 hover:text-primary-neon hover:bg-cyan-500/10'
        : 'text-slate-300 hover:text-primary-neon hover:bg-primary-neon/10'
    }`;
    // Button-specific styling is now handled within ThemeToggleButton

    return (
        // Main container ensures minimum screen height and flex column layout
        <div className="min-h-screen flex flex-col">
            {/* Render the particle background */}
            <ParticlesBackground />

            {/* Sticky Header Navigation */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }} // Initial animation state (off-screen)
                animate={{ y: 0, opacity: 1 }}      // Animate into view
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }} // Animation timing
                className={navStyle} // Apply dynamic styles based on theme
            >
                {/* Navigation content container */}
                <div className="container mx-auto flex justify-between items-center px-4 sm:px-6">

                    {/* Logo/Brand Link */}
                    <Link to="/" className={`text-3xl font-heading font-bold ${primaryColor} transition-colors flex items-center gap-1 hover:brightness-125`}>
                        Kanji <span className={`text-4xl font-display`}> Visualizer</span>
                    </Link>

                    {/* Right-aligned navigation items */}
                    <div className="flex items-center space-x-1 sm:space-x-2">

                        {/* Conditionally render Grade Links (only shown if NOT on the home page) */}
                        {!isHomePage && (
                            <div className="flex items-center space-x-1 sm:space-x-2 mr-2"> {/* Links container */}
                                {[1, 2, 3, 4, 5, 6].map(grade => (
                                    <Link key={grade} to={`/grade/${grade}`} className={navLinkStyle}>
                                        G{grade} {/* Shortened Grade link text */}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Render the Theme Toggle Button Component */}
                        {/* <ThemeToggleButton /> */}

                    </div> {/* End Right side container */}
                </div> {/* End Nav container */}
            </motion.nav>

            {/* Main Content Area - Outlet renders the matched route's component */}
            <main className="container mx-auto p-4 py-6 md:p-6 md:py-8 relative z-10 flex-grow">
                {/* Outlet renders components like HomePage, KanjiGrid, etc., based on the current route */}
                <Outlet />
            </main>

            {/* You can add a Footer component here if needed */}
            {/* <Footer /> */}

        </div> // End main container
    );
}

export default Layout;