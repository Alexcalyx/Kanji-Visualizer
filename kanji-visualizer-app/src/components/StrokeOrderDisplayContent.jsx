import React from 'react';
import PropTypes from 'prop-types';
import Spinner from './Spinner'; // Assuming Spinner component exists

function StrokeOrderDisplayContent({
    character,
    strokeSvgUrl, // Poster image (usually last frame)
    strokeMp4Url, // Video animation
    strokeImages // Array of individual stroke SVGs (available for custom diagram)
}) {
    // Determine loading state - check if essential media URLs are missing while character is present
    const isLoading = character && !strokeMp4Url && !strokeSvgUrl;
    const hasVideo = !!strokeMp4Url;
    const hasPoster = !!strokeSvgUrl; // Use poster even if video exists

    const displayContent = () => {
        if (!character) {
             // Don't show spinner if no character is selected yet
             return <p className="text-sm text-center text-gray-400">No Kanji selected.</p>;
        }
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-full">
                    <Spinner size="md" />
                </div>
            );
        }
        if (hasVideo) {
            return (
                <video
                    key={strokeMp4Url} // Force re-render if URL changes
                    controls
                    poster={strokeSvgUrl || ''} // Use SVG as poster
                    className="w-full max-w-[250px] h-auto object-contain rounded border border-gray-200 bg-white shadow-sm" // Simplified styling
                    preload="metadata"
                    aria-label={`Stroke order video for ${character}`}
                >
                    <source src={strokeMp4Url} type="video/mp4" />
                    {/* Optionally add WebM source if available */}
                    {/* <source src={details.strokeWebmUrl} type="video/webm" /> */}
                    Your browser does not support the video tag.
                </video>
            );
        }
        // Fallback to poster image if no video
        if (hasPoster) {
            return (
                <img
                    src={strokeSvgUrl}
                    alt={`Stroke order diagram for ${character}`}
                    className="w-full max-w-[250px] h-auto object-contain"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        // Optionally display a placeholder text
                         const errorText = document.createElement('p');
                         errorText.className = 'text-sm text-center text-red-500';
                         errorText.textContent = 'Failed to load stroke diagram.';
                         e.target.parentNode.appendChild(errorText);
                    }}
                />
            );
        }
        // Message if neither video nor poster is available
        return (
            <p className="text-sm text-center text-gray-500">
                Stroke media not available for {character}.
            </p>
        );
    };

    return (
        // Container ensures consistent size
        <div className="flex flex-col items-center justify-center w-full min-h-[250px]">
            {displayContent()}
            {/* Comment: The strokeImages array is available in props if needed */}
            {/* to implement a custom stroke-by-stroke diagram display. */}
            {/* Example: {strokeImages && <p className="text-xs text-gray-400">{strokeImages.length} stroke SVGs available.</p>} */}
        </div>
    );
}

StrokeOrderDisplayContent.propTypes = {
    character: PropTypes.string,
    strokeSvgUrl: PropTypes.string, // Poster image URL
    strokeMp4Url: PropTypes.string, // Video URL
    strokeImages: PropTypes.arrayOf(PropTypes.string), // Array of individual stroke SVG URLs
};

export default StrokeOrderDisplayContent;
