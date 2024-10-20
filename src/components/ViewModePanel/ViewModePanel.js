import React from "react";
import styles from "./ViewModePanel.module.css";

const ViewModePanel = ({ changePitch, viewState }) => {
  return (
    <div className={styles["control-panel"]}>
      <button onClick={changePitch}>
        Switch to {viewState.pitch === 0 ? "60°" : "0°"} Pitch
      </button>
    </div>
  );
};

export default ViewModePanel;
