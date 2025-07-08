import { useEffect } from "react";

/**
 * Custom hook to lock/unlock body scroll
 * @param {boolean} isLocked - Whether to lock the body scroll
 * @param {number} exitDelay - Delay in ms before unlocking scroll (for animations)
 */
function useBodyScrollLock(isLocked, exitDelay = 300) {
  useEffect(() => {
    const body = document.body;

    if (isLocked) {
      // Calculate scrollbar width before hiding overflow
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Apply styles to prevent scroll
      body.style.overflow = "hidden";

      // Optionally compensate for scrollbar width to prevent layout shift
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      // Restore styles with delay to ensure exit animation completes
      const timer = setTimeout(() => {
        body.style.overflow = "";
        body.style.paddingRight = "";
      }, exitDelay);

      return () => clearTimeout(timer);
    }

    // Cleanup function for component unmount
    return () => {
      body.style.overflow = "";
      body.style.paddingRight = "";
    };
  }, [isLocked, exitDelay]);
}

export default useBodyScrollLock;
