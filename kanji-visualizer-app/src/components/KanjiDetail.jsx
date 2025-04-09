import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import useKanjiDetails from '../hooks/useKanjiDetails'; // Adjust path if needed
import Spinner from './Spinner'; // Adjust path if needed
import ErrorDisplay from './ErrorDisplay'; // Adjust path if needed
// Removed ReadingsContent import
import ExampleWordListContent from './ExampleWordListContent'; // Use updated version, adjust path if needed

// Helper component to safely render HTML strings from the API (hint)
const RenderHtml = ({ htmlString }) => {
    if (!htmlString) return null;
    // WARNING: Only use dangerouslySetInnerHTML with trusted content sources.
    return <span dangerouslySetInnerHTML={{ __html: htmlString }} />;
};

// Simple component to display labeled data consistently
const InfoItem = ({ label, children }) => (
    <div>
        {/* Label for the information item */}
        <h3 className="text-sm font-semibold text-gray-500 mb-1">{label}</h3>
        {/* Content area for the information */}
        <div className="text-base font-medium text-black">{children || 'N/A'}</div>
    </div>
);


function KanjiDetailReplicaFinalLayout() {
    // Get character from URL parameters
    const { character } = useParams();
    // Fetch data using the custom hook
    const { details, isLoading: detailsLoading, error: detailsError } = useKanjiDetails(character);

    // --- Loading State ---
    if (detailsLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
            {/* <Spinner size="lg" /> */}
            <p className="mt-4 text-lg font-sans">Loading Kanji Details...</p>
        </div>
    );

    // --- Error State ---
    if (detailsError) return (
        <div className="mt-10">
            <ErrorDisplay message={detailsError} context={`Kanji Details for ${character}`} />
        </div>
    );

    // --- No Data State ---
    // Handles cases where hook returns null details or API response is unexpected
    if (!details || !details.character) return (
        <motion.div
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             className="text-center text-xl p-10 text-gray-600 font-sans"
        >
             No valid details available for '{decodeURIComponent(character || '')}'.
        </motion.div>
    );

    // Limit examples to prevent scrolling on the main page
    const limitedExamples = details.examples?.slice(0, 5) || [];

    // --- Main Component ---
    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto font-sans text-gray-800 bg-white">

            {/* --- Row 1: Contains the 4 Columns --- */}
            {/* Grid layout, 4 columns on medium+ screens, aligned to top */}
            <div className="grid grid-cols-4 gap-x-8 gap-y-6 mb-8 items-start">

                {/* Col 1: Kanji Video */}
                <div className="space-y-2 flex flex-col">
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Kanji Animation</h3>
                    {/* Container to center the video/image */}
                    <div className="flex items-center justify-start">
                        {details.strokeMp4Url ? (
                            // Display video if available
                            <video
                                key={details.strokeMp4Url}
                                controls
                                poster={details.strokeSvgUrl || ''} // Use SVG as poster
                                className="w-full h-auto object-contain rounded border border-gray-200 bg-white shadow-sm max-w-[250px] aspect-square"
                                preload="metadata"
                                aria-label={`Stroke order video for ${details.character}`}
                            >
                                <source src={details.strokeMp4Url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : details.strokeSvgUrl ? (
                             // Fallback to SVG poster image if no video
                             <img
                                src={details.strokeSvgUrl}
                                alt={`Kanji diagram for ${details.character}`}
                                className="w-full h-auto object-contain rounded border border-gray-200 bg-white shadow-sm max-w-[250px] aspect-square"
                             />
                        ): (
                            // Placeholder if neither video nor image is available
                            <div className="w-full max-w-[250px] aspect-square flex items-center justify-center border rounded bg-gray-50 text-gray-400">
                                Video/Image N/A
                            </div>
                        )}
                    </div>
                </div>

                {/* Col 2: Meaning, Readings, Radical */}
                <div className="space-y-4"> {/* Consistent spacing */}
                    {/* Meaning */}
                    <InfoItem label="Meaning">
                        {details.meanings?.join(', ')}
                    </InfoItem>

                    {/* Display Onyomi directly */}
                    <InfoItem label="On'yomi">
                         {details.readings_on?.join('、 ')} {/* Use Japanese comma */}
                    </InfoItem>

                    {/* Display Kunyomi directly */}
                     <InfoItem label="Kun'yomi">
                         {details.readings_kun?.join('、 ')} {/* Use Japanese comma */}
                    </InfoItem>

                     {/* Radical Info */}
                     <div>
                         <h3 className="text-sm font-semibold text-gray-500 mb-1">Radical</h3>
                         <div className="flex items-center gap-2">
                            {(
                                // Radical Character (fallback)
                                <span className="text-2xl font-medium w-6 text-center flex-shrink-0">{details.radical || '?'}</span>
                            )}
                             {/* Radical Meaning */}
                             <span className="text-sm text-gray-600">{details.radical_meaning || 'N/A'}</span>
                         </div>
                     </div>
                </div>

                {/* Col 3: Strokes, Grade, Hint */}
                <div className="space-y-4"> {/* Consistent spacing */}
                    {/* Strokes */}
                    <InfoItem label="Strokes">
                        {details.strokes}
                    </InfoItem>
                    {/* Grade */}
                    <InfoItem label="Grade">
                        {details.grade}
                    </InfoItem>
                    {/* Hint (using RenderHtml for potential HTML content) */}
                    {details.hint && (
                         <div>
                             <h3 className="text-sm font-semibold text-gray-500 mb-1">Hint</h3>
                             <p className="text-sm text-gray-700 leading-relaxed">
                                 <RenderHtml htmlString={details.hint} />
                             </p>
                         </div>
                     )}
                </div>

                {/* Col 4: Examples */}
                <div className="space-y-2">
                     <h3 className="text-sm font-semibold text-gray-500 mb-1">Examples</h3>
                     {/* Use updated ExampleWordListContent */}
                     <ExampleWordListContent examples={limitedExamples} />
                </div>

            </div> {/* End of Row 1 Grid */}

            {/* --- Row 2: Stroke Sequence --- */}
            <div className="border-t pt-6">
                <h3 className="text-base font-semibold text-gray-700 mb-3">Stroke Sequence</h3>
                {details.strokeImages && details.strokeImages.length > 0 ? (
                    // Responsive grid for stroke images
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-1 p-2 bg-gray-50">
                        {details.strokeImages.map((imgUrl, index) => (
                            // Wrapper div controls size and overflow
                            <div
                                key={index}
                                className="h-12 w-12 border bg-white rounded-sm overflow-hidden flex items-center justify-center"
                                title={`Stroke ${index + 1}`}
                            >
                                {/* Image fills the wrapper */}
                                <img
                                    src={imgUrl}
                                    alt={`Stroke ${index + 1}`}
                                    className="object-contain max-w-full max-h-full"
                                    loading="lazy"
                                    onError={(e) => {
                                        // Hide wrapper if image fails to load
                                        e.currentTarget.closest('div').style.display='none';
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    // Message if no stroke images are available
                    <p className="text-sm text-gray-500 italic">Stroke images not available.</p>
                )}
            </div> {/* End of Row 2 */}

        </div>
    );
}

export default KanjiDetailReplicaFinalLayout;
