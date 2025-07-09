import { useCallback, useRef } from "react";

// Cache configuration
const CACHE_CONFIG = {
  // Time-to-live in milliseconds
  TTL: {
    KANJI_LIST: 24 * 60 * 60 * 1000, // 24 hours for kanji lists
    KANJI_DETAILS: 7 * 24 * 60 * 60 * 1000, // 7 days for kanji details
  },
  // Storage keys
  STORAGE_KEYS: {
    KANJI_LIST: "kanji_visualizer_kanji_list",
    KANJI_DETAILS: "kanji_visualizer_kanji_details",
  },
};

// In-memory cache
const memoryCache = new Map();

function useCache() {
  const cacheRef = useRef(memoryCache);

  // Get cache key for different data types
  const getCacheKey = useCallback((type, identifier) => {
    return `${type}_${identifier}`;
  }, []);

  // Check if data is expired
  const isExpired = useCallback((timestamp, ttl) => {
    return Date.now() - timestamp > ttl;
  }, []);

  // Get from memory cache
  const getFromMemory = useCallback(
    (key) => {
      const cached = cacheRef.current.get(key);
      if (!cached) return null;

      if (isExpired(cached.timestamp, cached.ttl)) {
        cacheRef.current.delete(key);
        return null;
      }

      return cached.data;
    },
    [isExpired]
  );

  // Set in memory cache
  const setInMemory = useCallback((key, data, ttl) => {
    cacheRef.current.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }, []);

  // Get from localStorage
  const getFromStorage = useCallback(
    (key) => {
      try {
        const stored = localStorage.getItem(key);
        if (!stored) return null;

        const cached = JSON.parse(stored);
        if (isExpired(cached.timestamp, cached.ttl)) {
          localStorage.removeItem(key);
          return null;
        }

        return cached.data;
      } catch (error) {
        console.warn("Failed to read from localStorage:", error);
        return null;
      }
    },
    [isExpired]
  );

  // Set in localStorage
  const setInStorage = useCallback((key, data, ttl) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn("Failed to write to localStorage:", error);
    }
  }, []);

  const getCached = useCallback(
    (type, identifier, ttl) => {
      const key = getCacheKey(type, identifier);

      // Try memory cache first
      let data = getFromMemory(key);
      if (data) return data;

      // Try localStorage
      data = getFromStorage(key);
      if (data) {
        // Store in memory for faster access
        setInMemory(key, data, ttl);
        return data;
      }

      return null;
    },
    [getCacheKey, getFromMemory, getFromStorage, setInMemory]
  );

  const setCached = useCallback(
    (type, identifier, data, ttl) => {
      const key = getCacheKey(type, identifier);
      setInMemory(key, data, ttl);
      setInStorage(key, data, ttl);
    },
    [getCacheKey, setInMemory, setInStorage]
  );

  // Clear specific cache entry
  const clearCache = useCallback(
    (type, identifier) => {
      const key = getCacheKey(type, identifier);
      cacheRef.current.delete(key);
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn("Failed to clear localStorage:", error);
      }
    },
    [getCacheKey]
  );

  // Clear all cache
  const clearAllCache = useCallback(() => {
    cacheRef.current.clear();
    try {
      // Clear only our cache keys
      Object.values(CACHE_CONFIG.STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.warn("Failed to clear localStorage:", error);
    }
  }, []);

  // Get cache statistics
  const getCacheStats = useCallback(() => {
    const memorySize = cacheRef.current.size;
    let storageSize = 0;

    try {
      Object.values(CACHE_CONFIG.STORAGE_KEYS).forEach((key) => {
        if (localStorage.getItem(key)) storageSize++;
      });
    } catch (error) {
      console.warn("Failed to get storage stats:", error);
    }

    return { memorySize, storageSize };
  }, []);

  return {
    getCached,
    setCached,
    clearCache,
    clearAllCache,
    getCacheStats,
    CACHE_CONFIG,
  };
}

export default useCache;
