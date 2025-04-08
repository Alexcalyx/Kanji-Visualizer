// src/components/KanjiInfo.jsx
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from '../contexts/ThemeContext'; // Adjust path if needed

// Receives the full transformed details object from useKanjiDetails
function KanjiInfo({ details }) {
    const { theme } = useContext(ThemeContext);

    // Use slightly less prominent background/border than main cards
    const containerStyle = `p-3 rounded-lg shadow-sm w-full max-w-xs ${
        theme === 'light'
            ? 'bg-slate-50/70 border border-slate-200/30'
            : 'bg-slate-700/50 border border-slate-600/30'
    }`;

    // Label style
    const labelStyle = "font-medium text-subtle-light dark:text-subtle-dark w-16 inline-block flex-shrink-0 mr-2";

    // Value style
    const valueStyle = theme === 'light' ? 'text-text-light' : 'text-text-dark';

    return (
        <div className={containerStyle}>
            {/* Increased vertical spacing between info items */}
            <div className="text-xs sm:text-sm space-y-1.5">
                {/* Use flex for better alignment */}
                <p className="flex items-baseline">
                    <strong className={labelStyle}>Grade:</strong>
                    <span className={valueStyle}>{details?.grade ?? 'N/A'}</span>
                </p>
                <p className="flex items-baseline">
                    <strong className={labelStyle}>JLPT:</strong>
                    {/* Handle potentially missing JLPT level */}
                    <span className={valueStyle}>{details?.jlpt ? `N${details.jlpt}` : 'N/A'}</span>
                </p>
                <p className="flex items-baseline">
                    <strong className={labelStyle}>Strokes:</strong>
                    <span className={valueStyle}>{details?.strokes ?? 'N/A'}</span>
                </p>
            </div>
        </div>
    );
}

KanjiInfo.propTypes = {
    // Expects the transformed details object
    details: PropTypes.shape({
        grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        jlpt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        strokes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        // Include other expected properties if needed for validation
    }).isRequired,
};

export default KanjiInfo;