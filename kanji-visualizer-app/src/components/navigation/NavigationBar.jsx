import React, { useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { styles } from "../../utils/styles";

// Icon components
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

function NavigationBar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  hamburgerRef,
  closeButtonRef,
  mobileMenuRef,
  closeMenu,
}) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const navStyle = `p-4 shadow-lg sticky top-0 z-40 border-b glassmorphism glassmorphism-light border-white/20`;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className={navStyle}
    >
      <div className={styles.nav.container}>
        {/* Logo */}
        <NavLink to="/" className={styles.nav.logo} title="Home">
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight">
            Kanji
          </span>
          <span className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
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
                    isActive ? styles.nav.linkActive : styles.nav.linkDefault
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
                ref={hamburgerRef}
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-slate-700"
              />
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default NavigationBar;
