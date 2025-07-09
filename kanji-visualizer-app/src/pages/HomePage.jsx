import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const toolDescription = `
    Kanji Visualizer transforms the often challenging task of learning Kanji into an engaging visual journey.
    Explore characters by grade level, delve into detailed meanings, readings,
    and examples, and visualize stroke order animations. This tool is designed to be intuitive for young learners beginning
    their Japanese studies and powerful enough for JLPT candidates aiming to master complex characters.
    Build a solid foundation for Japanese literacy with this tool.
`;

function HomePage() {
  const gradeLinkStyle =
    "text-sm hover:underline px-3 py-2 rounded transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-col items-center justify-center text-center min-h-[65vh] px-4 py-8 sm:py-12"
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
        Kanji Learning Tool
      </h1>
      <p className="text-sm md:text-lg max-w-xl sm:max-w-2xl lg:max-w-4xl mb-8 md:mb-10">
        {toolDescription.trim()}
      </p>
      <Link
        to="/study"
        className="inline-block mb-6 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white text-lg font-bold rounded-lg shadow transition-colors"
      >
        Go to Study Center
      </Link>
      <div className="flex flex-col items-center pt-4 md:pt-6 w-full max-w-xl lg:max-w-2xl">
        <span className="text-base font-semibold mb-3 whitespace-nowrap">
          Browse by Grade:
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {[1, 2, 3, 4, 5, 6].map((grade) => (
            <Link
              key={grade}
              to={`/grade/${grade}`}
              className={`${gradeLinkStyle} flex-shrink-0`}
            >
              Grade {grade}
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default HomePage;
