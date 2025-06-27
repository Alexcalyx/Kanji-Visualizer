// src/App.jsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

// Import Top-Level Layout/Routing Components
import { Layout } from "./components/navigation";
import { CacheManager } from "./components/common";

// --- Main App Component ---
function App() {
  return (
    // Set up the Router
    <Router>
      {/* Layout component wraps all pages and handles routing internally */}
      <Layout />

      {/* Cache Manager - Available on all pages */}
      <CacheManager />
    </Router>
  );
}

export default App;
