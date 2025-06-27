import React, { useState, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react"; // Using lucide-react for icons
import useKanjiList from "../hooks/useKanjiList"; // Adjust path
import { KanjiCard } from "../components/kanji";
import {
  PaginationControls,
  ErrorDisplay,
  LoadingSpinner,
} from "../components/common";

// --- Constants ---
const ITEMS_PER_PAGE = 40; // Keep items per page manageable

function KanjiGrid({ grade }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const searchInputRef = useRef(null);
  const gridTopRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  const { kanjiList, isLoading, error, isFromCache } = useKanjiList(grade);

  // --- Debounce Logic ---
  useEffect(() => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      setSearchTerm(inputValue);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 300); // 300ms debounce delay
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, [inputValue]);

  // --- Filtering Logic ---
  const filteredKanjiList = useMemo(() => {
    if (!Array.isArray(kanjiList)) return [];
    if (!searchTerm) return kanjiList;
    const lowerSearchTerm = searchTerm.toLowerCase().trim(); // Trim search term
    if (!lowerSearchTerm) return kanjiList; // Handle empty trimmed search
    // Simple character inclusion check
    return kanjiList.filter(
      (k) => k && typeof k === "string" && k.includes(lowerSearchTerm)
    );
    // Note: If searching by meaning/reading is needed, API/data structure needs adjustment
  }, [kanjiList, searchTerm]);

  // --- Pagination Logic ---
  const totalItems = filteredKanjiList.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedKanjiList = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredKanjiList.slice(startIndex, endIndex);
  }, [filteredKanjiList, currentPage]);

  // --- Page Change Handler ---
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to top of grid smoothly
      gridTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // --- Loading State ---
  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <LoadingSpinner />
      </div>
    );

  // --- Error State ---
  if (error)
    return (
      <div className="mt-10">
        <ErrorDisplay message={error} context={`Grade ${grade} Kanji List`} />
      </div>
    );

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.02, delayChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 150, damping: 20 },
    },
  };

  // --- Grade Description Helper ---
  const getGradeDescription = (id) => {
    const gradeMap = {
      1: "Grade 1 (小学校１年生)",
      2: "Grade 2 (小学校２年生)",
      3: "Grade 3 (小学校３年生)",
      4: "Grade 4 (小学校４年生)",
      5: "Grade 5 (小学校５年生)",
      6: "Grade 6 (小学校６年生)",
    };
    return gradeMap[id] || `Grade ${id}`;
  };

  // --- Render Component ---
  return (
    // Added ref, responsive vertical spacing
    <div ref={gridTopRef} className="space-y-6 md:space-y-8 lg:space-y-10">
      {/* Title - Responsive Text */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        // Responsive text size
        className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary-neon to-secondary-neon filter drop-shadow-neon-cyan-sm"
      >
        Kanji List
      </motion.h2>

      {/* Grade Description */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        // Responsive text size
        className="text-center text-2xl sm:text-3xl lg:text-4xl text-slate-600"
      >
        {getGradeDescription(grade)}
      </motion.p>

      {/* Pagination Controls (Top) - Assuming it's responsive */}
      {totalPages > 1 && ( // Only show if more than one page
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Animated Grid - RESPONSIVE COLUMNS & GAPS */}
      {paginatedKanjiList && paginatedKanjiList.length > 0 ? (
        <motion.div
          key={`${grade}-${searchTerm}-${currentPage}`} // More robust key for re-animation
          // Responsive grid columns and gaps
          className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 md:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {paginatedKanjiList.map((kanji) => (
            // Removed extra padding div around item, apply padding within item if needed
            <motion.div key={kanji} variants={itemVariants}>
              <KanjiCard kanji={kanji} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        // No Results Message
        <div className="text-center text-lg italic py-16 px-6 rounded-lg text-slate-500 bg-slate-50/50 border border-slate-200/60">
          {kanjiList && kanjiList.length > 0
            ? "No Kanji found matching your search."
            : `No Kanji data loaded for Grade ${grade}.`}
        </div>
      )}

      {/* Pagination Controls (Bottom) - Assuming it's responsive */}
      {totalPages > 1 && ( // Only show if more than one page
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

KanjiGrid.propTypes = {
  grade: PropTypes.string.isRequired,
};

export default KanjiGrid;
