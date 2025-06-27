import React from "react";
import PropTypes from "prop-types";

function KanjiExamples({ examples = [] }) {
  // Removed scroll logic as item count is limited by parent

  const handlePlayAudio = (audioData) => {
    // TODO: Implement audio playback logic here
    const audioSrc =
      audioData?.mp3 || audioData?.ogg || audioData?.aac || audioData?.opus;
    if (audioSrc) {
      console.log("Playing audio:", audioSrc);
      const audio = new Audio(audioSrc);
      audio.play().catch((e) => console.error("Audio playback failed:", e));
    } else {
      console.log("No audio source found for this example.");
    }
  };

  return (
    <>
      {examples && examples.length > 0 ? (
        // Use simple list styling with bottom borders
        // Removed max-h and overflow-y
        <div>
          <ul className="space-y-0">
            {" "}
            {/* Remove vertical space between li elements */}
            {examples.map((ex, index) => (
              <li
                key={ex.id}
                // Added bottom border, increased padding, removed hover/bg/rounded
                className={`py-2 ${
                  index < examples.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-base font-medium text-black">
                    {ex.japanese || "?"}
                  </span>
                  <button
                    onClick={() => handlePlayAudio(ex.audio)}
                    className="cursor-pointer text-gray-400 hover:text-blue-600 text-lg leading-none px-2 py-0 flex-shrink-0"
                    aria-label={`Play audio for ${ex.japanese}`}
                    title="Play audio"
                  >
                    ▷
                  </button>
                </div>
                <p className="text-sm text-gray-600 italic">
                  {ex.meaning || "?"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-center py-4 text-gray-500 italic">
          No examples available.
        </p>
      )}
    </>
  );
}

KanjiExamples.propTypes = {
  examples: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      japanese: PropTypes.string,
      meaning: PropTypes.string,
      audio: PropTypes.shape({
        opus: PropTypes.string,
        aac: PropTypes.string,
        ogg: PropTypes.string,
        mp3: PropTypes.string,
      }),
    })
  ),
};

export default KanjiExamples;
