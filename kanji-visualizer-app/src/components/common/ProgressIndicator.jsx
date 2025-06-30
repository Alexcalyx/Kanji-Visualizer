import React from "react";
import PropTypes from "prop-types";

function ProgressIndicator({ total, learned }) {
  const percent = total > 0 ? Math.round((learned / total) * 100) : 0;
  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-slate-700">Progress</span>
        <span className="text-xs text-slate-500">
          {learned} / {total} ({percent}%)
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-purple-500 h-3 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

ProgressIndicator.propTypes = {
  total: PropTypes.number.isRequired,
  learned: PropTypes.number.isRequired,
};

export default ProgressIndicator;
