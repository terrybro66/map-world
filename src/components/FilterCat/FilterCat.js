import React, { useState } from "react";
import styles from "./FilterCat.module.css";
import mapIcon from "../../images/gears.png";

const FilterCat = ({ categories, onCategoryChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updatedCategories);
    onCategoryChange(updatedCategories);
  };

  return (
    <div
      className={`${styles["control-panel"]} ${
        isExpanded ? styles["expanded"] : ""
      }`}
    >
      <button onClick={togglePanel}>
        <img src={mapIcon} alt="Filter categories" title="Filter categories" />
      </button>
      {isExpanded && (
        <div className={styles["checkbox-container"]}>
          {categories.map((category) => (
            <label key={category}>
              <input
                type="checkbox"
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              {category}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterCat;
