import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "mapbox-gl/dist/mapbox-gl.css"; // Import Mapbox CSS

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
