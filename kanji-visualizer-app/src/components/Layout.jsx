// src/components/Layout.jsx
import React, { useContext } from 'react';
// Import NavLink instead of just Link
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeContext } from '../contexts/ThemeContext';
import ParticlesBackground from './ParticlesBackground';
import Footer from './Footer';
// import ThemeToggleButton from './ThemeToggleButton';

function Layout() {
    const { theme } = useContext(ThemeContext);
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    // --- Styles ---
    const navStyle = `p-4 shadow-lg sticky top-0 z-50 border-b glassmorphism ${
      theme === 'light' ? 'glassmorphism-light border-white/20' : 'glassmorphism-dark border-slate-700/40'
    }`;
    const primaryColor = 'text-primary-neon'; // Keep for logo etc.

    // --- Link Styles ---
    const navLinkBase = 'text-sm sm:text-base font-heading transition-colors duration-200 px-2 py-1 rounded-md whitespace-nowrap';
    // Regular (non-active) link styles per theme
    const navLinkDefaultLight = 'text-slate-600 hover:text-primary-neon hover:bg-cyan-500/10';
    const navLinkDefaultDark = 'text-slate-300 hover:text-primary-neon hover:bg-primary-neon/10';
    // Active link styles per theme (Example: different bg and text color)
    const navLinkActiveLight = 'bg-cyan-100 dark:bg-cyan-500/10 text-primary-dark font-semibold'; // Example active light style
    const navLinkActiveDark = 'bg-primary-neon/20 text-primary-neon font-semibold'; // Example active dark style

    return (
        <div className="min-h-screen flex flex-col">
            <ParticlesBackground />

            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                className={navStyle}
            >
                <div className="container mx-auto flex justify-between items-center px-4 sm:px-6">
                    {/* Logo */}
                    <NavLink to="/" className={`text-3xl font-heading font-bold ${primaryColor} transition-colors flex items-center gap-1 hover:brightness-125`}>
                        Kanji <span className={`text-4xl font-display`}> Visualizer</span>
                    </NavLink>

                    {/* Right side */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        {/* --- Grade Links --- */}
                        {!isHomePage && (
                            <div className="flex items-center space-x-1 sm:space-x-2 mr-2">
                                {[1, 2, 3, 4, 5, 6].map(grade => (
                                    // --- Use NavLink instead of Link ---
                                    <NavLink
                                        key={grade}
                                        to={`/grade/${grade}`}
                                        // Use className as a function to check isActive
                                        className={({ isActive }) =>
                                            `${navLinkBase} ${ // Always apply base styles
                                                isActive
                                                    ? (theme === 'light' ? navLinkActiveLight : navLinkActiveDark) // Apply active styles based on theme
                                                    : (theme === 'light' ? navLinkDefaultLight : navLinkDefaultDark) // Apply default styles based on theme
                                            }`
                                        }
                                    >
                                        G{grade}
                                    </NavLink>
                                ))}
                            </div>
                        )}
                        {/* <ThemeToggleButton /> */}
                    </div>
                </div>
            </motion.nav>

            <main className="container mx-auto p-4 py-6 md:p-6 md:py-8 relative z-10 flex-grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

export default Layout;