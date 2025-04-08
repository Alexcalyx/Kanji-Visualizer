// src/components/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Descriptive Text --- (No change)
const toolDescription = `
    KanjiViz transforms the often challenging task of learning Kanji into an engaging visual journey.
    Explore characters by grade level or JLPT proficiency, delve into detailed meanings, readings,
    and examples, visualize stroke order animations, and discover connections between related Kanji
    through interactive graphs. This tool is designed to be intuitive for young learners beginning
    their Japanese studies and powerful enough for JLPT candidates aiming to master complex characters.
    Track your progress and build a solid foundation for Japanese literacy.
`;

function HomePage() {
    // Link styling (No change)
    const gradeLinkStyle = "text-sm hover:underline px-4 py-2 rounded transition-colors";

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
            <p className="text-base md:text-lg max-w-2xl mb-10">
                {toolDescription}
            </p>

            {/* --- Grade Links Section --- */}
            {/* Removed border classes, kept padding/gap/width constraints */}
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 pt-6 pb-4 w-full max-w-xl">
                {/* Label */}
                <span className="text-base font-semibold mb-1 md:mb-0 mr-4">
                    Browse by Grade:
                </span>
                {/* Grade Links */}
                {[1, 2, 3, 4, 5, 6].map(grade => (
                    <Link key={grade} to={`/grade/${grade}`} className={gradeLinkStyle}>
                        Grade {grade}
                    </Link>
                ))}
            </div> {/* End Grade Links Section */}

        </motion.div> // End Centering Container
    );
}

export default HomePage;