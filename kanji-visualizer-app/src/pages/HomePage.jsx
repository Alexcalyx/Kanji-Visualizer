// src/components/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Descriptive Text --- (No change)
const toolDescription = `
    Kanji Visualizer transforms the often challenging task of learning Kanji into an engaging visual journey.
    Explore characters by grade level, delve into detailed meanings, readings,
    and examples, and visualize stroke order animations. This tool is designed to be intuitive for young learners beginning
    their Japanese studies and powerful enough for JLPT candidates aiming to master complex characters.
    Build a solid foundation for Japanese literacy with this tool.
`;

function HomePage() {
    // Link styling - Adjusted padding slightly for mobile, removed nowrap
    const gradeLinkStyle = "text-sm hover:underline px-3 py-2 rounded transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600"; // Added subtle border on hover

    return (
        // Centering container - Reduced min-height slightly for potentially shorter mobile screens
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            // Adjusted vertical padding on mobile (py-8) vs larger screens (py-12)
            className="flex flex-col items-center justify-center text-center min-h-[65vh] px-4 py-8 sm:py-12"
        >
            {/* Title - Added smaller base size */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6"> {/* Reduced bottom margin slightly */}
                Kanji Learning Tool
            </h1>

            {/* Description - Added responsive max-width */}
            <p className="text-sm md:text-lg max-w-xl sm:max-w-2xl lg:max-w-4xl mb-8 md:mb-10"> {/* Added bottom margin */}
                {toolDescription.trim()} {/* Use trim() to remove leading/trailing whitespace */}
            </p>

            {/* --- Grade Links Section (Mobile Friendly) --- */}
            {/* Changed to flex-col for stacking label/links, adjusted padding/width */}
            <div className="flex flex-col items-center pt-4 md:pt-6 w-full max-w-xl lg:max-w-2xl">
                {/* Label - Added bottom margin for mobile stacking */}
                <span className="text-base font-semibold mb-3 whitespace-nowrap"> {/* Removed mr-4, added mb-3 */}
                    Browse by Grade:
                </span>
                {/* Grade Links Container - Allows wrapping, centers items, adds gap */}
                <div className="flex flex-wrap justify-center gap-2"> {/* Use flex-wrap and gap */}
                    {[1, 2, 3, 4, 5, 6].map(grade => (
                        <Link
                            key={grade}
                            to={`/grade/${grade}`}
                            className={`${gradeLinkStyle} flex-shrink-0`} // Apply style, allow shrinking if somehow needed but wrap is primary
                        >
                            Grade {grade}
                        </Link>
                    ))}
                </div>
            </div> {/* End Grade Links Section */}

        </motion.div> // End Centering Container
    );
}

export default HomePage;