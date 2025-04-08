// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Providers and Top-Level Layout/Routing Components
import { ThemeProvider } from './contexts/ThemeContext';
import { ProgressProvider } from './contexts/ProgressContext';
import Layout from './components/Layout';
import AnimatedRoutes from './components/AnimatedRoutes';

// --- Main App Component ---
function App() {
  return (
    // Wrap the entire application in Context Providers
    <ThemeProvider>
      <ProgressProvider>
        {/* Set up the Router */}
        <Router>
          {/* Use Routes to define top-level route structure */}
          <Routes>
            {/* The Layout component wraps all pages */}
            {/* "/*" matches the base path and any nested paths */}
            <Route path="/*" element={<Layout />}>
              {/*
                Nested routes defined within Layout's Outlet
                are handled by the AnimatedRoutes component.
                The "*" here ensures AnimatedRoutes receives control
                for any path matched under Layout.
              */}
              <Route path="*" element={<AnimatedRoutes />} />
            </Route>
          </Routes>
        </Router>
      </ProgressProvider>
    </ThemeProvider>
  );
}

export default App;