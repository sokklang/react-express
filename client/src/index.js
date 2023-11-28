// index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const root = document.getElementById("root");

// Import createRoot from "react-dom/client" instead of "react-dom"
const reactRoot = ReactDOM.createRoot(root);
reactRoot.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
