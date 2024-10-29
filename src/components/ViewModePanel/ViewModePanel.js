import React, { useRef } from "react";
import styles from "./ViewModePanel.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCube,
  faSquare,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faRotateRight,
  faRotateLeft,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

const ViewModePanel = ({
  changePitch,
  changeZoom,
  rotateView,
  move,
  viewState,
}) => {
  const isPlanView = viewState.pitch === 0;
  const nextMode = isPlanView ? "perspective view" : "plan view";

  const moveIntervalRef = useRef(null);

  const handleMouseDown = (direction) => {
    move(direction); // Initial move
    moveIntervalRef.current = setInterval(() => {
      move(direction);
    }, 100); // Adjust the interval as needed
  };

  const handleMouseUp = () => {
    clearInterval(moveIntervalRef.current);
  };
  return (
    <div className={styles["control-panel"]}>
      <button
        onClick={() => changePitch()}
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
      <button
        onMouseDown={() => handleMouseDown(1)}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        aria-label="Move forward"
        title="Move forward"
      >
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
      <button
        onMouseDown={() => handleMouseDown(-1)}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        aria-label="Move backward"
        title="Move backward"
      >
        <FontAwesomeIcon icon={faArrowDown} />
      </button>
    </div>
  );
};

<FontAwesomeIcon icon={faRotateRight} />;

export default ViewModePanel;
