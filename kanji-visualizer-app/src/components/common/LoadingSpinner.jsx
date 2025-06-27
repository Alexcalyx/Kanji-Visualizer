// src/components/common/LoadingSpinner.jsx
import React from "react";
import LottieSpinner from "./LottieSpinner";

function LoadingSpinner() {
  return (
    // Ensure it takes up significant space while loading routes
    <div className="flex justify-center items-center min-h-[70vh]">
      <LottieSpinner size="lg" />
    </div>
  );
}

export default LoadingSpinner;
