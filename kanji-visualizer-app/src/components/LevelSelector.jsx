import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeContext } from '../contexts/ThemeContext'; // Adjust path

function LevelSelector() {
    const { theme } = useContext(ThemeContext);

    const buttonBase = "px-6 py-3 rounded-lg font-heading text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2";
    const buttonActive = theme === 'light'
        ? "bg-gradient-to-br from-primary to-secondary text-white border-transparent hover:shadow-cyan-500/50"
        : "bg-gradient-to-br from-neon-cyan via-purple-600 to-neon-magenta text-slate-900 border-transparent hover:shadow-[0_0_15px_theme(colors.neon-cyan),0_0_15px_theme(colors.neon-magenta)]";

    const buttonDisabled = theme === 'light' ? "bg-slate-200 text-slate-400 cursor-not-allowed border-transparent" : "bg-slate-700 text-slate-500 cursor-not-allowed border-slate-600";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
            className={`p-6 md:p-10 rounded-xl shadow-2xl glassmorphism ${
                theme === 'light' ? 'glassmorphism-light border-white/30' : 'glassmorphism-dark border-slate-700/40'
            }`}
        >
            <h2 className="text-3xl font-heading font-bold mb-8 text-center sm:text-left text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta filter drop-shadow-neon-cyan-sm">
                Select School Grade Level
            </h2>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 md:gap-5">
                {[1, 2, 3, 4, 5, 6].map(grade => (
                    <motion.div key={grade}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="interactive-hover" // Add class for cursor hover detection
                    >
                        <Link to={`/grade/${grade}`} className={`${buttonBase} ${buttonActive}`}>
                            Grade {grade}
                        </Link>
                    </motion.div>
                ))}
                <div className={`${buttonBase} ${buttonDisabled}`}>
                    Jouyou (Soon)
                </div>
            </div>
        </motion.div>
    );
}

export default LevelSelector;