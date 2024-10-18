// src/utils/generateMask.js
export const generateCirclePolygon = (
  centerLng,
  centerLat,
  radiusMeters,
  numSegments = 64
) => {
  const coordinates = [];
  for (let i = 0; i <= numSegments; i++) {
    const angle = (i * 2 * Math.PI) / numSegments;
    const dx =
      (radiusMeters / (111000 * Math.cos((centerLat * Math.PI) / 180))) *
      Math.cos(angle);
    const dy = (radiusMeters / 111000) * Math.sin(angle);
    coordinates.push([centerLng + dx, centerLat + dy]);
  }
  return [coordinates]; // Return as an array of coordinates
};
