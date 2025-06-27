import React from "react";
import PropTypes from "prop-types";
import { XCircle } from "lucide-react";

function ErrorDisplay({ message, context }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-red-50 border border-red-200 text-red-800">
      <XCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold mb-2">Error Loading {context}</h3>
      <p className="text-center text-red-700">{message}</p>
    </div>
  );
}

ErrorDisplay.propTypes = {
  message: PropTypes.string.isRequired,
  context: PropTypes.string.isRequired,
};

export default ErrorDisplay;
