import React, { useState, useEffect } from "react";
import "./App.css";
import MapComponent from "./components/MapComponent";
import initialViewState from "./initialViewState";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://map-server-kp0k.onrender.com/api/pos"
        );
        const result = await response.json();
        const formattedData = result.map((poi) => {
          const [longitude, latitude] = poi.location
            .replace("POINT(", "")
            .replace(")", "")
            .split(" ");
          return {
            name: poi.name,
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          };
        });
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching POIs:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <MapComponent initialViewState={initialViewState} data={data} />
    </div>
  );
}

export default App;
