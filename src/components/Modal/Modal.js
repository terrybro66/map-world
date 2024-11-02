// Modal.js
import React, { useRef } from "react";
import styles from "./Modal.module.css";

const Modal = ({ onClose, onSave, isEditing, markerData, onDelete }) => {
  const nameRef = useRef();
  const descriptionRef = useRef();
  const idRef = useRef();

  // Populate form fields if editing
  const initialName = isEditing ? markerData.name : "";
  const initialDescription = isEditing ? markerData.description : "";
  const markerId = isEditing ? markerData.id : "";

  const handleSave = () => {
    const name = nameRef.current.value;
    const description = descriptionRef.current.value;
    const id = idRef.current ? idRef.current.value : null;
    onSave(name, description, id);
  };

  const handleDelete = () => {
    const id = idRef.current ? idRef.current.value : null;
    onDelete(id);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{isEditing ? "Edit Marker" : "Create New Marker"}</h2>
        <form>
          <label>
            Name:
            <input type="text" defaultValue={initialName} ref={nameRef} />
          </label>
          <label>
            Description:
            <input
              type="text"
              defaultValue={initialDescription}
              ref={descriptionRef}
            />
          </label>
          {isEditing && (
            <input type="hidden" defaultValue={markerId} ref={idRef} />
          )}
        </form>
        <div className={styles.modalActions}>
          <button onClick={handleSave}>
            {isEditing ? "Update" : "Create"}
          </button>
          <button onClick={onClose}>Cancel</button>
          {isEditing && <button onClick={handleDelete}>Delete</button>}
        </div>
      </div>
    </div>
  );
};

export default Modal;
