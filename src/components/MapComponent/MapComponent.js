// src/components/MapComponent.js
import React, { useState } from "react";
import { Map } from "react-map-gl";
import { DeckGL, ScatterplotLayer, PolygonLayer } from "deck.gl";
import { MaskExtension } from "@deck.gl/extensions";
import styles from "./MapComponent.module.css";

const MapComponent = ({
  initialViewState,
  data,
  buildings,
  maskData, // Default to sample data if maskData is not provided
  onViewStateChange,
}) => {
  const elevationOffset = 100; // Adjust this value to your desired height

  const scatterplotLayer = new ScatterplotLayer({
    id: "scatterplot-layer",
    data,
    getPosition: (d) => [...d.coordinates, elevationOffset], // Add z-axis (elevation)
    getFillColor: [255, 140, 0, 200],
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

  const getTooltip = ({ object }) => {
    if (!object) {
      return null;
    }

    return {
      html: `
        <div class="${styles.bname}">
          ${object.name}
        </div>
      `,
    };
  };

  return (
    <div className={styles.container}>
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={[scatterplotLayer, polygonLayer, maskLayer]}
        onViewStateChange={onViewStateChange}
        getTooltip={getTooltip}
        className={styles["container"]}
      >
        <Map
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>
    </div>
  );
};

export default MapComponent;
