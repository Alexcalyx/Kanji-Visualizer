import { useState, useEffect } from 'react';

// --- Environment Variables ---
const KANJI_ALIVE_API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const KANJI_ALIVE_API_HOST = import.meta.env.VITE_RAPIDAPI_HOST;

function useKanjiList(gradeId) {
    const [kanjiList, setKanjiList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const gradeNumber = parseInt(gradeId, 10);
        if (!gradeId || isNaN(gradeNumber) || gradeNumber < 1 || gradeNumber > 6) {
            setKanjiList([]);
            setError(isNaN(gradeNumber) ? `Invalid grade: ${gradeId}` : null);
            setIsLoading(false);
            return;
        }

        if (!KANJI_ALIVE_API_KEY || !KANJI_ALIVE_API_HOST) {
            setError("API Key/Host configuration missing in environment variables.");
            setKanjiList([]);
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;
        const gradeParam = `grade=${gradeNumber}`;

        const fetchGradeData = async () => {
            setIsLoading(true);
            setError(null);
            setKanjiList([]); // Clear previous list
            const url = `https://${KANJI_ALIVE_API_HOST}/api/public/search/advanced?${gradeParam}`;
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': KANJI_ALIVE_API_KEY,
                    'X-RapidAPI-Host': KANJI_ALIVE_API_HOST
                },
                signal
            };

            try {
                // Simulate network delay if needed for testing loading states
                // await new Promise(resolve => setTimeout(resolve, 500));

                const response = await fetch(url, options);

                if (!response.ok) {
                    let errorMsg = `HTTP error ${response.status}`;
                    try {
                        const errorData = await response.json();
                        errorMsg += ` - ${errorData.message || 'Unknown API error'}`;
                    } catch (jsonError) {
                        // Ignore if response body is not JSON
                    }
                    throw new Error(errorMsg);
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    const list = data.map(item => item?.kanji?.character).filter(Boolean);
                    setKanjiList(list);
                } else {
                    console.error("Unexpected API response format for grade list:", data);
                    throw new Error(`Unexpected API format received for Grade ${gradeId}.`);
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error(`Failed to fetch Kanji list for Grade ${gradeId}:`, err);
                    setError(err.message || `Failed to fetch Kanji list for Grade ${gradeId}.`);
                    setKanjiList([]); // Ensure list is empty on error
                }
            } finally {
                // Only set loading to false if the request wasn't aborted
                if (!signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchGradeData();

        // Cleanup function to abort fetch if component unmounts or gradeId changes
        return () => {
            controller.abort();
        };
    }, [gradeId]); // Re-run effect when gradeId changes

    return { kanjiList, isLoading, error };
}

export default useKanjiList;