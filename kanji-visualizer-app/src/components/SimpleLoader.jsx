// src/components/SimpleLoader.jsx
import React from 'react';
import Spinner from './Spinner'; // Use your Lottie spinner

function SimpleLoader() {
    return (
        // Ensure it takes up significant space while loading routes
        <div className="flex justify-center items-center min-h-[70vh]">
            <Spinner size="lg" />
        </div>
    );
}

export default SimpleLoader;