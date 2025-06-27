import React from "react";
import PropTypes from "prop-types";

function LevelSelector({ selectedLevel, onLevelChange }) {
  const levels = [
    { value: "all", label: "All Levels" },
    { value: "jlpt-n5", label: "JLPT N5" },
    { value: "jlpt-n4", label: "JLPT N4" },
    { value: "jlpt-n3", label: "JLPT N3" },
    { value: "jlpt-n2", label: "JLPT N2" },
    { value: "jlpt-n1", label: "JLPT N1" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {levels.map((level) => (
        <button
          key={level.value}
          onClick={() => onLevelChange(level.value)}
          className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            selectedLevel === level.value
              ? "bg-cyan-100 text-primary-dark font-semibold"
              : "text-slate-600 hover:text-primary-neon hover:bg-cyan-500/10"
          }`}
        >
          {level.label}
        </button>
      ))}
    </div>
  );
}

LevelSelector.propTypes = {
  selectedLevel: PropTypes.string.isRequired,
  onLevelChange: PropTypes.func.isRequired,
};

export default LevelSelector;
