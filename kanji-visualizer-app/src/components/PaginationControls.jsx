// src/components/PaginationControls.jsx (Modified for spacing using margin)
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext'; // Adjust path

function PaginationControls({ currentPage, totalPages, onPageChange }) {
    const { theme } = useContext(ThemeContext);

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const buttonBase = `px-3 py-1.5 rounded-lg transition-all duration-200 shadow-md border flex items-center justify-center text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:translate-y-0 transform hover:-translate-y-0.5`;
    const buttonStyle = theme === 'light'
        ? 'bg-white/70 border-slate-300/70 hover:bg-sky-50/80 text-slate-700 disabled:bg-slate-100 disabled:text-slate-400'
        : 'bg-slate-700/70 border-slate-600/70 hover:bg-slate-600/90 text-slate-200 disabled:bg-slate-800 disabled:text-slate-500';
    const iconColor = theme === 'light' ? 'text-slate-600' : 'text-slate-300';

    if (totalPages <= 1) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            // --- MODIFIED: Removed space-x, now relies on margin on the span ---
            className="flex items-center justify-center"
            // --- END MODIFICATION ---
            aria-label="Pagination"
        >
            <motion.button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`${buttonBase} ${buttonStyle}`}
                whileHover={{ scale: currentPage > 1 ? 1.05 : 1 }}
                whileTap={{ scale: currentPage > 1 ? 0.95 : 1 }}
                aria-label="Previous page"
            >
                <ChevronLeft size={18} className={iconColor} />
                <span className="ml-1 hidden sm:inline">Prev</span>
            </motion.button>

            {/* --- MODIFIED: Added horizontal margin (mx-6) --- */}
            <span className={`text-sm font-medium mx-6 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
            {/* --- END MODIFICATION --- */}
                      Page {currentPage} of {totalPages}
            </span>

            <motion.button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`${buttonBase} ${buttonStyle}`}
                whileHover={{ scale: currentPage < totalPages ? 1.05 : 1 }}
                whileTap={{ scale: currentPage < totalPages ? 0.95 : 1 }}
                aria-label="Next page"
            >
                 <span className="mr-1 hidden sm:inline">Next</span>
                <ChevronRight size={18} className={iconColor} />
            </motion.button>
        </motion.div>
    );
}

PaginationControls.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default PaginationControls;