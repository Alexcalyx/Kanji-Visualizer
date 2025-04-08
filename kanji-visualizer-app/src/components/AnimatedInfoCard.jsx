// src/components/AnimatedInfoCard.jsx
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
// Removed Framer Motion import if not used for entry/exit, relying on GSAP now
// import { motion } from 'framer-motion';
import { ThemeContext } from '../contexts/ThemeContext'; // Ensure correct path

// This component now primarily serves as a styled container.
// Animations are handled externally by GSAP in the parent (KanjiDetail).
function AnimatedInfoCard({ title, icon: Icon, children, className = '' }) {
    const { theme } = useContext(ThemeContext);

    return (
        // Pass down the className for GSAP targeting
        // Removed Framer Motion animation props (variants, initial, animate)
        <div
            className={`animated-info-card rounded-xl shadow-xl overflow-hidden glassmorphism ${theme === 'light' ? 'glassmorphism-light border-white/30' : 'glassmorphism-dark border-slate-700/40'} ${className}`} // Ensure base class + passed class
        >
            <h3 className={`flex items-center gap-2 text-lg sm:text-xl font-semibold font-heading p-4 border-b ${theme === 'light' ? 'bg-white/30 border-border-light text-slate-700' : 'bg-slate-900/30 border-border-dark text-slate-200'}`}> {/* Use heading font */}
                {Icon && <Icon size={20} className="text-primary dark:text-primary-neon" />} {/* Use explicit neon color */}
                {title}
            </h3>
            <div className="p-4 md:p-5">
                {children}
            </div>
        </div>
    );
}

AnimatedInfoCard.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
    children: PropTypes.node,
    className: PropTypes.string, // For external styling/targeting
};

export default AnimatedInfoCard;