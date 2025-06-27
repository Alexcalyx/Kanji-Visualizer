import React, { useEffect } from "react";

// Try to use canvas-confetti if available, otherwise fallback to SVG
let confetti;
try {
  confetti = require("canvas-confetti");
} catch (e) {
  confetti = null;
}

function ConfettiBurst({ trigger }) {
  useEffect(() => {
    if (trigger && confetti) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [trigger]);

  // Fallback: SVG burst (static)
  if (!confetti && trigger) {
    return (
      <svg width="120" height="60" className="mx-auto my-4 animate-pulse">
        <circle cx="60" cy="30" r="20" fill="#06b6d4" opacity="0.3" />
        <circle cx="40" cy="20" r="5" fill="#facc15" />
        <circle cx="80" cy="40" r="6" fill="#f472b6" />
        <circle cx="90" cy="15" r="4" fill="#34d399" />
        <circle cx="30" cy="45" r="4" fill="#818cf8" />
      </svg>
    );
  }
  return null;
}

export default ConfettiBurst;
