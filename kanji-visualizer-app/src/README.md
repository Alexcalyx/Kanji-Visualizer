# Kanji Visualizer App - Source Structure

This document outlines the organized folder structure and component architecture of the Kanji Visualizer application.

## 📁 Folder Structure

```
src/
├── components/
│   ├── common/                    # Reusable UI components
│   │   ├── index.js              # Clean exports for common components
│   │   ├── LottieSpinner.jsx     # Loading spinner with Lottie animation
│   │   ├── LoadingSpinner.jsx    # Full-page loading component
│   │   ├── ErrorDisplay.jsx      # Error message display
│   │   ├── InfoCard.jsx          # Animated card container
│   │   └── PaginationControls.jsx # Pagination interface
│   ├── kanji/                    # Kanji-specific components
│   │   ├── index.js              # Clean exports for kanji components
│   │   ├── KanjiCard.jsx         # Individual kanji card
│   │   ├── KanjiInfo.jsx         # Kanji information display
│   │   ├── GradeSelector.jsx     # Grade level selection
│   │   ├── KanjiExamples.jsx     # Word examples display
│   │   ├── KanjiReadings.jsx     # Kanji readings display
│   │   ├── RelatedKanji.jsx      # Related kanji display
│   │   ├── KanjiGraph.jsx        # Kanji relationship graph
│   │   ├── KanjiStructure.jsx    # Kanji structure info
│   │   └── StrokeOrder.jsx       # Stroke order display
│   └── navigation/               # Layout and routing components
│       ├── index.js              # Clean exports for navigation
│       ├── Layout.jsx            # Main layout wrapper
│       ├── Footer.jsx            # Footer component
│       └── AppRouter.jsx         # Route configuration with animations
├── pages/                        # Page components
│   ├── index.js                  # Clean exports for pages
│   ├── HomePage.jsx              # Landing page
│   ├── KanjiGrid.jsx             # Kanji grid display
│   └── KanjiDetail.jsx           # Individual kanji details
├── hooks/                        # Custom React hooks
│   ├── useAnimateInView.jsx      # Animation on scroll hook
│   ├── useKanjiDetails.jsx       # Kanji data fetching hook
│   ├── useKanjiList.jsx          # Kanji list fetching hook
│   └── useTilt.jsx               # Tilt effect hook
├── contexts/                     # React contexts (if any)
├── assets/                       # Static assets
│   ├── animations/               # Lottie animation files
│   │   ├── checkmark.json        # Success checkmark animation
│   │   └── loading_spinner.json  # Loading spinner animation
│   └── react.svg                 # React logo
├── App.jsx                       # Main app component
├── main.jsx                      # App entry point
├── index.css                     # Global styles
└── App.css                       # App-specific styles
```

## 🧩 Component Categories

### Common Components (`components/common/`)

Reusable UI components that can be used throughout the application:

- **LottieSpinner**: Loading indicator with Lottie animation
- **LoadingSpinner**: Full-page loading component
- **ErrorDisplay**: Error message display with context
- **InfoCard**: Animated card container
- **PaginationControls**: Pagination interface

### Kanji Components (`components/kanji/`)

Domain-specific components for kanji functionality:

- **KanjiCard**: Individual kanji card with tilt effects
- **KanjiInfo**: Kanji information display
- **GradeSelector**: Grade level selection interface
- **KanjiExamples**: Word examples display
- **KanjiReadings**: Kanji readings (on'yomi/kun'yomi)
- **RelatedKanji**: Related kanji display
- **KanjiGraph**: Kanji relationship visualization
- **KanjiStructure**: Kanji structure information
- **StrokeOrder**: Stroke order animations

### Navigation Components (`components/navigation/`)

Layout and routing components:

- **Layout**: Main layout wrapper with navigation
- **Footer**: Footer component
- **AppRouter**: Route configuration with page transitions

### Page Components (`pages/`)

Top-level page components:

- **HomePage**: Landing page with grade selection
- **KanjiGrid**: Kanji grid display with search and pagination
- **KanjiDetail**: Individual kanji details page

## 📦 Import Patterns

### Clean Imports Using Index Files

```javascript
// Import from common components
import { LoadingSpinner, ErrorDisplay } from "../components/common";

// Import from kanji components
import { KanjiCard, GradeSelector } from "../components/kanji";

// Import from navigation components
import { Layout, AppRouter } from "../components/navigation";

// Import from pages
import { HomePage, KanjiGrid } from "../pages";
```

### Direct Imports (when needed)

```javascript
// Direct component import
import KanjiCard from "../components/kanji/KanjiCard";

// Direct hook import
import useKanjiDetails from "../hooks/useKanjiDetails";
```

## 🎯 Benefits of This Structure

1. **Scalability**: Easy to add new components without cluttering the main components folder
2. **Maintainability**: Clear separation of concerns with domain-specific folders
3. **Reusability**: Common components are easily accessible across the app
4. **Clean Imports**: Index files provide clean, semantic import paths
5. **Developer Experience**: Intuitive folder structure makes it easy to find components
6. **Performance**: Lazy loading and code splitting are easier to implement

## 🔄 Migration Notes

This structure was refactored from a flat components folder to improve organization and maintainability. All imports have been updated to use the new folder structure and component names.
