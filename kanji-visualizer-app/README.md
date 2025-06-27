# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Kanji Visualizer App

A React-based web application for learning and visualizing Japanese kanji characters. Built with Vite, React Router, and Tailwind CSS.

## Features

- **Kanji Grid View**: Browse kanji by grade level (1-6)
- **Kanji Detail View**: Detailed information including stroke order, readings, meanings, and examples
- **Responsive Design**: Works on desktop and mobile devices
- **Direct URL Access**: All routes are accessible via direct URL navigation
- **Caching System**: Efficient data caching for better performance

## Routing System

The app uses React Router for navigation with the following routes:

- `/` - Home page
- `/grade/:gradeId` - Kanji grid for a specific grade (1-6)
- `/kanji/:character` - Detailed view of a specific kanji character

### Direct URL Access

All routes support direct URL access, meaning users can:

- Bookmark specific kanji pages (e.g., `/kanji/願`)
- Share direct links to grade pages (e.g., `/grade/3`)
- Navigate directly to any route without going through the home page

### Deployment Configuration

The app includes configuration files for proper SPA routing:

- `public/_redirects` - For Netlify deployment
- `vercel.json` - For Vercel deployment
- `vite.config.js` - Development server configuration

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Technologies Used

- React 19
- React Router DOM 7
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React Icons
