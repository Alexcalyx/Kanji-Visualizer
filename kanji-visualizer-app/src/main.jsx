import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { StudyProgressProvider } from "./contexts/StudyProgressContext";
import { SessionProvider } from "./contexts/SessionContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SessionProvider>
      <StudyProgressProvider>
        <App />
      </StudyProgressProvider>
    </SessionProvider>
  </StrictMode>
);
