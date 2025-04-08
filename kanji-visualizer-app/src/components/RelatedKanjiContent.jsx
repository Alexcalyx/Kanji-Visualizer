// src/components/RelatedKanjiContent.jsx
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext'; // Adjust path if needed

function RelatedKanjiContent({ related = [] }) { // Default related to empty array
    const { theme } = useContext(ThemeContext);

    // Basic styling for placeholder/content
    const textStyle = "text-sm text-subtle-light dark:text-subtle-dark italic";
    const linkStyle = `px-2 py-1 rounded text-sm mr-2 mb-1 inline-block transition-colors ${
        theme === 'light'
            ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
    }`;

    return (
        <div className="min-h-[3rem] flex flex-wrap items-start gap-x-2 gap-y-1">
            {/* Check if related array exists and has items */}
            {related && related.length > 0 ? (
                related.map((kanji) => (
                    <Link
                        key={kanji}
                        to={`/kanji/${encodeURIComponent(kanji)}`}
                        className={linkStyle}
                    >
                        {kanji}
                    </Link>
                ))
            ) : (
                <p className={textStyle}>
                    (Relationship data source needed or none found)
                </p>
            )}
        </div>
    );
}

RelatedKanjiContent.propTypes = {
    related: PropTypes.arrayOf(PropTypes.string),
    // theme prop removed, using context instead
};

export default RelatedKanjiContent;