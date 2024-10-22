import React, { useState, useEffect, useCallback } from "react";
import MapComponent from "./components/MapComponent/MapComponent";
import initialViewState from "./initialViewState";
import { generateCirclePolygon } from "./utils/generateMask";
import styles from "./App.module.css";
import ViewModePanel from "./components/ViewModePanel/ViewModePanel";

function App() {
  const [data, setData] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [viewState, setViewState] = useState(initialViewState);
  const [maskData, setMaskData] = useState([]);

  const fetchBuildings = async () => {
    const response = await fetch("/buildings-main.geojson");
    const data = await response.json();

    const buildings = data.features.map((feature) => {
      const coordinates = feature.geometry.coordinates[0];
      const name =
        feature.properties?.["name:en"] ||
        feature.properties?.["name"] ||
        "Unknown"; // Safely access the name property, default to 'Unknown' if not present
      const height = feature.properties["building:levels"]
        ? parseInt(feature.properties["building:levels"], 10) * 3
        : 10; // 10 meters or 3 meters per level

      return {
        name,
        polygon: coordinates,
        height,
      };
    });

    setBuildings(buildings);
  };

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
    fetchBuildings();
  }, [viewState.latitude, viewState.longitude]);

  useEffect(() => {
    const polygon = generateCirclePolygon(
      viewState.longitude,
      viewState.latitude,
      800
    );
    setMaskData([{ polygon }]);
    console.log("Mask Data:", [{ polygon }]);
  }, [viewState]);

  const handleViewStateChange = useCallback(({ viewState }) => {
    setViewState(viewState);
  }, []);

  const changePitch = useCallback(() => {
    setViewState((prevState) => ({
      ...prevState,
      pitch: prevState.pitch === 0 ? 60 : 0,
    }));
  }, []);
  return (
    <div className={styles.container}>
      <MapComponent
        initialViewState={viewState}
        data={data}
        buildings={buildings}
        maskData={maskData}
        onViewStateChange={handleViewStateChange}
      />
      <div>
        <ViewModePanel changePitch={changePitch} viewState={viewState} />
      </div>
    </div>
  );
}

export default App;
