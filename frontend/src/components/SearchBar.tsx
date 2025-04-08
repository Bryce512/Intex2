import React from "react";
import styles from "../css/Header.module.css";

export default function SearchBar() {
  return (
    <div className={styles.searchbar}>
      <div className={styles.stateLayer}>
        <input
          type="text"
          placeholder="Search movie titles..."
          className={styles.searchInput}
        />
      </div>
    </div>
  );
}
