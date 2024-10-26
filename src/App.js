import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FlyToInterpolator } from "@deck.gl/core";
import SearchBox from "./components/SearchBox/SearchBox";
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

  const fetchBuildings = useCallback(async () => {
    try {
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
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  }, []);

  const fetchPOIs = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchPOIs();
    fetchBuildings();
  }, [fetchPOIs, fetchBuildings]);

  const maskDataMemo = useMemo(() => {
    const polygon = generateCirclePolygon(
      viewState.longitude,
      viewState.latitude,
      800
    );
    return [{ polygon }];
  }, [viewState]);

  useEffect(() => {
    setMaskData(maskDataMemo);
  }, [maskDataMemo]);

  const handleViewStateChange = useCallback(({ viewState }) => {
    setViewState(viewState);
  }, []);

  const changePitch = useCallback(() => {
    setViewState((prevState) => ({
      ...prevState,
      pitch: prevState.pitch === 0 ? 60 : 0,
      transitionInterpolator: new FlyToInterpolator({ speed: 1.5 }), // Smooth pitch change with FlyToInterpolator
      transitionDuration: 1000, // 1 second transition
    }));
  }, []);

  const customEase = (t) => t * t * (3 - 2 * t); // Custom easeInOut

  const changeZoom = useCallback((direction) => {
    setViewState((prevState) => ({
      ...prevState,
      zoom: prevState.zoom + direction,
      transitionInterpolator: new FlyToInterpolator({ speed: 2.5 }),
      transitionDuration: 800,
      transitionEasing: customEase, // Apply custom easing
    }));
  }, []);

  const rotateView = useCallback((direction) => {
    setViewState((prevState) => ({
      ...prevState,
      bearing: prevState.bearing + direction,
      transitionInterpolator: new FlyToInterpolator({
        speed: 1.5,
      }),
      transitionDuration: 300, // 1 second transition
    }));
  }, []);
  const move = useCallback((direction) => {
    setViewState((prevState) => {
      // Base distance in degrees (approximately 500 meters at equator)
      const distance = 0.005 * direction;

      // Convert angles to radians
      const bearingRad = (prevState.bearing * Math.PI) / 180;
      const pitchRad = (prevState.pitch * Math.PI) / 180;

      // Calculate the ground distance (accounting for pitch)
      const groundDistance = distance * Math.cos(pitchRad);

      // Calculate new coordinates
      const newLongitude =
        prevState.longitude + groundDistance * Math.sin(bearingRad);
      const newLatitude =
        prevState.latitude + groundDistance * Math.cos(bearingRad);

      return {
        ...prevState,
        longitude: newLongitude,
        latitude: newLatitude,
        // Only use transition properties if you want smooth animation
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: (t) => t * (2 - t), // Ease out function for smoother motion
      };
    });
  }, []);

  const handleFlyTo = (poi) => {
    setViewState({
      ...viewState,
      longitude: poi.coordinates[0],
      latitude: poi.coordinates[1],
      zoom: 15,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 1500,
    });
  };

  return (
    <div className={styles.container}>
      <MapComponent
        initialViewState={viewState}
        data={data}
        buildings={buildings}
        maskData={maskData}
        onViewStateChange={handleViewStateChange}
      />
      <div className={styles.controlPanelContainer}>
        <ViewModePanel
          changePitch={changePitch}
          changeZoom={changeZoom}
          viewState={viewState}
          rotateView={rotateView}
          move={move}
        />

        <SearchBox pointsOfInterest={data} flyTo={handleFlyTo} />
      </div>
    </div>
  );
}

export default App;
