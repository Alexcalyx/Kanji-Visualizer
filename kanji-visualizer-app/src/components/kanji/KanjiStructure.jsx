import React from "react";
import PropTypes from "prop-types";

function KanjiStructure({
  strokes,
  radical,
  radicalMeaning,
  grade,
  jlpt,
  frequency,
}) {
  // Determine the best way to display the radical
  const radicalDisplay = radical_image_url ? (
    <img
      src={radical_image_url}
      alt={radical_name || "Radical"}
      className="h-10 w-10 object-contain" // Adjusted size
      onError={(e) => {
        // Handle image loading errors
        e.target.onerror = null;
        // Optionally replace with fallback character if image fails
        e.target.outerHTML = `<span class="text-4xl font-medium">${
          radical || "?"
        }</span>`;
      }}
    />
  ) : (
    // Fallback to character if no image URL
    <span className="text-4xl font-medium">{radical || "?"}</span>
  );

  return (
    <div className="space-y-1">
      {" "}
      {/* Reduced spacing */}
      {/* Radical Info */}
      {radical || radical_image_url ? (
        <div className="flex items-center gap-3">
          {/* Display radical image or character */}
          {radicalDisplay}
          {/* Display name, meaning, and strokes */}
          <div className="flex flex-col text-sm">
            <span className="font-medium text-black">
              {radical_name || "N/A"}
            </span>
            <span className="text-xs text-gray-600">
              {radical_meaning || "N/A"}
            </span>
            {radical_strokes && (
              <span className="text-xs text-gray-500">
                ({radical_strokes} strokes)
              </span>
            )}
            {/* Optionally add position: <span className="text-xs text-gray-500">Position: {radical_position || 'N/A'}</span> */}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">
          Radical info not available.
        </p>
      )}
      {/* "Components" section removed */}
    </div>
  );
}

KanjiStructure.propTypes = {
  strokes: PropTypes.number,
  radical: PropTypes.string,
  radicalMeaning: PropTypes.string,
  grade: PropTypes.string,
  jlpt: PropTypes.string,
  frequency: PropTypes.number,
};

export default KanjiStructure;
