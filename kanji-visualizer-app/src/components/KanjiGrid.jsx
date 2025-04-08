import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

import { ThemeContext } from '../contexts/ThemeContext'; // Adjust path
import useKanjiList from '../hooks/useKanjiList'; // Adjust path
import KanjiGridItem from './KanjiGridItem';
import Spinner from './Spinner';
import ErrorDisplay from './ErrorDisplay';
import PaginationControls from './PaginationControls';

// --- Constants ---
const ITEMS_PER_PAGE = 20; // Adjust number of Kanji per page as needed

function KanjiGrid() {
    const { gradeId } = useParams();
    const { kanjiList, isLoading, error } = useKanjiList(gradeId);
    const { theme } = useContext(ThemeContext);
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const debounceTimeoutRef = useRef(null);
    const gridTopRef = useRef(null); // Ref to scroll to

    // Debounce search input
    useEffect(() => {
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = setTimeout(() => {
            setSearchTerm(inputValue);
            setCurrentPage(1); // Reset to page 1 on new search
        }, 300);
        return () => { if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); };
    }, [inputValue]);

    // Filter Kanji list
    const filteredKanjiList = useMemo(() => {
        if (!Array.isArray(kanjiList)) return [];
        if (!searchTerm) return kanjiList;
        const lowerSearchTerm = searchTerm.toLowerCase();
        return kanjiList.filter(k => k && k.toLowerCase().includes(lowerSearchTerm));
    }, [kanjiList, searchTerm]);

    // Calculate pagination variables
    const totalItems = filteredKanjiList.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Get Kanji for current page
    const paginatedKanjiList = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredKanjiList.slice(startIndex, endIndex);
    }, [filteredKanjiList, currentPage]);

    // Handle page changes & scroll to top of grid
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        gridTopRef.current?.scrollIntoView({ behavior: 'smooth' }); // Scroll smoothly to the ref
    };

    // --- Render Logic ---

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <Spinner size="lg" />
            <p className="mt-4 text-lg text-subtle-light dark:text-subtle-dark">Loading Grade {gradeId} Kanji...</p>
        </div>
    );

    if (error) return (
        <div className="mt-10">
            <ErrorDisplay message={error} context={`Grade ${gradeId} Kanji List`} />
        </div>
    );

    // Framer Motion variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.02, delayChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0, scale: 0.95 },
        visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 150, damping: 20 } }
    };

    return (
        // Add ref for scrolling target
        <div ref={gridTopRef} className="space-y-8">
            {/* Styled Title */}
            <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-heading font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary-neon to-secondary-neon filter drop-shadow-neon-cyan-sm"
            >
                Grade {gradeId} Kanji
            </motion.h2>

            {/* Styled Search Input */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative max-w-md mx-auto"> {/* Reduced max-width */}
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500 pointer-events-none"><Search size={20} /></span>
                <input
                    type="text"
                    placeholder="Search character..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    // Applying theme styles and focus states
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 ${
                        theme === 'light'
                        ? 'bg-white/70 border-slate-300/60 focus:border-primary-neon focus:ring-primary-neon/50 text-text-light placeholder-slate-400'
                        : 'bg-slate-800/50 border-slate-700/60 focus:border-primary-neon focus:ring-primary-neon/50 text-text-dark placeholder-slate-500'
                    } backdrop-blur-sm`} // Adjusted padding/border/focus
                />
            </motion.div>

            {/* Pagination Controls (Top) - Styled by its own component */}
             <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Animated Grid - Ensure correct number of columns */}
            {paginatedKanjiList && paginatedKanjiList.length > 0 ? (
                <motion.div
                    key={currentPage} // Re-trigger animation on page change
                    // Responsive columns (adjust counts as needed)
                    className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 md:gap-5" // Adjusted column count and gap
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {paginatedKanjiList.map((kanji) => (
                        <motion.div key={kanji} variants={itemVariants}>
                            {/* Ensure KanjiGridItem gets correct styling */}
                            <KanjiGridItem kanji={kanji} />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                // Styled "No Results" message
                <div className={`text-center text-lg italic py-16 px-6 rounded-lg mt-8 ${theme === 'light' ? 'text-slate-500 bg-slate-50/50 border border-slate-200/60' : 'text-slate-400 bg-slate-800/30 border border-slate-700/50'}`}>
                    {kanjiList && kanjiList.length > 0 ? 'No Kanji found matching your search.' : `No Kanji data loaded for Grade ${gradeId}.`}
                </div>
            )}

            {/* Pagination Controls (Bottom) */}
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

export default KanjiGrid;