import { useState, useEffect, useCallback } from "react";
import useCache from "./useCache";

// Kanji Alive API endpoints
const KANJI_ALIVE_API_URL = "https://kanjialive-api.p.rapidapi.com/api/public";
const KANJI_ALIVE_API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const KANJI_ALIVE_API_HOST = import.meta.env.VITE_RAPIDAPI_HOST;

export const useKanjiSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getCache, setCache } = useCache();

  // Search using Kanji Alive API
  const searchKanji = useCallback(
    async (term) => {
      if (!term.trim()) {
        setResults([]);
        return;
      }

      const cacheKey = `kanji_search_${term}`;
      const cached = getCache(cacheKey);

      if (cached) {
        setResults(cached);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Use advanced search endpoint
        const response = await fetch(
          `${KANJI_ALIVE_API_URL}/search/advanced?q=${encodeURIComponent(
            term
          )}`,
          {
            headers: {
              "X-RapidAPI-Key": KANJI_ALIVE_API_KEY,
              "X-RapidAPI-Host": KANJI_ALIVE_API_HOST,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Process and filter results
        const processedResults = data
          .filter((item) => item.kanji && item.kanji.character)
          .map((item) => ({
            character: item.kanji.character,
            stroke_count: item.kanji.strokes?.count || null,
            radicals: item.radical || null,
            meanings: [], // Will be fetched separately
            readings_on: [], // Will be fetched separately
            readings_kun: [], // Will be fetched separately
            grade: item.references?.grade || null,
            jlpt: item.references?.jlpt || null,
            source: "kanji_alive",
          }))
          .slice(0, 8); // Limit to 8 results

        setCache(cacheKey, processedResults);
        setResults(processedResults);
      } catch (err) {
        console.error("Search error:", err);
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [getCache, setCache]
  );

  // Get detailed kanji info from Kanji Alive API
  const getKanjiDetails = useCallback(
    async (character) => {
      const cacheKey = `kanji_details_${character}`;
      const cached = getCache(cacheKey);

      if (cached) {
        return cached;
      }

      try {
        const response = await fetch(
          `${KANJI_ALIVE_API_URL}/kanji/${encodeURIComponent(character)}`,
          {
            headers: {
              "X-RapidAPI-Key": KANJI_ALIVE_API_KEY,
              "X-RapidAPI-Host": KANJI_ALIVE_API_HOST,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        const details = {
          character: data.kanji.character,
          stroke_count: data.kanji.strokes.count,
          radicals: data.radical,
          meanings: data.kanji.meaning.english || [],
          readings_on: data.kanji.onyomi?.katakana || [],
          readings_kun: data.kanji.kunyomi?.hiragana || [],
          grade: data.references?.grade || null,
          jlpt: data.references?.jlpt || null,
          source: "kanji_alive",
        };

        setCache(cacheKey, details);
        return details;
      } catch (err) {
        console.error("Details fetch error:", err);
        return null;
      }
    },
    [getCache, setCache]
  );

  // Enhanced search that tries multiple approaches
  const enhancedSearch = useCallback(
    async (term) => {
      if (!term.trim()) {
        setResults([]);
        return;
      }

      const cacheKey = `enhanced_search_${term}`;
      const cached = getCache(cacheKey);

      if (cached) {
        setResults(cached);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let searchResults = [];

        // First, try direct kanji character search
        if (/^[\u4e00-\u9faf]$/.test(term)) {
          const response = await fetch(
            `${KANJI_ALIVE_API_URL}/kanji/${encodeURIComponent(term)}`,
            {
              headers: {
                "X-RapidAPI-Key": KANJI_ALIVE_API_KEY,
                "X-RapidAPI-Host": KANJI_ALIVE_API_HOST,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            searchResults.push({
              character: data.kanji.character,
              stroke_count: data.kanji.strokes.count,
              radicals: data.radical,
              meanings: data.kanji.meaning.english || [],
              readings_on: data.kanji.onyomi?.katakana || [],
              readings_kun: data.kanji.kunyomi?.hiragana || [],
              grade: data.references?.grade || null,
              jlpt: data.references?.jlpt || null,
              source: "kanji_alive",
            });
          }
        } else {
          // For readings and meanings, use advanced search
          const response = await fetch(
            `${KANJI_ALIVE_API_URL}/search/advanced?q=${encodeURIComponent(
              term
            )}`,
            {
              headers: {
                "X-RapidAPI-Key": KANJI_ALIVE_API_KEY,
                "X-RapidAPI-Host": KANJI_ALIVE_API_HOST,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();

            // Get detailed info for each result
            const detailedResults = [];
            for (const item of data.slice(0, 5)) {
              // Limit to 5 for performance
              if (item.kanji && item.kanji.character) {
                const details = await getKanjiDetails(item.kanji.character);
                if (details) {
                  detailedResults.push(details);
                }
              }
            }

            searchResults = detailedResults;
          }
        }

        // Filter and rank results based on search term
        const rankedResults = searchResults
          .filter((result) => {
            const termLower = term.toLowerCase();

            // Check character match
            if (result.character === term) return true;

            // Check readings match
            const allReadings = [
              ...(result.readings_on || []),
              ...(result.readings_kun || []),
            ];
            if (
              allReadings.some((reading) =>
                reading.toLowerCase().includes(termLower)
              )
            )
              return true;

            // Check meanings match
            const meanings = result.meanings || [];
            if (
              meanings.some((meaning) =>
                meaning.toLowerCase().includes(termLower)
              )
            )
              return true;

            return false;
          })
          .slice(0, 8);

        setCache(cacheKey, rankedResults);
        setResults(rankedResults);
      } catch (err) {
        console.error("Enhanced search error:", err);
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [getCache, setCache, getKanjiDetails]
  );

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      enhancedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, enhancedSearch]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    error,
    getKanjiDetails,
    clearResults: () => {
      setResults([]);
      setError(null);
    },
  };
};
