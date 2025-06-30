// src/App.jsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { SessionProvider } from "./contexts/SessionContext";

// Import Top-Level Layout/Routing Components
import { Layout } from "./components/navigation";

// --- Main App Component ---
function App() {
  return (
    <SessionProvider>
      {/* Set up the Router */}
      <Router>
        {/* Layout component wraps all pages and handles routing internally */}
        <Layout />
      </Router>
    </SessionProvider>
  );
}

export default App;
