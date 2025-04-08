// src/components/KanjiGraphContent.jsx
import React, { useRef, useMemo, useCallback, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import ForceGraph2D from 'react-force-graph-2d';
import Spinner from './Spinner'; // Import Spinner
import { ThemeContext } from '../contexts/ThemeContext'; // Adjust path if needed

function KanjiGraphContent({ character, details }) { // details might contain relationship data
    const navigate = useNavigate();
    const fgRef = useRef();
    const containerRef = useRef(); // Ref for container dimensions
    const { theme } = useContext(ThemeContext);

    // Memoize graph data based on details (adapt when real data is available)
    const graphData = useMemo(() => {
        const nodes = [];
        const links = [];

        if (character) {
            nodes.push({
                id: character,
                name: character,
                val: 10, // Size of the main node
                isCenter: true,
            });
        }

        // Placeholder: Extract related data from 'details' when available
        // Example: If details.related is an array of Kanji strings
        const relatedKanji = details?.related || []; // Assume related is an array in details
        relatedKanji.forEach(relChar => {
            if (relChar !== character) { // Avoid self-links for now
                nodes.push({ id: relChar, name: relChar, val: 5 }); // Smaller nodes
                links.push({ source: character, target: relChar });
            }
        });

        return { nodes, links };
    }, [character, details]); // Recompute if character or details change

    const handleNodeClick = useCallback((node) => {
        // Only navigate if clicking a related node (not the center one)
        if (node.id && node.id !== character) {
            navigate(`/kanji/${encodeURIComponent(node.id)}`);
        }
    }, [navigate, character]);

    // Custom node rendering with theme awareness
    const renderNode = useCallback((node, ctx, globalScale) => {
        const label = node.name || '';
        const fontSize = 14 / globalScale; // Adjust base font size
        ctx.font = `bold ${fontSize}px "Noto Sans JP", sans-serif`; // Use a clear font

        const radius = Math.max((node.val || 1) * 0.8 / globalScale, 3 / globalScale); // Adjust sizing logic

        // Node background circle (slightly larger for padding)
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 4 / globalScale, 0, 2 * Math.PI, false);
        ctx.fillStyle = node.isCenter
            ? (theme === 'light' ? 'rgba(219, 39, 119, 0.2)' : 'rgba(255, 0, 255, 0.2)') // Highlight center node (Magenta)
            : (theme === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(30, 41, 59, 0.7)'); // Default background
        ctx.fill();

        // Optional: Node border
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
        ctx.strokeStyle = node.isCenter
            ? (theme === 'light' ? 'rgb(219, 39, 119)' : '#ff00ff') // Magenta border for center
            : (theme === 'light' ? 'rgba(6, 182, 212, 0.8)' : '#00f0ff'); // Cyan border for others
        ctx.lineWidth = 1 / globalScale;
        ctx.stroke();


        // Node text
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = theme === 'light' ? '#1f2937' : '#e5e7eb'; // text-light / text-dark
        ctx.fillText(label, node.x, node.y);

        // Store background dimensions for interaction layer
        node.__bckgDimensions = [(radius + 4 / globalScale) * 2, (radius + 4 / globalScale) * 2];

    }, [theme, character]); // Dependency: theme, character (to identify center)


    // Zoom to fit after engine stops
    const handleEngineStop = useCallback(() => {
        if (fgRef.current) {
            fgRef.current.zoomToFit(400, 100); // Adjust padding
        }
    }, []);

    // Handle resizing
    const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
    useEffect(() => {
        if (containerRef.current) {
             const resizeObserver = new ResizeObserver(entries => {
                if (entries[0]) {
                    const { width, height } = entries[0].contentRect;
                    setDimensions({ width, height });
                }
            });
            resizeObserver.observe(containerRef.current);
            // Initial dimensions
            setDimensions({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight });
            return () => resizeObserver.disconnect();
        }
    }, []);


    return (
        // Use ref to get container dimensions for the graph
        <div ref={containerRef} className="w-full h-64 md:h-80 relative">
            {/* Show spinner if details are loading */}
            {!details && (
                <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 backdrop-filter backdrop-blur-sm z-10">
                    <Spinner size="md" />
                </div>
            )}

            {/* Render graph only if details are loaded and nodes exist */}
            {details && graphData.nodes.length > 0 && dimensions.width > 0 && (
                <div className={`absolute inset-0 border rounded-lg overflow-hidden ${
                    theme === 'light' ? 'border-border-light' : 'border-border-dark'
                }`}>
                    <ForceGraph2D
                        ref={fgRef}
                        width={dimensions.width}
                        height={dimensions.height}
                        graphData={graphData}
                        nodeLabel="name" // Tooltip label
                        nodeVal="val" // Use 'val' for relative node size
                        nodeRelSize={1} // Base multiplier for node size
                        nodeCanvasObject={renderNode}
                        nodeCanvasObjectMode={() => 'after'} // Draw text after background
                        linkWidth={1} // Link thickness
                        linkColor={() => theme === 'light' ? 'rgba(100, 116, 139, 0.4)' : 'rgba(100, 116, 139, 0.6)'} // Subtle link color
                        linkDirectionalParticles={1} // Add particle animation to links
                        linkDirectionalParticleWidth={2}
                        linkDirectionalParticleColor={() => theme === 'light' ? '#06b6d4' : '#00f0ff'} // Cyan particles
                        onNodeClick={handleNodeClick}
                        cooldownTicks={50} // Let the simulation run a bit longer
                        onEngineStop={handleEngineStop}
                        enableZoomInteraction={true}
                        enablePanInteraction={true}
                    />
                </div>
            ) }

            {/* Placeholder text if no nodes (even after loading) */}
            {details && graphData.nodes.length === 0 && (
                 <div className="flex items-center justify-center h-full text-subtle-light dark:text-subtle-dark">
                     No relationship data available.
                 </div>
            )}

             {/* Info text */}
            {details && (
                <div className="absolute bottom-1 left-2 text-[10px] text-subtle-light dark:text-subtle-dark italic opacity-80">
                    (Graph shows related Kanji based on available data)
                </div>
            )}
        </div>
    );
}

KanjiGraphContent.propTypes = {
    character: PropTypes.string, // The main Kanji character being displayed
    details: PropTypes.object,   // The full details object which might contain relationship info
    // theme prop removed, using context instead
};

export default KanjiGraphContent;