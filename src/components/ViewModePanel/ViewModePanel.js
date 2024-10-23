import React from "react";
import styles from "./ViewModePanel.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCube,
  faSquare,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faRotateRight,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

const ViewModePanel = ({ changePitch, changeZoom, rotateView, viewState }) => {
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
      <button
        onClick={() => changeZoom(2)} // Wrap in an anonymous function
        aria-label="Zoom in"
        title="Zoom in"
      >
        <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
      </button>
      <button
        onClick={() => changeZoom(-2)} // Wrap in an anonymous function
        aria-label="Zoom out"
        title="Zoom out"
      >
        <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
      </button>
      <button
        onClick={() => rotateView(15)} // Wrap in an anonymous function
      >
        <FontAwesomeIcon icon={faRotateLeft} />
      </button>
      <button
        onClick={() => rotateView(-15)} // Wrap in an anonymous function
      >
        <FontAwesomeIcon icon={faRotateRight} />
      </button>
    </div>
  );
};

<FontAwesomeIcon icon={faRotateRight} />;

export default ViewModePanel;
