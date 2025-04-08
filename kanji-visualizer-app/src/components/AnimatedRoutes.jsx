// src/components/AnimatedRoutes.jsx
import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
// Make sure motion and AnimatePresence are imported
import { AnimatePresence, motion } from 'framer-motion';

// --- Lazy load page components ---
// Ensure paths are correct relative to this file
const HomePage = React.lazy(() => import('./HomePage'));
const KanjiGrid = React.lazy(() => import('./KanjiGrid'));
const KanjiDetail = React.lazy(() => import('./KanjiDetail'));
const ErrorDisplay = React.lazy(() => import('./ErrorDisplay'));
import SimpleLoader from './SimpleLoader'; // Fallback component

function AnimatedRoutes() {
    const location = useLocation(); // Get location for AnimatePresence key

    // --- Animation Settings ---
    const pageVariants = {
        // Initial state (before entering)
        initial: { opacity: 0, y: 15, scale: 0.99 },
        // State when component is mounted and animated in
        in: { opacity: 1, y: 0, scale: 1 },
        // State when component is unmounting (animating out)
        out: { opacity: 0, y: -15, scale: 1.01 }
    };

    const pageTransition = {
        type: "tween", // Smooth interpolation
        ease: "anticipate", // Adds a slight anticipation effect
        duration: 0.5 // Animation duration
    };

    return (
        // Suspense provides fallback while lazy components load
        <Suspense fallback={<SimpleLoader />}>
            {/* AnimatePresence handles enter/exit animations */}
            {/* 'mode="wait"' ensures exit animation finishes before enter starts */}
            <AnimatePresence mode='wait'>
                {/* Routes component needs location and key for AnimatePresence */}
                <Routes location={location} key={location.pathname}>
                    {/* --- Index Route ('/') --- */}
                    <Route
                        index // Matches the root path '/'
                        element={
                            // Each route's content wrapped in motion.div for animation
                            <motion.div
                                key="home" // Unique key for the route
                                initial="initial"
                                animate="in"
                                exit="out"
                                variants={pageVariants}
                                transition={pageTransition}
                            >
                                <HomePage />
                            </motion.div>
                        }
                    />
                    {/* --- Grade Route ('/grade/:gradeId') --- */}
                    <Route
                        path="grade/:gradeId"
                        element={
                            <motion.div
                                key="grade" // Unique key
                                initial="initial"
                                animate="in"
                                exit="out"
                                variants={pageVariants}
                                transition={pageTransition}
                            >
                                <KanjiGrid />
                            </motion.div>
                        }
                    />
                    {/* --- Kanji Detail Route ('/kanji/:character') --- */}
                    <Route
                        path="kanji/:character"
                        element={
                            <motion.div
                                key="kanji" // Unique key
                                initial="initial"
                                animate="in"
                                exit="out"
                                variants={pageVariants}
                                transition={pageTransition}
                            >
                                <KanjiDetail />
                            </motion.div>
                        }
                    />
                    {/* --- Not Found Route ('*') --- */}
                    <Route
                        path="*" // Matches any path not matched above
                        element={
                            <motion.div
                                key="notfound" // Unique key
                                initial="initial"
                                animate="in"
                                exit="out"
                                variants={pageVariants}
                                transition={pageTransition}
                            >
                                {/* Center the error display */}
                                <div className="flex justify-center items-center pt-10">
                                     {/* Ensure ErrorDisplay is imported and available */}
                                    <ErrorDisplay message="Page Not Found (404)" context="Navigation Error" />
                                </div>
                            </motion.div>
                        }
                    />
                </Routes>
            </AnimatePresence>
        </Suspense>
    );
}

export default AnimatedRoutes;