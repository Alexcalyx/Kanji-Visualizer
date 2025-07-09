import { useState, useEffect } from "react";
import useCache from "./useCache";
import { fetchKanjiDetails } from "../utils/fetchKanjiDetails";

const KANJI_ALIVE_API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const KANJI_ALIVE_API_HOST = import.meta.env.VITE_RAPIDAPI_HOST;

function useKanjiDetails(character) {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const { getCached, setCached, CACHE_CONFIG } = useCache();

  useEffect(() => {
    // Reset state when character changes or is null
    setDetails(null);
    setError(null);
    setIsLoading(true);
    setIsFromCache(false);

    if (!character) {
      setIsLoading(false);
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
      // Check cache first
      const cachedData = getCached(
        "kanji_details",
        decodedChar,
        CACHE_CONFIG.TTL.KANJI_DETAILS
      );

      if (cachedData) {
        console.log(`📦 Using cached details for Kanji ${decodedChar}`);
        setDetails(cachedData);
        setIsLoading(false);
        setIsFromCache(true);
        return;
      }

      console.log(`🌐 Fetching details for Kanji ${decodedChar} from API`);
      const url = `https://${KANJI_ALIVE_API_HOST}/api/public/kanji/${decodedChar}`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": KANJI_ALIVE_API_KEY,
          "X-RapidAPI-Host": KANJI_ALIVE_API_HOST,
        },
        signal,
      };

      try {
        const transformedDetails = await fetchKanjiDetails(decodedChar);
        setCached(
          "kanji_details",
          decodedChar,
          transformedDetails,
          CACHE_CONFIG.TTL.KANJI_DETAILS
        );
        setDetails(transformedDetails);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(
            `Failed to fetch Kanji details for ${decodedChar}:`,
            err
          );
          setError(
            err.message || `Failed to fetch details for ${decodedChar}.`
          );
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
  }, [character, getCached, setCached, CACHE_CONFIG.TTL.KANJI_DETAILS]); // Re-run effect when character changes

  return { details, isLoading, error, isFromCache };
}

export default useKanjiDetails;
