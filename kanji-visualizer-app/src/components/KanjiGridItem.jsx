// KanjiGridItem.jsx
import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import VanillaTilt from "vanilla-tilt"; // Ensure installed
import Lottie from "lottie-react";

import CheckLottie from "../assets/animations/checkmark.json"; // Adjust path

// Tilt effect hook
function useTilt(options) {
  const ref = useRef(null);
  useEffect(() => {
    let tiltElement = ref.current;
    if (tiltElement && !tiltElement.vanillaTilt) {
      // Initialize only if not already initialized
      // Check if touch is supported, potentially disable tilt on touch devices
      // const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      // if (!isTouchDevice) { // Option: Only enable tilt on non-touch devices
      VanillaTilt.init(tiltElement, options);
      // }
    }
    return () => {
      if (tiltElement && tiltElement.vanillaTilt) {
        try {
          tiltElement.vanillaTilt.destroy();
        } catch (e) {
          /* ignore */
        }
      }
    };
  }, [options]); // Re-init if options change, ensure element exists
  return ref;
}

function KanjiGridItem({ kanji }) {
  const learned = false; // Default to false since we removed the progress context

  // Tilt effect configuration
  const tiltRef = useTilt({
    max: 15,
    perspective: 1000,
    scale: 1.03,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
    gyroscope: false,
  });

  // --- Styling ---
  // Added padding here directly, responsive text size
  const baseStyle = `group flex items-center justify-center aspect-square rounded-xl border-2 transition-all duration-300 ease-in-out shadow-lg backdrop-blur-sm relative overflow-hidden p-1`; // Added padding

  const themeStyle =
    "bg-white/30 border-slate-300/50 hover:bg-sky-50/50 hover:border-sky-300";

  const learnedStyle = "!bg-emerald-100/50 !border-emerald-400";

  // Adjusted checkmark size using Tailwind classes for responsiveness
  const checkmarkBaseSize = "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7"; // Responsive size classes

  return (
    // Apply tilt ref to the wrapper motion div
    <motion.div ref={tiltRef} className="relative h-full w-full" layout>
      <Link
        to={`/kanji/${encodeURIComponent(kanji)}`}
        className={`${baseStyle} ${themeStyle} ${learned ? learnedStyle : ""}`}
        title={learned ? `${kanji} (Learned)` : `View details for ${kanji}`}
      >
        {/* Kanji Character - RESPONSIVE FONT SIZE & LEADING */}
        <span
          className={`transition-transform duration-150 ease-in-out group-hover:scale-110 font-display leading-none
                            text-3xl sm:text-4xl md:text-5xl lg:text-6xl ${
                              /* Text color logic */ learned
                                ? "text-emerald-700"
                                : "text-slate-800"
                            }`}
        >
          {kanji}
        </span>

        {/* Learned Checkmark (Animated) - Using Tailwind classes */}
        {learned && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.1,
              type: "spring",
              stiffness: 350,
              damping: 15,
            }}
            // Position top-right, apply responsive size classes
            className={`absolute -top-1 -right-1 pointer-events-none ${checkmarkBaseSize}`}
            // Adjusted positioning slightly
          >
            {/* Pass className to Lottie if possible, otherwise wrap it */}
            {/* If Lottie doesn't accept className, wrap it: */}
            <div className="w-full h-full">
              <Lottie
                animationData={CheckLottie}
                loop={false}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            {/* Or if it accepts className: */}
            {/* <Lottie animationData={CheckLottie} loop={false} className="w-full h-full" /> */}
          </motion.div>
        )}
      </Link>
    </motion.div>
  );
}

KanjiGridItem.propTypes = {
  kanji: PropTypes.string.isRequired,
};

export default KanjiGridItem;
