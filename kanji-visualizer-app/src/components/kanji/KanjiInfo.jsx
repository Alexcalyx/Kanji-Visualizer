// src/components/KanjiInfo.jsx
import React from "react";
import PropTypes from "prop-types";

// Simple component to display labeled data
const InfoItem = ({ label, children }) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-500 mb-1">{label}</h3>
    <div className="text-base md:text-lg font-medium text-black">
      {children || "N/A"}
    </div>
  </div>
);

function KanjiInfo({
  meanings,
  readings_on,
  readings_kun,
  radical,
  radical_meaning,
  strokes,
  grade,
  hint,
}) {
  return (
    <div className="space-y-4 md:col-span-1 lg:col-span-1">
      <InfoItem label="Meaning">{meanings?.join(", ")}</InfoItem>
      <InfoItem label="On'yomi">{readings_on?.join("、 ")}</InfoItem>
      <InfoItem label="Kun'yomi">{readings_kun?.join("、 ")}</InfoItem>
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-1">Radical</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-medium w-6 text-center flex-shrink-0">
            {radical || "?"}
          </span>
          <span className="text-sm text-gray-600">
            {radical_meaning || "N/A"}
          </span>
        </div>
      </div>
      <InfoItem label="Strokes">{strokes}</InfoItem>
      <InfoItem label="Grade">{grade}</InfoItem>
      {hint && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Hint</h3>
          <p className="text-base text-gray-700 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: hint }} />
          </p>
        </div>
      )}
    </div>
  );
}

KanjiInfo.propTypes = {
  meanings: PropTypes.arrayOf(PropTypes.string),
  readings_on: PropTypes.arrayOf(PropTypes.string),
  readings_kun: PropTypes.arrayOf(PropTypes.string),
  radical: PropTypes.string,
  radical_meaning: PropTypes.string,
  strokes: PropTypes.number,
  grade: PropTypes.string,
  hint: PropTypes.string,
};

export default KanjiInfo;
