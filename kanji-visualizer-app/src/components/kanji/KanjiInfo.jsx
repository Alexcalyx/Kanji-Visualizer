// src/components/KanjiInfo.jsx
import React from "react";
import PropTypes from "prop-types";

function KanjiInfo({ kanji, readings, meanings }) {
  return (
    <div className="bg-white/30 border border-slate-300/50 rounded-xl p-6 shadow-lg backdrop-blur-sm">
      <div className="text-center mb-6">
        <div className="text-8xl font-display text-slate-800 mb-4">{kanji}</div>
      </div>

      {readings && readings.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-slate-800">
            Readings
          </h3>
          <div className="space-y-2">
            {readings.map((reading, index) => (
              <div key={index} className="text-slate-700">
                <span className="font-medium">{reading.type}:</span>{" "}
                {reading.reading}
              </div>
            ))}
          </div>
        </div>
      )}

      {meanings && meanings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-slate-800">
            Meanings
          </h3>
          <div className="text-slate-700">{meanings.join(", ")}</div>
        </div>
      )}
    </div>
  );
}

KanjiInfo.propTypes = {
  kanji: PropTypes.string.isRequired,
  readings: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      reading: PropTypes.string.isRequired,
    })
  ),
  meanings: PropTypes.arrayOf(PropTypes.string),
};

export default KanjiInfo;
