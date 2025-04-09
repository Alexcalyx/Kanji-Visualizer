// src/components/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Descriptive Text --- (No change)
const toolDescription = `
    Kanji Visualizer transforms the often challenging task of learning Kanji into an engaging visual journey.
    Explore characters by grade level or search functionality, delve into detailed meanings, readings,
    and examples, visualize stroke order animations, and discover connections between related Kanji
    through interactive graphs. This tool is designed to be intuitive for young learners beginning
    their Japanese studies and powerful enough for JLPT candidates aiming to master complex characters.
    Build a solid foundation for Japanese literacy with this tool.
`; // Note: Removed leading spaces for cleaner rendering if needed

function HomePage() {
    // Link styling (No change)
    const gradeLinkStyle = "text-sm hover:underline px-4 py-2 rounded transition-colors whitespace-nowrap"; // Added whitespace-nowrap to links

    return (
        // Centering container
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center justify-center text-center min-h-[70vh] px-4"
        >
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                Kanji Learning Tool
            </h1>

            {/* Description */}
            {/* --- CHANGE HERE: Increased max-w-2xl to max-w-4xl --- */}
            <p className="text-base md:text-lg max-w-4xl mb-10">
                {toolDescription}
            </p>

            {/* --- Grade Links Section --- */}
            {/* --- CHANGES HERE: Removed flex-wrap, increased max-w-xl to max-w-4xl, removed gap-y-4 --- */}
            <div className="flex justify-center items-center gap-x-6 pt-6 pb-4 w-full max-w-4xl overflow-x-auto">
                {/* Label */}
                {/* Added whitespace-nowrap to prevent label wrapping */}
                <span className="text-base font-semibold mr-4 flex-shrink-0 whitespace-nowrap">
                    Browse by Grade:
                </span>
                {/* Grade Links Container - Added internal flex container for links */}
                <div className="flex items-center gap-x-6">
                     {[1, 2, 3, 4, 5, 6].map(grade => (
                        <Link key={grade} to={`/grade/${grade}`} className={gradeLinkStyle}>
                            Grade {grade}
                        </Link>
                     ))}
                </div>
            </div> {/* End Grade Links Section */}

        </motion.div> // End Centering Container
    );
}

export default HomePage;