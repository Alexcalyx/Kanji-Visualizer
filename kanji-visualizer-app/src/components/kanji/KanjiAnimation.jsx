import React, { useRef } from "react";
import PropTypes from "prop-types";
import { responsive } from "../../utils/styles";

function KanjiAnimation({ strokeMp4Url, strokeSvgUrl, character }) {
  const videoRef = useRef(null);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div className="space-y-2 flex flex-col md:col-span-1 lg:col-span-1">
      <h3 className="text-sm font-semibold text-gray-500 mb-1">
        Kanji Animation
      </h3>
      <div className="flex items-center justify-center md:justify-start w-full">
        {strokeMp4Url ? (
          <video
            ref={videoRef}
            key={strokeMp4Url}
            poster={strokeSvgUrl || ""}
            className={`transition duration-200 hover:border-primary-neon hover:shadow-lg hover:shadow-primary-neon/30 object-contain rounded border border-gray-200 bg-white shadow-sm ${responsive.sizing.kanji} cursor-pointer`}
            preload="metadata"
            aria-label={`Stroke order video for ${character}`}
            muted
            playsInline
            onClick={handleVideoClick}
          >
            <source src={strokeMp4Url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : strokeSvgUrl ? (
          <img
            src={strokeSvgUrl}
            alt={`Kanji diagram for ${character}`}
            className={`object-contain rounded border border-gray-200 bg-white shadow-sm ${responsive.sizing.kanji}`}
          />
        ) : (
          <div
            className={`${responsive.sizing.kanji} flex items-center justify-center border rounded bg-gray-50 text-gray-400 text-xs`}
          >
            N/A
          </div>
        )}
      </div>
    </div>
  );
}

KanjiAnimation.propTypes = {
  strokeMp4Url: PropTypes.string,
  strokeSvgUrl: PropTypes.string,
  character: PropTypes.string.isRequired,
};

export default KanjiAnimation;
