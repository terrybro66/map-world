// src/components/MapComponent.js
import React from "react";
import { Map } from "react-map-gl";
import { DeckGL, ScatterplotLayer } from "deck.gl";

const MapComponent = ({ initialViewState, data }) => {
  const scatterplotLayer = new ScatterplotLayer({
    id: "scatterplot-layer",
    data,
    getPosition: (d) => d.coordinates,
    getFillColor: [255, 140, 0],
    getRadius: 10,
    pickable: true,
    radiusScale: 10,
    radiusMinPixels: 5,
    radiusMaxPixels: 100,
  });

  return (
    <DeckGL
      initialViewState={initialViewState}
      controller={true}
      layers={[scatterplotLayer]}
    >
      <Map
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      />
    </DeckGL>
  );
};

export default MapComponent;
