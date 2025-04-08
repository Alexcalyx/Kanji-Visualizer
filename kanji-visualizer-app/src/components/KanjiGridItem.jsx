import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import VanillaTilt from 'vanilla-tilt'; // Ensure installed: npm install vanilla-tilt
import Lottie from "lottie-react";

import { ProgressContext } from '../contexts/ProgressContext'; // Adjust path
import { ThemeContext } from '../contexts/ThemeContext'; // Adjust path
// Make sure you have a Lottie checkmark animation file
import CheckLottie from '../assets/animations/checkmark.json'; // Adjust path

// Tilt effect hook (optional helper, or implement directly)
function useTilt(options) {
    const ref = useRef(null);
    useEffect(() => {
        let tiltElement = null;
        if (ref.current) {
            VanillaTilt.init(ref.current, options);
            tiltElement = ref.current; // Store ref for cleanup
        }
        // Cleanup
        return () => {
            if (tiltElement && tiltElement.vanillaTilt) {
                 tiltElement.vanillaTilt.destroy();
            }
        };
    }, [options]); // Re-init if options change
    return ref;
}


function KanjiGridItem({ kanji }) {
  const { isLearned } = useContext(ProgressContext);
  const { theme } = useContext(ThemeContext);
  const learned = isLearned(kanji);

  // Tilt effect configuration
  const tiltRef = useTilt({
      max: 15,
      perspective: 1000,
      scale: 1.03, // Subtle scale
      speed: 400,
      glare: true,
      "max-glare": 0.2, // Subtle glare
      gyroscope: false,
  });

  // --- Styling based on "Kanji Genesis" Theme ---
  const baseStyle = `group flex items-center justify-center aspect-square text-5xl md:text-6xl rounded-xl border-2 transition-all duration-300 ease-in-out shadow-lg backdrop-blur-sm font-display relative overflow-hidden`; // Added relative/overflow for potential internal effects

  const themeStyle = theme === 'light'
      ? 'bg-white/30 border-slate-300/50 hover:bg-sky-50/50 hover:border-sky-300' // Lighter theme styles
      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/60 hover:border-primary-neon'; // Dark theme, hover with neon border

  // Style for learned items (overrides hover border)
  const learnedStyle = theme === 'light'
      ? '!bg-emerald-100/50 !border-emerald-400' // Use !important if needed to override base/hover
      : '!bg-emerald-800/30 !border-accent-neon !shadow-[0_0_8px_theme(colors.accent.neon)]'; // Neon lime border/shadow for learned

  // Style for the checkmark Lottie animation
  const learnedCheckStyle = { width: 28, height: 28 }; // Adjust size

  return (
    // Apply tilt ref to the motion div
    // Use layout prop for smooth size changes if grid adjusts
    <motion.div ref={tiltRef} className="relative h-full w-full" layout>
        <Link
            to={`/kanji/${encodeURIComponent(kanji)}`}
            // Combine base, theme-specific, and learned styles
            className={`${baseStyle} ${themeStyle} ${learned ? learnedStyle : ''}`}
            title={learned ? `${kanji} (Learned)` : `View details for ${kanji}`}
        >
          {/* Kanji Character Styling */}
          <span className={`transition-transform duration-150 ease-in-out group-hover:scale-110 ${learned ? (theme === 'light' ? 'text-emerald-700' : 'text-accent-neon') : (theme === 'light' ? 'text-slate-800': 'text-slate-100') }`}>
              {kanji}
          </span>

          {/* Learned Checkmark (Animated) */}
          {learned && (
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 350, damping: 15 }}
                className="absolute -top-1.5 -right-1.5" // Position top-right
                style={{ pointerEvents: 'none' }}
            >
                <Lottie animationData={CheckLottie} loop={false} style={learnedCheckStyle} />
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