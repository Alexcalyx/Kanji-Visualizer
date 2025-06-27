// // tailwind.config.js
// /** @type {import('tailwindcss').Config} */
// import plugin from 'tailwindcss/plugin';
// import colors from "tailwindcss/colors";

// // Function to generate subtle noise background using SVG
// const generateNoise = (opacity = 0.04) => {
//     const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><filter id='noiseFilter'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#noiseFilter)' opacity='${opacity}'/></svg>`;
//     // Use Buffer for base64 encoding if available, otherwise fallback to btoa
//     const encodedSvg = typeof Buffer !== 'undefined' ? Buffer.from(svg).toString('base64') : btoa(svg);
//     return `url("data:image/svg+xml;base64,${encodedSvg}")`;
// };

// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   darkMode: 'class', // Ensure this is set to 'class'
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ['"Noto Sans JP"', 'sans-serif'],
//         display: ['"Teko"', '"Orbitron"', 'sans-serif'],
//         heading: ['"Russo One"', 'sans-serif'],
//       },
//       backgroundImage: {
//         'noise': generateNoise(0.04),
//         // Define the animated gradient layers for dark mode
//         'animated-gradient': `
//           radial-gradient(at 40% 40%, theme(colors.purple.900 / 0.3) 0px, transparent 50%),
//           radial-gradient(at 60% 60%, theme(colors.indigo.900 / 0.3) 0px, transparent 50%),
//           radial-gradient(at 20% 80%, theme(colors.neon-cyan / 0.15) 0px, transparent 40%),
//           radial-gradient(at 80% 30%, theme(colors.neon-magenta / 0.15) 0px, transparent 40%),
//           radial-gradient(at 50% 50%, theme(colors.bg-dark / 1) 30%, transparent 70%)
//         `,
//       },
//       colors: {
//         // Neon Accents
//         'neon-cyan': '#00f0ff',
//         'neon-magenta': '#ff00ff',
//         'neon-lime': '#39ff14',

//         // Core Palette (Adjust neon versions if desired)
//         'primary': {
//           light: '#34d3f4', DEFAULT: '#0891b2', dark: '#0e7490', neon: '#00f0ff',
//         },
//         'secondary': {
//           light: '#f472b6', DEFAULT: '#db2777', dark: '#be185d', neon: '#ff00ff',
//         },
//         'accent': {
//            light: '#a3e635', DEFAULT: '#84cc16', dark: '#65a30d', neon: '#39ff14',
//         },

//         // Core Theme Colors (Corrected)
//         'bg-light': colors.white,       // Light mode background
//         'bg-dark': colors.gray[900], // Dark mode background (#0f172a)
//         'text-light': colors.slate[800],  // Text on light background (#1e293b)
//         'text-dark': colors.slate[200], // Text on dark background (#e2e8f0)
//         'subtle-light': colors.slate[500], // Subtle text/elements on light bg (#64748b)
//         'subtle-dark': colors.slate[400],  // Subtle text/elements on dark bg (#94a3b8)
//         'border-light': colors.slate[300], // Border on light bg (#cbd5e1) - Using solid color now
//         'border-dark': colors.slate[700],  // Border on dark bg (#334155) - Using solid color now

//         // Glassmorphism & Glow (Adjust opacity/colors if needed based on new bg/border)
//         'card-light': 'rgba(255, 255, 255, 0.05)',
//         'card-dark': 'rgba(30, 41, 59, 0.1)', // Based on slate-900
//         'glow-cyan': 'rgba(0, 240, 255, 0.6)',
//         'glow-magenta': 'rgba(255, 0, 255, 0.6)',
//       },
//       keyframes: {
//         'gradient-shift': {
//           '0%, 100%': { backgroundPosition: '0% 50%' },
//           '50%': { backgroundPosition: '100% 50%' },
//         },
//         'subtle-glow': {
//             '0%, 100%': { filter: 'drop-shadow(0 0 2px theme(colors.primary.neon / 0.5))' },
//             '50%': { filter: 'drop-shadow(0 0 5px theme(colors.primary.neon / 0.7))' },
//         },
//         'gradient-move': {
//           '0%': { backgroundPosition: '0% 0%' },
//           '25%': { backgroundPosition: '100% 0%' },
//           '50%': { backgroundPosition: '100% 100%' },
//           '75%': { backgroundPosition: '0% 100%' },
//           '100%': { backgroundPosition: '0% 0%' },
//         },
//          'hue-rotate': {
//           '0%, 100%': { filter: 'hue-rotate(0deg)' },
//           '50%': { filter: 'hue-rotate(20deg)' },
//         }
//       },
//       animation: {
//         'gradient-shift': 'gradient-shift 10s ease infinite',
//         'subtle-glow': 'subtle-glow 3s ease-in-out infinite',
//         // Apply multiple animations to background
//         'gradient-bg': 'gradient-move 45s cubic-bezier(0.4, 0, 0.2, 1) infinite, hue-rotate 60s linear infinite alternate',
//       },
//       dropShadow: {
//         'neon-cyan-sm': '0 0 3px theme(colors.primary.neon / 0.7)',
//         'neon-cyan-md': '0 0 8px theme(colors.primary.neon / 0.6)',
//         'neon-magenta-sm': '0 0 3px theme(colors.secondary.neon / 0.7)',
//         'neon-magenta-md': '0 0 8px theme(colors.secondary.neon / 0.6)',
//         'neon-lime-sm': '0 0 3px theme(colors.accent.neon / 0.7)',
//         'neon-lime-md': '0 0 8px theme(colors.accent.neon / 0.6)',
//       }
//     },
//   },
//   plugins: [
//     plugin(function({ addBase, theme, addUtilities }) {
//       addBase({
//         'html': { scrollBehavior: 'smooth' },
//         'body': {
//             // Base styles applied regardless of theme
//             '@apply font-sans antialiased transition-colors duration-300': {},
//             // Default light theme + dark mode overrides using Tailwind's 'dark:' prefix
//             // This relies on the 'dark' class being on the <html> element
//             '@apply bg-bg-light text-text-light dark:bg-bg-dark dark:text-text-dark': {},
//             position: 'relative', // For pseudo-elements like noise
//             // Noise overlay using ::after pseudo-element
//             '&::after': {
//                 content: '""',
//                 position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
//                 width: '100vw', height: '100vh',
//                 backgroundImage: theme('backgroundImage.noise'),
//                 pointerEvents: 'none',
//                 zIndex: '-1',
//                 opacity: '0.5', // Adjust noise visibility if needed
//             },
//         },
//         // Glassmorphism (can be applied as needed, respects dark mode via nested dark: variants if required)
//         '.glassmorphism': {
//           '@apply bg-opacity-5 backdrop-blur-lg border border-opacity-10 shadow-xl': {},
//           'background-clip': 'padding-box',
//          },
//         '.glassmorphism-light': { // Example explicit light version
//           '@apply bg-white border-white': {},
//          },
//         '.glassmorphism-dark': { // Example explicit dark version
//           '@apply bg-slate-800/10 border-slate-500/20': {},
//          },
//       });
//       // Add utility for text glow
//       addUtilities({
//           '.text-glow-cyan': { filter: `drop-shadow(0 0 5px ${theme('colors.primary.neon / 0.8')})` },
//           '.text-glow-magenta': { filter: `drop-shadow(0 0 5px ${theme('colors.secondary.neon / 0.8')})` },
//           '.text-glow-lime': { filter: `drop-shadow(0 0 5px ${theme('colors.accent.neon / 0.8')})` },
//       })
//     })
//   ],
// }
