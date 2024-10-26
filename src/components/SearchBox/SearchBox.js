// src/components/SearchBox.js
import React, { useState, useEffect } from "react";
import styles from "./SearchBox.module.css";

const SearchBox = ({ pointsOfInterest, flyTo }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPointsOfInterest, setFilteredPointsOfInterest] = useState([]);

  useEffect(() => {
    setFilteredPointsOfInterest(
      pointsOfInterest.filter((poi) =>
        poi.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, pointsOfInterest]);

  const handleFlyTo = (poi) => {
    console.log("Flying to", poi);
    flyTo(poi);
    setSearchTerm("");
  };

  return (
    <div className={styles.searchBox}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <div className={styles.poiContainer}>
          <ul className={styles.poiList}>
            {filteredPointsOfInterest.map((poi) => (
              <li key={poi.name}>
                <button onClick={() => handleFlyTo(poi)}>{poi.name}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBox;
