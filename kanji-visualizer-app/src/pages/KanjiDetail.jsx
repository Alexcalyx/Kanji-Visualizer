import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import useKanjiDetails from "../hooks/useKanjiDetails"; // Adjust path if needed
// import { Spinner } from '../components/ui';
import { ErrorDisplay, LoadingSpinner } from "../components/common";
import { KanjiExamples } from "../components/kanji";

// Helper component to safely render HTML strings
const RenderHtml = ({ htmlString }) => {
  if (!htmlString) return null;
  return <span dangerouslySetInnerHTML={{ __html: htmlString }} />;
};

// Simple component to display labeled data
const InfoItem = ({ label, children }) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-500 mb-1">{label}</h3>
    {/* Increased base text size slightly for better readability */}
    <div className="text-base md:text-lg font-medium text-black">
      {children || "N/A"}
    </div>
  </div>
);

function KanjiDetail() {
  const { character } = useParams();
  const {
    details,
    isLoading: detailsLoading,
    error: detailsError,
  } = useKanjiDetails(character);
  const videoRef = useRef(null);

  // --- Loading, Error, No Data States (Keep As Is) ---
  if (detailsLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
        {" "}
        {/* Loading... */}{" "}
      </div>
    );
  if (detailsError)
    return (
      <div className="mt-10">
        <ErrorDisplay
          message={detailsError}
          context={`Kanji Details for ${character}`}
        />{" "}
        Error loading details.{" "}
      </div>
    ); // Simplified error display placeholder
  if (!details || !details.character)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-xl p-10 text-gray-600 font-sans"
      >
        {" "}
        No valid details available for '{decodeURIComponent(
          character || ""
        )}'.{" "}
      </motion.div>
    );

  // --- Click Handler for Video ---
  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const limitedExamples = details.examples?.slice(0, 5) || [];

  // --- Main Component ---
  return (
    // Adjusted padding for different screen sizes
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto font-sans text-gray-800 bg-white">
      {/* --- Row 1: Main Details Grid --- */}
      {/*
                RESPONSIVE GRID:
                - Default (Mobile): 1 column stacks all children vertically.
                - Medium screens (md: 768px+): 2 columns. We will manually assign elements using col-span.
                - Large screens (lg: 1024px+): 4 columns as originally designed.
                - Adjusted vertical gap for mobile vs larger screens.
            */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 md:gap-y-8 mb-8 items-start">
        {/* SECTION 1: Kanji Animation (Takes first column on MD and LG) */}
        {/* On Mobile, this is the first block */}
        {/* On MD, this takes the full first column (md:col-span-1) */}
        {/* On LG, this is the first column (lg:col-span-1) */}
        {/* SECTION 1: Kanji Animation */}
        {/* SECTION 1: Kanji Animation */}
        <div className="space-y-2 flex flex-col md:col-span-1 lg:col-span-1">
          <h3 className="text-sm font-semibold text-gray-500 mb-1">
            Kanji Animation
          </h3>
          {/* Container for the video/image - applies centering logic */}
          {/* Mobile: justify-center, MD+: justify-start */}
          <div className="flex items-center justify-center md:justify-start w-full">
            {details.strokeMp4Url ? (
              <video
                ref={videoRef}
                key={details.strokeMp4Url}
                poster={details.strokeSvgUrl || ""}
                // *** SIZE CHANGE HERE ***
                // Mobile: w-32 h-32 (128px)
                // Large screens: lg:w-52 lg:h-52 (208px)
                className="transition duration-200 hover:border-primary-neon hover:shadow-lg hover:shadow-primary-neon/30 object-contain rounded border border-gray-200 bg-white shadow-sm w-32 h-32 lg:w-52 lg:h-52 cursor-pointer"
                preload="metadata"
                aria-label={`Stroke order video for ${details.character}`}
                muted
                playsInline
                onClick={handleVideoClick}
              >
                <source src={details.strokeMp4Url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : details.strokeSvgUrl ? (
              <img
                src={details.strokeSvgUrl}
                alt={`Kanji diagram for ${details.character}`}
                // *** SIZE CHANGE HERE ***
                // Mobile: w-32 h-32 (128px)
                // Large screens: lg:w-52 lg:h-52 (208px)
                className="object-contain rounded border border-gray-200 bg-white shadow-sm w-32 h-32 lg:w-52 lg:h-52"
              />
            ) : (
              // Match placeholder size responsively
              <div className="w-32 h-32 lg:w-52 lg:h-52 flex items-center justify-center border rounded bg-gray-50 text-gray-400 text-xs">
                N/A
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: Meaning, Readings, Radical */}
        {/* On Mobile, this is the second block */}
        {/* On MD, this takes the full second column (md:col-span-1) */}
        {/* On LG, this is the second column (lg:col-span-1) */}
        <div className="space-y-4 md:col-span-1 lg:col-span-1">
          <InfoItem label="Meaning">{details.meanings?.join(", ")}</InfoItem>
          <InfoItem label="On'yomi">
            {details.readings_on?.join("、 ")}
          </InfoItem>
          <InfoItem label="Kun'yomi">
            {details.readings_kun?.join("、 ")}
          </InfoItem>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-1">
              Radical
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-medium w-6 text-center flex-shrink-0">
                {details.radical || "?"}
              </span>
              <span className="text-sm text-gray-600">
                {details.radical_meaning || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3: Strokes, Grade, Hint */}
        {/* On Mobile, this is the third block */}
        {/* On MD, this STARTS the second 'row' in the 2-col layout, taking the first column. */}
        {/* On LG, this is the third column (lg:col-span-1) */}
        <div className="space-y-4 md:col-span-1 lg:col-span-1">
          <InfoItem label="Strokes">{details.strokes}</InfoItem>
          <InfoItem label="Grade">{details.grade}</InfoItem>
          {details.hint && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-1">Hint</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                {" "}
                {/* Slightly larger hint text */}
                <RenderHtml htmlString={details.hint} />
              </p>
            </div>
          )}
        </div>

        {/* SECTION 4: Examples */}
        {/* On Mobile, this is the fourth block */}
        {/* On MD, this takes the second column in the second 'row'. */}
        {/* On LG, this is the fourth column (lg:col-span-1) */}
        <div className="space-y-2 md:col-span-1 lg:col-span-1">
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Examples</h3>
          <KanjiExamples examples={limitedExamples} />
        </div>
      </div>{" "}
      {/* End of Main Details Grid */}
      {/* --- Row 2: Stroke Sequence --- */}
      {/* Added top margin for separation */}
      <div className="border-t pt-6 mt-8">
        <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-3">
          Stroke Sequence
        </h3>
        {details.strokeImages && details.strokeImages.length > 0 ? (
          // This responsive grid should adapt well already.
          <div className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-1 p-1 sm:p-2">
            {" "}
            {/* Adjusted padding */}
            {details.strokeImages.map((imgUrl, index) => (
              <div
                key={index}
                // Ensure consistent size for touch targets
                className="h-12 w-12 sm:h-14 sm:w-14 border bg-white rounded-sm overflow-hidden flex items-center justify-center shadow-sm"
                title={`Stroke ${index + 1}`}
              >
                <img
                  src={imgUrl}
                  alt={`Stroke ${index + 1}`}
                  className="object-contain max-w-full max-h-full"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.closest("div").style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Stroke images not available.
          </p>
        )}
      </div>{" "}
      {/* End of Stroke Sequence */}
    </div> // End of main container
  );
}

export default KanjiDetail;
