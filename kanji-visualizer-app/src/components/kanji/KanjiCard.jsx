import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import VanillaTilt from "vanilla-tilt";
import Lottie from "lottie-react";
import { useStudyProgress } from "../../contexts/StudyProgressContext";
import CheckLottie from "../../assets/animations/checkmark.json";

function useTilt(options) {
  const ref = useRef(null);
  useEffect(() => {
    let tiltElement = ref.current;
    if (tiltElement && !tiltElement.vanillaTilt) {
      VanillaTilt.init(tiltElement, options);
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
  }, [options]);
  return ref;
}

function KanjiCard({ kanji, grade }) {
  const { isKanjiLearned } = useStudyProgress();
  const learned = isKanjiLearned(kanji, grade);

  const tiltRef = useTilt({
    max: 15,
    perspective: 1000,
    scale: 1.03,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
    gyroscope: false,
  });

  const baseStyle = `group flex items-center justify-center aspect-square rounded-xl border-2 transition-all duration-300 ease-in-out shadow-lg backdrop-blur-sm relative overflow-hidden p-1`;
  const themeStyle =
    "bg-white/30 border-slate-300/50 hover:bg-sky-50/50 hover:border-sky-300";
  const learnedStyle = "!bg-purple-100/50 !border-purple-400";
  const checkmarkBaseSize = "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7";

  return (
    <motion.div ref={tiltRef} className="relative h-full w-full" layout>
      <Link
        to={`/kanji/${encodeURIComponent(kanji)}`}
        className={`${baseStyle} ${themeStyle} ${learned ? learnedStyle : ""}`}
        title={learned ? `${kanji} (Learned)` : `View details for ${kanji}`}
      >
        <span
          className={`transition-transform duration-150 ease-in-out group-hover:scale-110 font-display leading-none
                            text-3xl sm:text-4xl md:text-5xl lg:text-6xl ${
                              learned ? "text-purple-700" : "text-slate-800"
                            }`}
        >
          {kanji}
        </span>
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
            className={`absolute -top-1 -right-1 pointer-events-none ${checkmarkBaseSize}`}
          >
            <div className="w-full h-full">
              <Lottie
                animationData={CheckLottie}
                loop={false}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </motion.div>
        )}
      </Link>
    </motion.div>
  );
}

KanjiCard.propTypes = {
  kanji: PropTypes.string.isRequired,
  grade: PropTypes.string.isRequired,
};

export default KanjiCard;
