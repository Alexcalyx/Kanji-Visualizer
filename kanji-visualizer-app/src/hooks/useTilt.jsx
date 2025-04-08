import { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';

function useTilt(options) {
    const ref = useRef(null);

    useEffect(() => {
        const currentRef = ref.current; // Capture ref value
        if (currentRef) {
            VanillaTilt.init(currentRef, options);

            // Cleanup function using the captured ref value
            return () => {
                // Check if vanillaTilt instance exists before destroying
                if (currentRef.vanillaTilt) {
                    currentRef.vanillaTilt.destroy();
                }
            };
        }
    }, [options]); // Re-initialize if options change

    return ref;
}

export default useTilt;