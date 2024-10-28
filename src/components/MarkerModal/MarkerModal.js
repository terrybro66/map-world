import React, { useState } from "react";
import styles from "./MarkerModal.module.css";

const MarkerModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  const handleSave = () => {
    onSave({ name, image });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Add Marker</h2>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default MarkerModal;
