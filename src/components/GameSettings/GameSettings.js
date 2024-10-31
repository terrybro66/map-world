import React from "react";
import styles from "./GameSettings.module.css";
import mapIcon from "../../images/map-icon.png";

const GameSettings = ({ addMarker }) => {
  return (
    <div className={styles["control-panel"]}>
      <button onClick={addMarker}>
        <img src={mapIcon} alt="Add a marker" title="Add a marker" />
      </button>
    </div>
  );
};

export default GameSettings;
