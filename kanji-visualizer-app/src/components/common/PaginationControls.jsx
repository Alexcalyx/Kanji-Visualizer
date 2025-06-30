// src/components/PaginationControls.jsx (Modified for spacing using margin)
import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

function PaginationControls({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-slate-600 hover:text-primary-neon hover:bg-purple-500/10"
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      {/* Page Numbers */}
      <div className="flex space-x-1">
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-slate-500">...</span>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-purple-100 text-primary-dark font-semibold"
                    : "text-slate-600 hover:text-primary-neon hover:bg-purple-500/10"
                }`}
              >
                {page}
              </motion.button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-slate-600 hover:text-primary-neon hover:bg-purple-500/10"
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

PaginationControls.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default PaginationControls;
