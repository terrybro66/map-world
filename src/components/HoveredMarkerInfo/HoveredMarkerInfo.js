import React from "react";
import styles from "./HoveredMarkerInfo.module.css";

const HoveredMarkerInfo = ({ marker, position, onClose }) => {
  return (
    <div
      className={styles.hoveredMarkerInfo}
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      {JSON.stringify(marker)}
      <button onClick={onClose} className={styles.closeButton}>
        Close
      </button>
    </div>
  );
};

export default HoveredMarkerInfo;
