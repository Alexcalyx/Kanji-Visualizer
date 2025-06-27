// src/components/AnimatedInfoCard.jsx
import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

function AnimatedInfoCard({ title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/30 border border-slate-300/50 rounded-xl p-6 shadow-lg backdrop-blur-sm"
    >
      {title && (
        <h3 className="text-xl font-semibold mb-4 text-slate-800">{title}</h3>
      )}
      <div className="text-slate-700">{children}</div>
    </motion.div>
  );
}

AnimatedInfoCard.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  delay: PropTypes.number,
};

export default AnimatedInfoCard;
