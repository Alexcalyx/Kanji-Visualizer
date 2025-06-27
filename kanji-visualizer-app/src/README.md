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
│   │   ├── PaginationControls.jsx # Pagination interface
│   │   ├── CacheManager.jsx      # Cache management interface
│   │   └── CacheIndicator.jsx    # Cache status indicator
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
│   ├── useCache.jsx              # Caching system hook
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
- **CacheManager**: Cache management interface with statistics
- **CacheIndicator**: Visual indicator for cached data

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

## 🗄️ Caching System

The app implements a sophisticated caching system to improve performance and reduce API calls:

### **Cache Architecture**

- **In-Memory Cache**: Fast access for current session data
- **LocalStorage Cache**: Persistent storage across browser sessions
- **TTL (Time-To-Live)**: Automatic cache expiration
- **Graceful Fallback**: Falls back to API when cache fails

### **Cache Configuration**

```javascript
const CACHE_CONFIG = {
  TTL: {
    KANJI_LIST: 24 * 60 * 60 * 1000, // 24 hours
    KANJI_DETAILS: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
};
```

### **Cache Features**

1. **Smart Data Fetching**: Checks cache before making API calls
2. **Cache Indicators**: Visual indicators show when data is loaded from cache
3. **Cache Management**: Users can view cache stats and clear cache
4. **Automatic Cleanup**: Expired cache entries are automatically removed
5. **Error Handling**: Graceful handling of cache failures

### **Cache Manager Interface**

- **Floating Button**: Blue info button in bottom-right corner
- **Cache Statistics**: Shows memory and storage cache sizes
- **TTL Information**: Displays cache duration for different data types
- **Manual Controls**: Refresh stats and clear all cache
- **Real-time Updates**: Stats update automatically every 5 seconds

### **Cache Indicators**

- **Green "Cached" Badge**: Appears when data is loaded from cache
- **Database Icon**: Visual indicator for cached data
- **Smooth Animations**: Fade-in/out animations for indicators

### **Performance Benefits**

- **Faster Loading**: Cached data loads instantly
- **Reduced API Calls**: Significantly fewer requests to external APIs
- **Offline Capability**: Basic functionality works without internet
- **Bandwidth Savings**: Reduced data usage for repeat visits
- **Better UX**: Smoother user experience with instant data access

## 📦 Import Patterns

### Clean Imports Using Index Files

```javascript
// Import from common components
import {
  LoadingSpinner,
  ErrorDisplay,
  CacheManager,
} from "../components/common";

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
import useCache from "../hooks/useCache";
```

## 🎯 Benefits of This Structure

1. **Scalability**: Easy to add new components without cluttering the main components folder
2. **Maintainability**: Clear separation of concerns with domain-specific folders
3. **Reusability**: Common components are easily accessible across the app
4. **Clean Imports**: Index files provide clean, semantic import paths
5. **Developer Experience**: Intuitive folder structure makes it easy to find components
6. **Performance**: Lazy loading, code splitting, and intelligent caching
7. **User Experience**: Fast loading times and offline capability

## 🔄 Migration Notes

This structure was refactored from a flat components folder to improve organization and maintainability. All imports have been updated to use the new folder structure and component names. The caching system was added to improve performance and reduce API dependency.
