import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { SessionProvider } from "./contexts/SessionContext";
import { Layout } from "./components/navigation";

function App() {
  return (
    <SessionProvider>
      <Router>
        <Layout />
      </Router>
    </SessionProvider>
  );
}

export default App;
