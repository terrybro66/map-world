import { Map } from "react-map-gl";
import { DeckGL, ScatterplotLayer, PolygonLayer, IconLayer } from "deck.gl";
import { MaskExtension } from "@deck.gl/extensions";
import styles from "./MapComponent.module.css";
import mapIcon from "../../images/map-icon.png";

const MapComponent = ({
  initialViewState,
  viewState,
  data,
  buildings,
  maskData, // Default to sample data if maskData is not provided
  onViewStateChange,
  markers,
  selectedMarker,
  setSelectedMarker,
  dragStart,
  drag,
  dragEnd,
}) => {
  const elevationOffset = 100; // Adjust this value to your desired height
  const buildingAdjustment = 1.3; // Adjust this value to your desired height

  const scatterplotLayer = new ScatterplotLayer({
    id: "POIs",
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
    id: "Buildings",
    data: buildings,
    extruded: true, // This is crucial for 3D extrusion
    getPolygon: (d) => d.polygon,
    getFillColor: [0, 0, 255, 100],
    getLineColor: [0, 0, 0, 255],

    getElevation: (d) => d.height * buildingAdjustment,
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
  const iconMapping = {
    marker: { x: 0, y: 0, width: 225, height: 225, anchorY: 225 },
  };
  const ICON_URL = mapIcon; // Replace with your desired icon URL

  const getIconSize = () => {
    return Math.max(10, 20 - viewState.zoom); // Example scaling logic
  };

  const scatterLayer2 = new IconLayer({
    id: "icon-layer",
    data: markers,
    pickable: true,
    iconAtlas: ICON_URL, // URL to the icon image
    iconMapping,
    getIcon: () => "marker",
    getPosition: (d) => d.position,
    getSize: () => getIconSize(), // Use size specified in data
    sizeScale: 10, // Scale factor, adjust as needed
    onClick: (info) => {
      setSelectedMarker(info.object); // Pass the entire marker object
    },
  });

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
  const getCursor = () => {
    return "pointer";
  };

  return (
    <div className={styles.container}>
      <DeckGL
        initialViewState={initialViewState}
        controller={{
          // Custom cursor style to use pointer
          dragPan: false,
          dragRotate: false,
          scrollZoom: true,
          doubleClickZoom: false,
          touchRotate: false,
        }}
        layers={[scatterplotLayer, polygonLayer, maskLayer, scatterLayer2]}
        onViewStateChange={onViewStateChange}
        getCursor={getCursor}
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
