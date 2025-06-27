// src/components/kanji/KanjiGraph.jsx
import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

function KanjiGraph({ kanjiData }) {
  if (!kanjiData) {
    return (
      <div className="text-center py-8 text-slate-500">
        No graph data available.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/30 border border-slate-300/50 rounded-xl p-6 shadow-lg backdrop-blur-sm"
    >
      <h3 className="text-xl font-semibold text-slate-800 mb-4">Kanji Graph</h3>
      <div className="text-slate-700">
        <p>Graph visualization would be displayed here.</p>
        <p className="text-sm text-slate-500 mt-2">
          This feature requires additional implementation for graph rendering.
        </p>
      </div>
    </motion.div>
  );
}

KanjiGraph.propTypes = {
  kanjiData: PropTypes.object,
};

export default KanjiGraph;
