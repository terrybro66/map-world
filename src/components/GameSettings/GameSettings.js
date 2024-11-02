import React from "react";
import styles from "./GameSettings.module.css";
import mapIcon from "../../images/map-icon.png";

const GameSettings = ({ openModal }) => {
  return (
    <div className={styles["control-panel"]}>
      <button onClick={openModal}>
        <img src={mapIcon} alt="Add a marker" title="Add a marker" />
      </button>
    </div>
  );
};

export default GameSettings;
