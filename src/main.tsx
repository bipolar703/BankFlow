import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import CSSDebugger from "./utils/CSSDebugger";

// Safely access NODE_ENV using import.meta.env in Vite
const isDevelopment = import.meta.env.MODE !== "production";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CSSDebugger enabled={isDevelopment} />
    <App />
  </StrictMode>
);
