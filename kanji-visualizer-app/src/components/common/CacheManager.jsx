import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, RefreshCw, Info } from "lucide-react";
import useCache from "../../hooks/useCache";

function CacheManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [cacheStats, setCacheStats] = useState({
    memorySize: 0,
    storageSize: 0,
  });
  const [isClearing, setIsClearing] = useState(false);

  const { getCacheStats, clearAllCache, CACHE_CONFIG } = useCache();

  // Update cache stats
  const updateStats = () => {
    const stats = getCacheStats();
    setCacheStats(stats);
  };

  // Clear all cache
  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      clearAllCache();
      updateStats();
      console.log("🗑️ Cache cleared successfully");
    } catch (error) {
      console.error("Failed to clear cache:", error);
    } finally {
      setIsClearing(false);
    }
  };

  // Update stats when component mounts and when cache changes
  useEffect(() => {
    updateStats();

    // Update stats periodically
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTTL = (ttl) => {
    const hours = Math.floor(ttl / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    return days > 0
      ? `${days} day${days > 1 ? "s" : ""}`
      : `${hours} hour${hours > 1 ? "s" : ""}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Cache Stats Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Cache Manager"
      >
        <Info size={20} />
      </motion.button>

      {/* Cache Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Cache Manager
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {/* Cache Statistics */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Memory Cache:</span>
                  <span className="text-sm font-medium">
                    {cacheStats.memorySize} items
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Storage Cache:</span>
                  <span className="text-sm font-medium">
                    {cacheStats.storageSize} items
                  </span>
                </div>
              </div>

              {/* TTL Information */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Cache Duration:
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>
                    • Kanji Lists: {formatTTL(CACHE_CONFIG.TTL.KANJI_LIST)}
                  </div>
                  <div>
                    • Kanji Details: {formatTTL(CACHE_CONFIG.TTL.KANJI_DETAILS)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={updateStats}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
                <button
                  onClick={handleClearCache}
                  disabled={isClearing}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {isClearing ? "Clearing..." : "Clear All"}
                </button>
              </div>

              {/* Info */}
              <div className="text-xs text-gray-500 text-center">
                Cache improves performance and reduces API calls
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CacheManager;
