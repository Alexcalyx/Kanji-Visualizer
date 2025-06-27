// src/components/layout/Layout.jsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "./"; // Adjust path if needed
import AppRouter from "./AppRouter"; // Import AppRouter
// import ThemeToggleButton from './ThemeToggleButton'; // Optional

// --- Icon Components (Forwarding refs) ---
const HamburgerIcon = React.forwardRef(({ onClick, className }, ref) => (
  <button
    ref={ref} // Attach ref
    onClick={onClick}
    className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-neon ${className}`}
    aria-label="Open menu" // Changed label
  >
    <svg
      className="h-6 w-6"
      stroke="currentColor"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h16M4 12h16m-7 6h7"
      />
    </svg>
  </button>
));

const CloseIcon = React.forwardRef(({ onClick, className }, ref) => (
  <button
    ref={ref} // Attach ref
    onClick={onClick}
    className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-neon ${className}`}
    aria-label="Close menu"
  >
    <svg
      className="h-6 w-6"
      stroke="currentColor"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
));

function Layout() {
  // --- Hooks ---
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const mobileMenuRef = useRef(null); // Ref for the menu panel itself

  // --- Styles ---
  const navStyle = `p-4 shadow-lg sticky top-0 z-40 border-b glassmorphism glassmorphism-light border-white/20`;
  const primaryColor = "text-primary-neon";

  // --- Link Styles (Desktop) ---
  // Base styles including focus ring for desktop links
  const navLinkBase =
    "text-sm sm:text-base font-heading transition-colors duration-200 px-2 py-1 rounded-md whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary-neon focus:ring-offset-2";
  // Default link styles per theme, adding appropriate focus offset color
  const navLinkDefaultLight = `text-slate-600 hover:text-primary-neon hover:bg-cyan-500/10 ${navLinkBase} focus:ring-offset-white`;
  // Active link styles per theme, adjusting focus offset color based on active bg
  const navLinkActiveLight = `bg-cyan-100 text-primary-dark font-semibold ${navLinkBase} focus:ring-offset-cyan-100`;

  // --- Mobile Overlay Link Styles (Enhanced) ---
  // Base styles including rounded corners, left border, and focus ring
  const mobileNavLinkBaseStyle = `block text-lg font-heading px-4 py-3 rounded-lg w-full text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-neon border-l-4`;
  // Default mobile link styles per theme, with transparent border and theme-based focus offset
  const mobileNavLinkDefaultLight = `${mobileNavLinkBaseStyle} text-slate-700 border-transparent hover:bg-cyan-500/10 hover:text-primary-dark focus:ring-offset-white`;
  // Active mobile link styles per theme, with colored border, background, and adjusted focus offset
  const mobileNavLinkActiveLight = `${mobileNavLinkBaseStyle} bg-cyan-100 text-primary-dark font-semibold border-primary-neon focus:ring-offset-cyan-100`;

  // --- Body Scroll Lock & Anti-Shift ---
  useEffect(() => {
    const body = document.body;

    if (isMobileMenuOpen) {
      // Calculate scrollbar width *before* hiding overflow
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Apply styles to prevent scroll and compensate for scrollbar width
      body.style.overflow = "hidden";

      // Focus management: focus close button after menu opens
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer); // Clear timeout if component unmounts or state changes quickly
    } else {
      // Restore styles: Use a timeout to ensure this runs after exit animation completes
      const timer = setTimeout(() => {
        body.style.overflow = "";
      }, 300); // Duration should match or exceed the exit animation duration
      return () => clearTimeout(timer);
    }

    // Cleanup function for component unmount
    return () => {
      body.style.overflow = "";
    };
  }, [isMobileMenuOpen]); // Depend only on the menu state

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // --- Menu Closing Handler ---
  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    // Restore focus to the hamburger button after closing
    hamburgerRef.current?.focus();
  };

  // --- Render Component ---
  return (
    <div className={`min-h-screen flex flex-col relative`}>
      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className={navStyle}
      >
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6">
          {/* Logo - Adjusted Sizes and Wrapping */}
          <NavLink
            to="/"
            className={`font-heading font-bold ${primaryColor} transition-colors flex flex-col items-start sm:flex-row sm:items-center sm:gap-1 hover:brightness-125`}
            title="Home"
          >
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight">
              Kanji
            </span>
            <span
              className={`font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight`}
            >
              Visualizer
            </span>
          </NavLink>

          {/* Right side items */}
          <div className="flex items-center">
            {/* Desktop Grade Links */}
            {!isHomePage && (
              <div className="hidden md:flex items-center space-x-1 lg:space-x-2 mr-2">
                {[1, 2, 3, 4, 5, 6].map((grade) => (
                  <NavLink
                    key={grade}
                    to={`/grade/${grade}`}
                    className={({ isActive }) =>
                      isActive ? navLinkActiveLight : navLinkDefaultLight
                    }
                  >
                    G{grade}
                  </NavLink>
                ))}
              </div>
            )}

            {/* Hamburger Button */}
            {!isHomePage && (
              <div className="md:hidden ml-2">
                <HamburgerIcon
                  ref={hamburgerRef} // Assign ref
                  onClick={() => setIsMobileMenuOpen(true)} // Open menu
                  className={`text-slate-700`}
                />
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* --- Mobile Menu Overlay --- */}
      <AnimatePresence>
        {isMobileMenuOpen && !isHomePage && (
          // Backdrop (for clicking outside menu to close)
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50" // z-index below panel, above nav
            onClick={closeMenu} // Use the close handler
            aria-hidden="true"
          />
        )}
        {isMobileMenuOpen && !isHomePage && (
          // Menu Panel (Slides from right, rounded)
          <motion.div
            key="mobile-menu-panel"
            ref={mobileMenuRef} // Assign ref to panel
            initial={{ x: "100%" }} // Start off-screen right
            animate={{ x: 0 }} // Animate to view
            exit={{ x: "100%" }} // Animate off-screen right on exit
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className={`fixed top-0 right-0 bottom-0 w-4/5 max-w-xs h-full z-[60] flex flex-col shadow-xl rounded-l-2xl bg-white`}
            role="dialog" // ARIA role for dialog
            aria-modal="true" // Indicates it's a modal dialog
            aria-labelledby="mobile-menu-title" // Associates with the title
          >
            {/* Menu Header with Title and Close Button */}
            <div
              className={`flex justify-between items-center p-4 border-b border-slate-200`}
            >
              <h2
                id="mobile-menu-title"
                className={`text-lg font-semibold text-slate-800`}
              >
                Menu
              </h2>
              <CloseIcon
                ref={closeButtonRef} // Assign ref to close button
                onClick={closeMenu} // Use the close handler
                className={`text-slate-600`}
              />
            </div>

            {/* Scrollable Menu Links */}
            <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
              {[1, 2, 3, 4, 5, 6].map((grade) => (
                <NavLink
                  key={`mobile-${grade}`}
                  to={`/grade/${grade}`}
                  className={(
                    { isActive } // Apply enhanced mobile styles
                  ) =>
                    isActive
                      ? mobileNavLinkActiveLight
                      : mobileNavLinkDefaultLight
                  }
                  onClick={closeMenu} // Close menu on link click
                >
                  Grade {grade}
                </NavLink>
              ))}
            </nav>

            {/* Optional Footer area inside menu */}
            {/* <div className="p-4 border-t border-slate-200 dark:border-slate-700"> ... </div> */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="container mx-auto p-4 py-6 md:p-6 md:py-8 relative z-10 flex-grow">
        <AppRouter />
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}

export default Layout;
