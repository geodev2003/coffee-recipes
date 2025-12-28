import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

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
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            {/* Previous Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                    currentPage === 1
                        ? 'text-coffee-400 cursor-not-allowed'
                        : 'text-coffee-900 hover:bg-forest-800/10'
                }`}
            >
                <ChevronLeft size={20} />
            </motion.button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="px-3 py-2 text-coffee-600">
                                ...
                            </span>
                        );
                    }

                    return (
                        <motion.button
                            key={page}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onPageChange(page)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                currentPage === page
                                    ? 'bg-gradient-forest text-white shadow-lg'
                                    : 'text-coffee-900 hover:bg-forest-800/10'
                            }`}
                        >
                            {page}
                        </motion.button>
                    );
                })}
            </div>

            {/* Next Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                        ? 'text-coffee-400 cursor-not-allowed'
                        : 'text-coffee-900 hover:bg-forest-800/10'
                }`}
            >
                <ChevronRight size={20} />
            </motion.button>
        </div>
    );
};

export default Pagination;

