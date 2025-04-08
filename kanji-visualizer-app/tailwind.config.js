/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

const generateNoise = (opacity = 0.03) => { /* ... no change ... */ };

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans JP"', 'sans-serif'], // Keep for body text clarity
        display: ['"Teko"', '"Orbitron"', 'sans-serif'], // For large Kanji display
        heading: ['"Russo One"', 'sans-serif'], // For section titles/headings
      },
      backgroundImage: {
        'noise': generateNoise(0.04), // Slightly more visible noise
        // Animated Mesh Gradient (Example using CSS conic-gradient - complex, alternatives exist)
        // Consider a library or simpler gradient approach if this is too much
        'animated-mesh-gradient': 'radial-gradient(at top left, theme(colors.indigo.950), transparent 50%), radial-gradient(at bottom right, theme(colors.purple.950), transparent 50%)', // Simplified static gradient for now
      },
      colors: {
        // Neon Accents (Ensure high saturation)
        'neon-cyan': '#00f0ff',
        'neon-magenta': '#ff00ff',
        'neon-lime': '#39ff14',

        // Core Palette (Adjusted based on neon accents)
        'primary': { // Use Neon Cyan
          light: '#34d3f4', // Lighter cyan for hover/light mode
          DEFAULT: '#00f0ff', // Neon Cyan
          dark: '#00c0cc'  // Slightly darker/deeper cyan
        },
        'secondary': { // Use Neon Magenta
          light: '#f472b6', // Lighter magenta
          DEFAULT: '#ff00ff', // Neon Magenta
          dark: '#e500e5' // Slightly darker/deeper magenta
        },
        'accent': { // Use Neon Lime
          light: '#a3e635',
          DEFAULT: '#39ff14', // Neon Lime
          dark: '#2dbf0a'
        },
        'bg-light': '#f0f9ff', // Keep light bg simple
        'bg-dark': '#0a031a', // Deep purple/indigo dark background
        // Adjusted Glassmorphism Target Colors (Low Opacity)
        'card-light': 'rgba(255, 255, 255, 0.05)', // Very subtle white base
        'card-dark': 'rgba(26, 18, 44, 0.1)', // Very subtle dark purple base (adjust based on bg-dark)
        'text-light': '#1f2937',
        'text-dark': '#e5e7eb',
        'subtle-light': '#6b7280',
        'subtle-dark': '#9ca3af',
        // Adjusted Border Colors (Low Opacity)
        'border-light': 'rgba(255, 255, 255, 0.1)', // Subtle white border
        'border-dark': 'rgba(71, 85, 105, 0.2)', // Subtle slate border
        // Neon Glow Colors (Example using primary/secondary)
        'glow-cyan': 'rgba(0, 240, 255, 0.6)',
        'glow-magenta': 'rgba(255, 0, 255, 0.6)',
      },
      // Add keyframes for potential CSS animations (e.g., gradient shift)
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'subtle-glow': {
            '0%, 100%': { filter: 'drop-shadow(0 0 2px theme(colors.neon-cyan / 0.5))' },
            '50%': { filter: 'drop-shadow(0 0 5px theme(colors.neon-cyan / 0.7))' },
        }
      },
      animation: {
        'gradient-shift': 'gradient-shift 10s ease infinite',
        'subtle-glow': 'subtle-glow 3s ease-in-out infinite',
      },
      // Add drop shadow filter utility (if not default)
      dropShadow: {
        'neon-cyan-sm': '0 0 3px theme(colors.neon-cyan / 0.7)',
        'neon-cyan-md': '0 0 8px theme(colors.neon-cyan / 0.6)',
        'neon-magenta-sm': '0 0 3px theme(colors.neon-magenta / 0.7)',
        'neon-magenta-md': '0 0 8px theme(colors.neon-magenta / 0.6)',
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
            // Apply noise *over* the background color/gradient
            '&::before': {
                content: '""',
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                width: '100vw', height: '100vh',
                backgroundImage: theme('backgroundImage.noise'),
                pointerEvents: 'none',
                zIndex: '-1', // Place behind content
                opacity: '0.6', // Adjust noise opacity here
            },
        },
        // Update Glassmorphism class to match target style
        '.glassmorphism': {
          '@apply bg-opacity-5 backdrop-blur-lg border border-opacity-10 shadow-xl': {}, // Target: low bg opacity, subtle border
          'background-clip': 'padding-box',
         },
        '.glassmorphism-light': {
          '@apply bg-white border-white': {}, // Base colors for light mode glass
         },
        '.glassmorphism-dark': {
           // Use a dark color with very low opacity derived from your bg-dark
          '@apply bg-slate-800/10 border-slate-500/20': {}, // Adjusted base for dark mode
         },
      });
      // Add utility for neon text glow
      addUtilities({
          '.text-glow-cyan': { filter: 'drop-shadow(0 0 5px theme(colors.neon-cyan / 0.8))' },
          '.text-glow-magenta': { filter: 'drop-shadow(0 0 5px theme(colors.neon-magenta / 0.8))' },
      })
    })
  ],
}