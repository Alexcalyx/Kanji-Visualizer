// tailwind.config.js
/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';
import colors from "tailwindcss/colors";

// Function to generate subtle noise background using SVG
const generateNoise = (opacity = 0.04) => { // Adjusted default opacity slightly
    // Ensure SVG is properly formatted for XML parsing
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><filter id='noiseFilter'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#noiseFilter)' opacity='${opacity}'/></svg>`;
    // Use Buffer for base64 encoding, ensure it's available
    const encodedSvg = globalThis.Buffer ? globalThis.Buffer.from(svg).toString('base64') : btoa(svg); // Fallback to btoa if Buffer isn't polyfilled
    return `url("data:image/svg+xml;base64,${encodedSvg}")`;
};


export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans JP"', 'sans-serif'], // Keep for body text clarity
        display: ['"Teko"', '"Orbitron"', 'sans-serif'], // For large Kanji display
        heading: ['"Russo One"', 'sans-serif'], // For section titles/headings
      },
      backgroundImage: {
        'noise': generateNoise(0.04), // Slightly more visible noise
        // Define the animated gradient layers for dark mode
        'animated-gradient': `
          radial-gradient(at 40% 40%, theme(colors.purple.900 / 0.3) 0px, transparent 50%),
          radial-gradient(at 60% 60%, theme(colors.indigo.900 / 0.3) 0px, transparent 50%),
          radial-gradient(at 20% 80%, theme(colors.neon-cyan / 0.15) 0px, transparent 40%),
          radial-gradient(at 80% 30%, theme(colors.neon-magenta / 0.15) 0px, transparent 40%),
          radial-gradient(at 50% 50%, theme(colors.bg-dark / 1) 30%, transparent 70%)
        `,
      },
      colors: {
        // Neon Accents (Ensure high saturation)
        'neon-cyan': '#00f0ff',
        'neon-magenta': '#ff00ff',
        'neon-lime': '#39ff14',

        // Core Palette (Adjusted based on neon accents)
        'primary': { // Use Neon Cyan derived
          light: colors.red[500], // Lighter cyan for hover/light mode
          DEFAULT: colors.red[500], // Kept original default for reference, can alias to neon
          dark: '#0e7490', // Kept original dark
          neon: '#00f0ff', // Explicit neon version
        },
        'secondary': { // Use Neon Magenta derived
          light: colors.red[500], // Lighter magenta
          DEFAULT: colors.red[500], // Kept original default
          dark: '#be185d', // Kept original dark
          neon: '#ff00ff', // Explicit neon version
        },
        'accent': { // Use Neon Lime derived
            light: '#a3e635',
            DEFAULT: '#84cc16', // Kept original default
            dark: '#65a30d',
            neon: '#39ff14', // Explicit neon version
        },
        'bg-light': colors.amber, // sky-50 (very light blue)
        'bg-dark': colors.amber, // Deep purple/indigo dark background
        // Adjusted Glassmorphism Target Colors (Low Opacity)
        'card-light': 'rgba(255, 255, 255, 0.05)', // Very subtle white base
        'card-dark': 'rgba(26, 18, 44, 0.1)', // Very subtle dark purple base (adjust based on bg-dark)
        'text-light': '#1f2937', // gray-800
        'text-dark': '#e5e7eb', // gray-200
        'subtle-light': '#6b7280', // gray-500
        'subtle-dark': '#9ca3af', // gray-400
        // Adjusted Border Colors (Low Opacity)
        'border-light': 'rgba(255, 255, 255, 0.1)', // Subtle white border
        'border-dark': 'rgba(71, 85, 105, 0.2)', // Subtle slate border
        // Neon Glow Colors (Example using primary/secondary neon)
        'glow-cyan': 'rgba(0, 240, 255, 0.6)',
        'glow-magenta': 'rgba(255, 0, 255, 0.6)',
      },
      // Add keyframes for potential CSS animations
      keyframes: {
        'gradient-shift': { // Simple gradient shift if needed elsewhere
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'subtle-glow': { // Example glow animation
            '0%, 100%': { filter: 'drop-shadow(0 0 2px theme(colors.primary.neon / 0.5))' },
            '50%': { filter: 'drop-shadow(0 0 5px theme(colors.primary.neon / 0.7))' },
        },
        'gradient-move': { // For the animated background
          '0%': { backgroundPosition: '0% 0%' },
          '25%': { backgroundPosition: '100% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '75%': { backgroundPosition: '0% 100%' },
          '100%': { backgroundPosition: '0% 0%' },
        },
         'hue-rotate': { // Subtle hue shift for the background
          '0%, 100%': { filter: 'hue-rotate(0deg)' },
          '50%': { filter: 'hue-rotate(20deg)' }, // Reduced angle
        }
      },
      animation: {
        'gradient-shift': 'gradient-shift 10s ease infinite',
        'subtle-glow': 'subtle-glow 3s ease-in-out infinite',
        // Apply multiple animations (gradient movement and hue rotation) to background
        'gradient-bg': 'gradient-move 45s cubic-bezier(0.4, 0, 0.2, 1) infinite, hue-rotate 60s linear infinite alternate', // Slower, smoother timing
      },
      // Add drop shadow filter utility
      dropShadow: {
        'neon-cyan-sm': '0 0 3px theme(colors.primary.neon / 0.7)',
        'neon-cyan-md': '0 0 8px theme(colors.primary.neon / 0.6)',
        'neon-magenta-sm': '0 0 3px theme(colors.secondary.neon / 0.7)',
        'neon-magenta-md': '0 0 8px theme(colors.secondary.neon / 0.6)',
        'neon-lime-sm': '0 0 3px theme(colors.accent.neon / 0.7)',
        'neon-lime-md': '0 0 8px theme(colors.accent.neon / 0.6)',
      }
    },
  },
  plugins: [
    plugin(function({ addBase, theme, addUtilities }) {
      addBase({
        'html': { scrollBehavior: 'smooth' },
        'body': {
            '@apply font-sans antialiased transition-colors duration-300': {},
            '@apply bg-bg-light text-text-light dark:bg-bg-dark dark:text-text-dark': {},
             // Ensure body has relative positioning if pseudo-elements are absolutely positioned relative to it
            position: 'relative',
            // Noise overlay using ::after pseudo-element
            '&::after': {
                content: '""',
                position: 'fixed', // Fixed position to cover viewport
                top: 0, left: 0, right: 0, bottom: 0,
                width: '100vw', height: '100vh', // Cover viewport
                backgroundImage: theme('backgroundImage.noise'),
                pointerEvents: 'none', // Allow clicks through
                zIndex: '-1', // Behind content, but above the main bg potentially
                opacity: '0.5', // Adjust noise opacity
            },
        },
        // Updated Glassmorphism class
        '.glassmorphism': {
          '@apply bg-opacity-5 backdrop-blur-lg border border-opacity-10 shadow-xl': {},
          'background-clip': 'padding-box',
         },
        '.glassmorphism-light': {
          '@apply bg-white border-white': {},
         },
        '.glassmorphism-dark': {
          '@apply bg-slate-800/10 border-slate-500/20': {}, // Adjusted base for dark mode
         },
      });
      // Add utility for text glow
      addUtilities({
          '.text-glow-cyan': { filter: 'drop-shadow(0 0 5px theme(colors.primary.neon / 0.8))' },
          '.text-glow-magenta': { filter: 'drop-shadow(0 0 5px theme(colors.secondary.neon / 0.8))' },
          '.text-glow-lime': { filter: 'drop-shadow(0 0 5px theme(colors.accent.neon / 0.8))' },
      })
    })
  ],
}