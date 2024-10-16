// src/components/MapComponent.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import MapComponent from "./MapComponent";
import initialViewState from "../initialViewState";

jest.mock("react-map-gl", () => ({
  Map: ({ mapboxAccessToken }) => (
    <div data-testid="map" data-access-token={mapboxAccessToken} />
  ),
}));

jest.mock("deck.gl", () => ({
  DeckGL: ({ children }) => <div data-testid="deckgl">{children}</div>,
}));

describe("MapComponent", () => {
  it("renders without crashing", () => {
    render(<MapComponent initialViewState={initialViewState} />);
    expect(screen.getByTestId("deckgl")).toBeInTheDocument();
    expect(screen.getByTestId("map")).toBeInTheDocument();
  });

  it("passes the correct access token to the Map component", () => {
    render(<MapComponent initialViewState={initialViewState} />);
    const mapElement = screen.getByTestId("map");
    expect(mapElement).toHaveAttribute(
      "data-access-token",
      process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
    );
  });
});
