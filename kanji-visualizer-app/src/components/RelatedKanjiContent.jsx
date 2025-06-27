// src/components/RelatedKanjiContent.jsx
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function RelatedKanjiContent({ relatedKanji }) {
  if (!relatedKanji || relatedKanji.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No related kanji found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">
        Related Kanji
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {relatedKanji.map((kanji, index) => (
          <motion.div
            key={kanji}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={`/kanji/${encodeURIComponent(kanji)}`}
              className="block p-4 text-center bg-white/30 border border-slate-300/50 rounded-lg hover:bg-cyan-50/50 hover:border-cyan-300 transition-colors"
            >
              <div className="text-2xl font-display text-slate-800">
                {kanji}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

RelatedKanjiContent.propTypes = {
  relatedKanji: PropTypes.arrayOf(PropTypes.string),
};

export default RelatedKanjiContent;
