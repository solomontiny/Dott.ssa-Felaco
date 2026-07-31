import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
// Initialize API adapter which routes legacy /api/* calls to Supabase for incremental migration
import "@/lib/apiAdapter";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
