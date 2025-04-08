import { useState, useEffect } from 'react';

// --- Environment Variables ---
// Ensure these are correctly set in your .env file
const KANJI_ALIVE_API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const KANJI_ALIVE_API_HOST = import.meta.env.VITE_RAPIDAPI_HOST;

function useKanjiDetails(character) {
    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Reset state when character changes or is null
        setDetails(null);
        setError(null);
        setIsLoading(true); // Set loading true initially

        if (!character) {
            // setError("No Kanji character provided."); // Optional: set error if needed
            setIsLoading(false); // Not loading if no character
            return;
        }

        if (!KANJI_ALIVE_API_KEY || !KANJI_ALIVE_API_HOST) {
            setError("API Key/Host configuration missing.");
            setIsLoading(false);
            return;
        }

        const decodedChar = decodeURIComponent(character);
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            // Reset state before fetch (redundant due to reset above, but safe)
            // setIsLoading(true);
            // setError(null);
            // setDetails(null);

            const url = `https://${KANJI_ALIVE_API_HOST}/api/public/kanji/${decodedChar}`;
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': KANJI_ALIVE_API_KEY,
                    'X-RapidAPI-Host': KANJI_ALIVE_API_HOST
                },
                signal
            };

            try {
                const response = await fetch(url, options);

                if (!response.ok) {
                    let errorMsg = `HTTP error ${response.status}`;
                    try {
                        const errorData = await response.json();
                        errorMsg += ` - ${errorData.message || 'Unknown API error'}`;
                    } catch (jsonError) { /* Ignore if response body is not JSON */ }
                    if (response.status === 404) {
                        errorMsg = `Details not found for Kanji '${decodedChar}'. It might not be covered by the API.`;
                    }
                    throw new Error(errorMsg);
                }

                const data = await response.json();

                // Check if the primary kanji data exists
                if (!data || !data.kanji) {
                     console.error("Unexpected API response format for Kanji details:", data);
                    throw new Error(`Details not found or in unexpected format for Kanji '${decodedChar}' via API.`);
                }

                // --- Transform data into a more usable structure ---
                // Includes fields previously missed or assumed unavailable
                const transformedDetails = {
                    // Core Kanji Info
                    character: data.kanji?.character,
                    meanings: data.kanji?.meaning?.english?.split(', ') || [],
                    strokes: data.kanji?.strokes?.count,

                    // Readings
                    readings_on: data.kanji?.onyomi?.katakana?.split('、').map(r => r.trim()).filter(Boolean) || [],
                    readings_kun: data.kanji?.kunyomi?.hiragana?.split('、').map(r => r.trim()).filter(Boolean) || [], // Using hiragana as per API example
                    // Optional: Add romaji if needed
                    // readings_on_romaji: data.kanji?.onyomi?.romaji,
                    // readings_kun_romaji: data.kanji?.kunyomi?.romaji,

                    // Radical Info
                    radical: data.radical?.character, // Might be special char
                    radical_image_url: data.radical?.image, // Use this SVG for display
                    radical_strokes: data.radical?.strokes,
                    radical_name: data.radical?.name?.hiragana, // Or romaji: data.radical?.name?.romaji
                    radical_meaning: data.radical?.meaning?.english,
                    radical_position: data.radical?.position?.hiragana, // Or romaji

                    // References
                    grade: data.references?.grade,
                    jlpt: data.references?.jlpt, // May not always be present
                    kodansha: data.references?.kodansha,
                    classic_nelson: data.references?.classic_nelson,

                    // Examples (including audio links)
                    examples: data.examples?.map((ex, index) => ({
                        id: `${decodedChar}-ex-${index}`, // Generate a unique ID
                        japanese: ex.japanese || '?',
                        meaning: ex.meaning?.english || '?',
                        audio: ex.audio || {}, // Include the full audio object (opus, aac, ogg, mp3)
                    })) || [],

                    // Stroke Order / Animation
                    strokeImages: data.kanji?.strokes?.images || [], // Array of SVG URLs for each stroke
                    strokeSvgUrl: data.kanji?.video?.poster, // Static SVG/image poster (usually last frame)
                    strokeMp4Url: data.kanji?.video?.mp4, // Animation video
                    strokeWebmUrl: data.kanji?.video?.webm, // Alternative video format

                    // Additional Info from API Root
                    hint: data.mn_hint, // Mnemonic hint (may contain HTML)
                    luminous_url: data.luminous, // URL for Luminous dictionary link
                };

                setDetails(transformedDetails);

            } catch (err) {
                 if (err.name !== 'AbortError') {
                    console.error(`Failed to fetch Kanji details for ${decodedChar}:`, err);
                    setError(err.message || `Failed to fetch details for ${decodedChar}.`);
                    // setDetails(null); // Ensure details are null on error (already handled by initial state)
                }
            } finally {
                 if (!signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        // Cleanup function
        return () => {
            controller.abort();
        };
    }, [character]); // Re-run effect when character changes

    return { details, isLoading, error };
}

export default useKanjiDetails;
