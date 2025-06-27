import React from "react";
import { motion } from "framer-motion";
import { Database } from "lucide-react";

function CacheIndicator({ isFromCache, className = "" }) {
  if (!isFromCache) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium ${className}`}
      title="Data loaded from cache"
    >
      <Database size={12} />
      <span>Cached</span>
    </motion.div>
  );
}

export default CacheIndicator;
