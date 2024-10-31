import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { FlyToInterpolator, WebMercatorViewport } from "@deck.gl/core";
import SearchBox from "./components/SearchBox/SearchBox";
import MapComponent from "./components/MapComponent/MapComponent";
import Character from "./components/Character/Character";
import initialViewState from "./initialViewState";
import { generateCirclePolygon } from "./utils/generateMask";
import styles from "./App.module.css";
import ViewModePanel from "./components/ViewModePanel/ViewModePanel";
import Logo from "./components/Logo/Logo";
import GameSettings from "./components/GameSettings/GameSettings";

const App = () => {
  // State variables
  const [data, setData] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [viewState, setViewState] = useState(initialViewState);
  const [maskData, setMaskData] = useState([]);
  const [isMoving, setIsMoving] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [direction, setDirection] = useState(0);
  const [markers, setMarkers] = useState([]);

  // Fetch buildings data
  const fetchBuildings = useCallback(async () => {
    try {
      const response = await fetch("/buildings-main.geojson");
      const data = await response.json();
      const buildings = data.features.map((feature) => {
        const coordinates = feature.geometry.coordinates[0];
        const name =
          feature.properties?.["name:en"] ||
          feature.properties?.["name"] ||
          "Unknown";
        const height = feature.properties["building:levels"]
          ? parseInt(feature.properties["building:levels"], 10) * 3
          : 10;
        return { name, polygon: coordinates, height };
      });
      setBuildings(buildings);
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  }, []);

  // Fetch points of interest (POIs) data
  const fetchPOIs = useCallback(async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/pos`);
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

  // Fetch data on component mount
  useEffect(() => {
    fetchPOIs();
    fetchBuildings();
  }, [fetchPOIs, fetchBuildings]);

  // Memoize mask data
  const maskDataMemo = useMemo(() => {
    const polygon = generateCirclePolygon(
      viewState.longitude,
      viewState.latitude,
      800
    );
    return [{ polygon }];
  }, [viewState]);

  // Update mask data when memoized data changes
  useEffect(() => {
    setMaskData(maskDataMemo);
  }, [maskDataMemo]);

  // load markers from local storage
  useEffect(() => {
    const savedMarkers = localStorage.getItem("mapMarkers");
    // if (savedMarkers) {
    //   const parsedMarkers = JSON.parse(savedMarkers);
    //   setMarkers(parsedMarkers);

    //   if (parsedMarkers.length > 0) {
    //     const lastMarker = parsedMarkers[parsedMarkers.length - 1];
    //     setViewState((prev) => ({
    //       ...prev,
    //       longitude: lastMarker.position[0],
    //       latitude: lastMarker.position[1],
    //     }));
    //   }
    // }
  }, []);

  const generateMarkerId = () => {
    return `marker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const deleteMarker = (markerId) => {
    setMarkers((prevMarkers) => prevMarkers.filter((m) => m.id !== markerId));
  };

  // Add a new marker at the center of the current view
  const addMarker = () => {
    const newMarker = {
      id: generateMarkerId(),
      position: [viewState.longitude, viewState.latitude, 40],
      name: `Marker ${markers.length + 1}`,
      size: 225,
    };
    setMarkers((prevMarkers) => {
      const updatedMarkers = [...prevMarkers, newMarker];
      localStorage.setItem("mapMarkers", JSON.stringify(updatedMarkers)); // Save to local storage
      return updatedMarkers;
    });
  };

  // Handle view state changes
  const handleViewStateChange = useCallback(({ viewState }) => {
    setViewState(viewState);
  }, []);

  // Change pitch of the view
  const changePitch = useCallback(() => {
    setViewState((prevState) => ({
      ...prevState,
      pitch: prevState.pitch === 0 ? 60 : 0,
      transitionInterpolator: new FlyToInterpolator({ speed: 1.5 }),
      transitionDuration: 1000,
    }));
  }, []);

  // Custom easing function
  const customEase = (t) => t * t * (3 - 2 * t);

  // Change zoom level
  const changeZoom = useCallback((direction) => {
    setViewState((prevState) => ({
      ...prevState,
      zoom: prevState.zoom + direction,
      transitionInterpolator: new FlyToInterpolator({ speed: 2.5 }),
      transitionDuration: 800,
      transitionEasing: customEase,
    }));
  }, []);

  // Rotate the view
  const rotateView = useCallback((direction) => {
    setViewState((prevState) => ({
      ...prevState,
      bearing: prevState.bearing - direction,
      transitionInterpolator: new FlyToInterpolator({ speed: 2.0 }),
      transitionDuration: 300,
    }));
  }, []);

  // Move the view in a specified direction
  const move = useCallback((direction) => {
    setDirection(direction);
    setViewState((prevState) => {
      const distance = 0.005 * direction;
      const bearingRad = (prevState.bearing * Math.PI) / 180;
      const pitchRad = (prevState.pitch * Math.PI) / 180;
      const groundDistance = distance * Math.cos(pitchRad);
      const newLongitude =
        prevState.longitude + groundDistance * Math.sin(bearingRad);
      const newLatitude =
        prevState.latitude + groundDistance * Math.cos(bearingRad);
      return {
        ...prevState,
        longitude: newLongitude,
        latitude: newLatitude,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: (t) => t * (2 - t),
      };
    });
    setMoveCount((count) => count + 1);
  }, []);

  // Fly to a specific point of interest (POI)
  const handleFlyTo = (poi) => {
    setViewState({
      ...viewState,
      longitude: poi.coordinates[0],
      latitude: poi.coordinates[1],
      zoom: 15,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 2000,
    });
  };

  // Model geographical position
  const modelGeoPosition = { longitude: -122.45, latitude: 37.78, height: 100 };

  // Convert geographical coordinates to world coordinates
  const convertGeoToWorld = (longitude, latitude, height) => {
    const viewport = new WebMercatorViewport(viewState);
    const [x, y] = viewport.projectFlat([longitude, latitude]);
    return [x, y, height];
  };

  const modelPosition = convertGeoToWorld(
    modelGeoPosition.longitude,
    modelGeoPosition.latitude,
    modelGeoPosition.height
  );

  return (
    <div className={styles.container}>
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 10,
        }}
        camera={{ fov: 10, position: [0, 0, 10] }}
      >
        <ambientLight />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Character
          deckViewState={viewState}
          position={modelPosition}
          moveCount={moveCount}
          direction={direction}
          isMoving={isMoving}
        />
      </Canvas>

      <MapComponent
        initialViewState={viewState}
        viewState={viewState}
        data={data}
        buildings={buildings}
        maskData={maskData}
        onViewStateChange={handleViewStateChange}
        markers={markers}
      />
      <div className={styles.controlPanelContainer}>
        <Logo />
        <ViewModePanel
          changePitch={changePitch}
          changeZoom={changeZoom}
          viewState={viewState}
          rotateView={rotateView}
          move={move}
          setIsMoving={setIsMoving}
        />
        <SearchBox pointsOfInterest={data} flyTo={handleFlyTo} />
        <GameSettings addMarker={addMarker} />
      </div>
    </div>
  );
};

export default App;
