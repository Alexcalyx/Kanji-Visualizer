import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

import { ThemeContext } from '../contexts/ThemeContext'; // Adjust path
import useKanjiList from '../hooks/useKanjiList'; // Adjust path
import KanjiGridItem from './KanjiGridItem';
import Spinner from './Spinner';
import ErrorDisplay from './ErrorDisplay';
import PaginationControls from './PaginationControls'; // Uses updated version

// --- Constants ---
const ITEMS_PER_PAGE = 40;

function KanjiGrid() {
    const { gradeId } = useParams();
    const { kanjiList, isLoading, error } = useKanjiList(gradeId);
    const { theme } = useContext(ThemeContext);
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const debounceTimeoutRef = useRef(null);
    const gridTopRef = useRef(null);

    // ... (useEffect for debounce, useMemo for filtering/pagination remain the same) ...
    useEffect(() => {
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = setTimeout(() => {
            setSearchTerm(inputValue);
            setCurrentPage(1);
        }, 300);
        return () => { if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); };
    }, [inputValue]);

    const filteredKanjiList = useMemo(() => {
        if (!Array.isArray(kanjiList)) return [];
        if (!searchTerm) return kanjiList;
        const lowerSearchTerm = searchTerm.toLowerCase();
        return kanjiList.filter(k => k && k.toLowerCase().includes(lowerSearchTerm));
    }, [kanjiList, searchTerm]);

    const totalItems = filteredKanjiList.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const paginatedKanjiList = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredKanjiList.slice(startIndex, endIndex);
    }, [filteredKanjiList, currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        gridTopRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // --- Render Logic ---
    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
            {/* <Spinner size="lg" /> */}
            <p className="mt-4 text-lg text-subtle-light dark:text-subtle-dark">Loading Grade {gradeId} Kanji...</p>
        </div>
    );

    if (error) return (
        <div className="mt-10">
            <ErrorDisplay message={error} context={`Grade ${gradeId} Kanji List`} />
        </div>
    );

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.02, delayChildren: 0.1 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0, scale: 0.95 }, visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 150, damping: 20 } } };

    const getGradeDescription = (id) => {
        const gradeMap = {
            '1': 'Grade 1 (小学校１年生)',
            '2': 'Grade 2 (小学校２年生)',
            '3': 'Grade 3 (小学校３年生)',
            '4': 'Grade 4 (小学校４年生)',
            '5': 'Grade 5 (小学校５年生)',
            '6': 'Grade 6 (小学校６年生)',
        };
        return gradeMap[id] || `Grade ${id}`;
    }

    return (
        <div ref={gridTopRef} className="space-y-12"> {/* Parent spacing */}
            {/* Styled Title */}
            <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-heading font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary-neon to-secondary-neon filter drop-shadow-neon-cyan-sm"
            >
                Kanji List
            </motion.h2>

            {/* --- MODIFIED: Grade Description Text Size & Margin --- */}
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className={`text-center text-3xl md:text-4xl ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`} // Increased text size, removed negative margin
            >
                {getGradeDescription(gradeId)}
            </motion.p>
            {/* --- END MODIFICATION --- */}

            {/* Pagination Controls (Top) */}
             <PaginationControls
                 currentPage={currentPage}
                 totalPages={totalPages}
                 onPageChange={handlePageChange}
            />

            {/* Animated Grid */}
            {paginatedKanjiList && paginatedKanjiList.length > 0 ? (
                <motion.div
                    key={currentPage}
                    className="grid grid-cols-8 gap-5 md:gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {paginatedKanjiList.map((kanji) => (
                        <motion.div key={kanji} variants={itemVariants} className="p-1 md:p-2">
                            <KanjiGridItem kanji={kanji} />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className={`text-center text-lg italic py-16 px-6 rounded-lg ${theme === 'light' ? 'text-slate-500 bg-slate-50/50 border border-slate-200/60' : 'text-slate-400 bg-slate-800/30 border border-slate-700/50'}`}>
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