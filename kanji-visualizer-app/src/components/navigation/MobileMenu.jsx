import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { styles } from "../../utils/styles";

// Mobile link styles
const mobileNavLinkBaseStyle = `block text-lg font-heading px-4 py-3 rounded-lg w-full text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-neon border-l-4`;
const mobileNavLinkDefaultLight = `${mobileNavLinkBaseStyle} text-slate-700 border-transparent hover:bg-purple-500/10 hover:text-primary-dark focus:ring-offset-white`;
const mobileNavLinkActiveLight = `${mobileNavLinkBaseStyle} bg-purple-100 text-primary-dark font-semibold border-primary-neon focus:ring-offset-purple-100`;

// Icon component
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

function MobileMenu({
  isMobileMenuOpen,
  isHomePage,
  closeMenu,
  closeButtonRef,
  mobileMenuRef,
}) {
  return (
    <AnimatePresence>
      {isMobileMenuOpen && !isHomePage && (
        // Backdrop
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
        // Menu Panel
        <motion.div
          key="mobile-menu-panel"
          ref={mobileMenuRef}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 right-0 bottom-0 w-4/5 max-w-xs h-full z-[60] flex flex-col shadow-xl rounded-l-2xl bg-white"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          {/* Menu Header */}
          <div className="flex justify-between items-center p-4 border-b border-slate-200">
            <h2
              id="mobile-menu-title"
              className="text-lg font-semibold text-slate-800"
            >
              Menu
            </h2>
            <CloseIcon
              ref={closeButtonRef}
              onClick={closeMenu}
              className="text-slate-600"
            />
          </div>

          {/* Menu Links */}
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
  );
}

export default MobileMenu;
