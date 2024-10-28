// src/components/MapComponent.js
import React, { useState, useEffect } from "react";
import { Map } from "react-map-gl";
import {
  DeckGL,
  ScatterplotLayer,
  PolygonLayer,
  ScenegraphLayer,
  IconLayer,
} from "deck.gl";
import { MaskExtension } from "@deck.gl/extensions";
import styles from "./MapComponent.module.css";
import MarkerModal from "../MarkerModal/MarkerModal";

const MapComponent = ({
  initialViewState,
  data,
  buildings,
  maskData, // Default to sample data if maskData is not provided
  onViewStateChange,
}) => {
  const elevationOffset = 100; // Adjust this value to your desired height

  const [markers, setMarkers] = useState(() => {
    // Load markers from localStorage if they exist
    const savedMarkers = localStorage.getItem("markers");
    return savedMarkers ? JSON.parse(savedMarkers) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMarker, setNewMarker] = useState(null);

  useEffect(() => {
    // Save markers to localStorage whenever they change
    localStorage.setItem("markers", JSON.stringify(markers));
  }, [markers]);

  const scatterplotLayer = new ScatterplotLayer({
    id: "scatterplot-layer",
    data,
    getPosition: (d) => [...d.coordinates, elevationOffset], // Add z-axis (elevation)
    getFillColor: [255, 140, 0, 160],
    getLineColor: [0, 0, 0, 255],
    getRadius: 50,
    pickable: true,
    radiusScale: 10,
    radiusMinPixels: 5,
    radiusMaxPixels: 100,
  });

  const polygonLayer = new PolygonLayer({
    id: "polygon-layer",
    data: buildings,
    extruded: true, // This is crucial for 3D extrusion
    getPolygon: (d) => d.polygon,
    getFillColor: [0, 0, 255, 100],
    getLineColor: [0, 0, 0, 255],

    getElevation: (d) => d.height,
    pickable: true,
    autoHighlight: true,
    wireframe: true, // This will show the edges of the polygons
    elevationScale: 1, // Adjust this if you need to scale the heights
    transitions: {
      getElevation: {
        duration: 1000,
        type: "spring",
      },
    },
    material: {
      ambient: 0.64,
      diffuse: 0.6,
      shininess: 32,
      specularColor: [51, 51, 51],
    },

    extensions: [new MaskExtension({ maskByInstance: false })],

    maskId: "mask-layer",
  });

  const maskLayer = new PolygonLayer({
    id: "mask-layer",
    data: maskData,
    getPolygon: (d) => d.polygon,
    getFillColor: [0, 0, 0, 255],
    operation: "mask",
  });

  const scenegraphLayer = new ScenegraphLayer({
    id: "scenegraph-layer",
    data: [
      {
        position: [initialViewState.longitude, initialViewState.latitude],
        scale: 10,
        orientation: [0, 0, 0], // You could move orientation to data object
      },
    ],
    scenegraph: process.env.PUBLIC_URL + "/Soldier.glb",
    getPosition: (d) => d.position,
    getOrientation: (d) => d.orientation, // Make it dynamic per object
    getScale: (d) => [d.scale, d.scale, d.scale],
    sizeScale: 1000,
    _lighting: "pbr",
    pickable: true,
  });

  const iconLayer = new IconLayer({
    id: "icon-layer",
    data: markers,
    getPosition: (d) => [d.longitude, d.latitude, d.elevation || 100],
    getIcon: (d) => ({
      url: process.env.PUBLIC_URL + "/map-icon.png",
      width: 128,
      height: 128,
      anchorY: 128,
    }),
    sizeScale: 85,
    pickable: true,
  });

  const clearMarkers = () => {
    setMarkers([]);
  };

  window.clearMarkers = clearMarkers;

  const getTooltip = ({ object }) => {
    if (!object) {
      return null;
    }

    return {
      html: `
              <div class="${styles.bname}">
          <strong>${object.name}</strong><br/>
          ${
            object.imageUrl
              ? `<img src="${object.imageUrl}" alt="${object.name}" style="max-width: 200px; max-height: 200px;"/>`
              : ""
          }
        </div>
      `,
    };
  };

  const handleMapClick = (event) => {
    console.log(event.coordinate);
    const [longitude, latitude] = event.coordinate;
    setNewMarker({ longitude, latitude });
    setIsModalOpen(true);
  };

  const handleSaveMarker = ({ name, elevation, image }) => {
    const reader = new FileReader();
    reader.onload = (upload) => {
      const imageUrl = upload.target.result;
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        {
          id: Date.now(),
          longitude: newMarker.longitude,
          latitude: newMarker.latitude,
          elevation,
          name,
          imageUrl,
        },
      ]);
    };
    if (image) {
      reader.readAsDataURL(image);
    } else {
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        {
          id: Date.now(),
          longitude: newMarker.longitude,
          latitude: newMarker.latitude,
          elevation,
          name,
        },
      ]);
    }
  };

  return (
    <div className={styles.container}>
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={[
          scatterplotLayer,
          polygonLayer,
          maskLayer,
          scenegraphLayer,
          iconLayer,
        ]}
        onClick={handleMapClick}
        onViewStateChange={onViewStateChange}
        getTooltip={getTooltip}
        className={styles["container"]}
      >
        <Map
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>
      <MarkerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMarker}
      />
    </div>
  );
};

export default MapComponent;
