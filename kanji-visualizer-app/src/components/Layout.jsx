// src/components/Layout.jsx
import React, { useContext } from 'react';
// Import useLocation to check the current path
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext'; // Adjust path
import ParticlesBackground from './ParticlesBackground';

function Layout() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const location = useLocation(); // Get current location object
    const isHomePage = location.pathname === '/'; // Check if it's the home page

    // --- Styles --- (Assuming base theme classes are applied via Context)
    const navStyle = `p-4 shadow-lg sticky top-0 z-50 border-b glassmorphism ${
      theme === 'light' ? 'glassmorphism-light border-white/20' : 'glassmorphism-dark border-slate-700/40'
    }`;
    const primaryColor = 'text-primary-neon'; // Use theme variable if styling works later
    const navLinkBase = 'text-sm sm:text-base font-heading transition-colors duration-200 px-2 py-1 rounded-md';
    const navLinkStyle = `${navLinkBase} ${
      theme === 'light'
        ? 'text-slate-600 hover:text-primary-neon hover:bg-cyan-500/10'
        : 'text-slate-300 hover:text-primary-neon hover:bg-primary-neon/10'
    }`;
    const themeButtonBg = theme === 'light' ? 'bg-slate-200 hover:bg-slate-300' : 'bg-slate-700 hover:bg-slate-600';
    const themeButtonIcon = theme === 'light' ? 'text-slate-700' : 'text-yellow-300';

    return (
        <div className="min-h-screen flex flex-col">
            {/* Particle Background */}
            <ParticlesBackground />

            {/* Sticky Header */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                className={navStyle}
            >
                <div className="container mx-auto flex justify-between items-center px-4 sm:px-6">
                    {/* Logo */}
                    <Link to="/" className={`text-3xl font-heading font-bold ${primaryColor} transition-colors flex items-center gap-1 hover:brightness-125`}>
                        Kanji <span className={`text-4xl font-display`}> Visualizer</span>
                    </Link>

                    {/* Right side: Grade Links (Conditional) + Theme Toggle */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        {/* --- Conditionally render Grade Links --- */}
                        {!isHomePage && (
                            <div className="flex items-center space-x-1 sm:space-x-2 mr-2"> {/* Add margin if needed */}
                                {[1, 2, 3, 4, 5, 6].map(grade => (
                                    <Link key={grade} to={`/grade/${grade}`} className={navLinkStyle}>
                                        G{grade}
                                    </Link>
                                ))}
                            </div>
                        )}
                        {/* Theme Toggle Button */}
                        <motion.button
                            onClick={toggleTheme} title="Toggle Theme" aria-label="Toggle theme"
                            className={`p-1.5 rounded-full transition-colors duration-200 ${themeButtonBg}`}
                            whileHover={{ scale: 1.1, rotate: 15, filter: 'drop-shadow(0 0 4px rgba(255, 255, 100, 0.6))' }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <div className="w-5 h-5 overflow-hidden">
                                <motion.div animate={{ y: theme === 'dark' ? '-100%' : '0%' }} transition={{ duration: 0.5, ease: 'easeInOut' }}>
                                    <Sun size={20} className={themeButtonIcon} />
                                    <Moon size={20} className={themeButtonIcon} />
                                </motion.div>
                            </div>
                        </motion.button>
                    </div> {/* End Right side container */}
                </div> {/* End Nav container */}
            </motion.nav>

            {/* Main Content Area */}
            <main className="container mx-auto p-4 py-6 md:p-6 md:py-8 relative z-10 flex-grow">
                <Outlet /> {/* Renders HomePage or KanjiGrid etc. via AnimatedRoutes */}
            </main>
        </div>
    );
}
export default Layout;