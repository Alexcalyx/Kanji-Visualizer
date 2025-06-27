const KANJI_ALIVE_API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const KANJI_ALIVE_API_HOST = import.meta.env.VITE_RAPIDAPI_HOST;

export async function fetchKanjiDetails(character) {
  if (!KANJI_ALIVE_API_KEY || !KANJI_ALIVE_API_HOST) {
    throw new Error("API Key/Host configuration missing.");
  }
  const decodedChar = decodeURIComponent(character);
  const url = `https://${KANJI_ALIVE_API_HOST}/api/public/kanji/${decodedChar}`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": KANJI_ALIVE_API_KEY,
      "X-RapidAPI-Host": KANJI_ALIVE_API_HOST,
    },
  };
  const response = await fetch(url, options);
  if (!response.ok) {
    let errorMsg = `HTTP error ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg += ` - ${errorData.message || "Unknown API error"}`;
    } catch (jsonError) {}
    if (response.status === 404) {
      errorMsg = `Details not found for Kanji '${decodedChar}'. It might not be covered by the API.`;
    }
    throw new Error(errorMsg);
  }
  const data = await response.json();
  if (!data || !data.kanji) {
    throw new Error(
      `Details not found or in unexpected format for Kanji '${decodedChar}' via API.`
    );
  }
  // Transform as in useKanjiDetails
  return {
    character: data.kanji?.character,
    meanings: data.kanji?.meaning?.english?.split(", ") || [],
    strokes: data.kanji?.strokes?.count,
    readings_on:
      data.kanji?.onyomi?.katakana
        ?.split("、")
        .map((r) => r.trim())
        .filter(Boolean) || [],
    readings_kun:
      data.kanji?.kunyomi?.hiragana
        ?.split("、")
        .map((r) => r.trim())
        .filter(Boolean) || [],
    radical: data.radical?.character,
    radical_image_url: data.radical?.image,
    radical_strokes: data.radical?.strokes,
    radical_name: data.radical?.name?.hiragana,
    radical_meaning: data.radical?.meaning?.english,
    radical_position: data.radical?.position?.hiragana,
    grade: data.references?.grade,
    jlpt: data.references?.jlpt,
    kodansha: data.references?.kodansha,
    classic_nelson: data.references?.classic_nelson,
    examples:
      data.examples?.map((ex, index) => ({
        id: `${decodedChar}-ex-${index}`,
        japanese: ex.japanese || "?",
        meaning: ex.meaning?.english || "?",
        audio: ex.audio || {},
      })) || [],
    strokeImages: data.kanji?.strokes?.images || [],
    strokeSvgUrl: data.kanji?.video?.poster,
    strokeMp4Url: data.kanji?.video?.mp4,
    strokeWebmUrl: data.kanji?.video?.webm,
    hint: data.mn_hint,
    luminous_url: data.luminous,
  };
}
