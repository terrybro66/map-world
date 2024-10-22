import React from "react";
import styles from "./ViewModePanel.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube, faSquare } from "@fortawesome/free-solid-svg-icons";

const ViewModePanel = ({ changePitch, viewState }) => {
  const isPlanView = viewState.pitch === 0;
  const nextMode = isPlanView ? "perspective view" : "plan view";

  return (
    <div className={styles["control-panel"]}>
      <button
        onClick={changePitch}
        aria-label={`Change to ${nextMode}`}
        title={`Change to ${nextMode}`}
      >
        <FontAwesomeIcon icon={isPlanView ? faSquare : faCube} />
      </button>
    </div>
  );
};

export default ViewModePanel;
