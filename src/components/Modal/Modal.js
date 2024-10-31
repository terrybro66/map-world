import React, { useState, useEffect } from "react";
import styles from "./Modal.module.css";

const Modal = ({ onClose, onSave, onDelete, content }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (content) {
      setName(content.name);
      setDescription(content.description);
      setImageUrl(content.imageUrl);
    }
  }, [content]);

  const handleSave = () => {
    onSave(content.id, name, description, imageUrl);
  };

  const handleDelete = () => {
    onDelete(content.id);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{content ? "Edit Marker Details" : "Add Marker Details"}</h2>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Image URL:
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </label>
        {imageUrl && <img src={imageUrl} alt={name} className={styles.image} />}
        <div className={styles.modalActions}>
          <button onClick={handleSave}>Save</button>
          {content && <button onClick={handleDelete}>Delete</button>}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
