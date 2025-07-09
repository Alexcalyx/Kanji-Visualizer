import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "./";
import AppRouter from "./AppRouter";

const HamburgerIcon = React.forwardRef(({ onClick, className }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-neon ${className}`}
    aria-label="Open menu"
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
    ref={ref}
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
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navStyle = `p-4 shadow-lg sticky top-0 z-40 border-b glassmorphism glassmorphism-light border-white/20`;
  const primaryColor = "text-primary-neon";

  const navLinkBase =
    "text-sm sm:text-base font-heading transition-colors duration-200 px-2 py-1 rounded-md whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary-neon focus:ring-offset-2";
  const navLinkDefaultLight = `text-slate-600 hover:text-primary-neon hover:bg-purple-500/10 ${navLinkBase} focus:ring-offset-white`;
  const navLinkActiveLight = `bg-purple-100 text-primary-dark font-semibold ${navLinkBase} focus:ring-offset-purple-100`;

  const mobileNavLinkBaseStyle = `block text-lg font-heading px-4 py-3 rounded-lg w-full text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-neon border-l-4`;
  const mobileNavLinkDefaultLight = `${mobileNavLinkBaseStyle} text-slate-700 border-transparent hover:bg-purple-500/10 hover:text-primary-dark focus:ring-offset-white`;
  const mobileNavLinkActiveLight = `${mobileNavLinkBaseStyle} bg-purple-100 text-primary-dark font-semibold border-primary-neon focus:ring-offset-purple-100`;
  useEffect(() => {
    const body = document.body;

    if (isMobileMenuOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = "hidden";

      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        body.style.overflow = "";
      }, 300);
      return () => clearTimeout(timer);
    }

    return () => {
      body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    hamburgerRef.current?.focus();
  };
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

          <div className="flex items-center">
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

            {!isHomePage && (
              <div className="md:hidden ml-2">
                <HamburgerIcon
                  ref={hamburgerRef}
                  onClick={() => setIsMobileMenuOpen(true)}
                  className={`text-slate-700`}
                />
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && !isHomePage && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
        {isMobileMenuOpen && !isHomePage && (
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
                ref={closeButtonRef}
                onClick={closeMenu}
                className={`text-slate-600`}
              />
            </div>

            <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
              {[1, 2, 3, 4, 5, 6].map((grade) => (
                <NavLink
                  key={`mobile-${grade}`}
                  to={`/grade/${grade}`}
                  className={({ isActive }) =>
                    isActive
                      ? mobileNavLinkActiveLight
                      : mobileNavLinkDefaultLight
                  }
                  onClick={closeMenu}
                >
                  Grade {grade}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto p-4 py-6 md:p-6 md:py-8 relative z-10 flex-grow">
        <AppRouter />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
