import React from "react";
import styles from "../css/Header.module.css";

interface DropdownProps {
  dropdownPosition: { top: number; left: number };
}

const Dropdown: React.FC<DropdownProps> = ({ dropdownPosition }) => {
  return (
    <div
      className={styles.dropdownMenu}
      style={{
        position: "absolute",
        top: dropdownPosition.top + 10, // Space between the button and the dropdown
        left: dropdownPosition.left,
      }}
    >
      <button className={styles.dropdownItem}>All</button>
      <button className={styles.dropdownItem}>Movies</button>
      <button className={styles.dropdownItem}>TV Shows</button>
      <button className={styles.dropdownItem}>Action/Adventure</button>
      <button className={styles.dropdownItem}>Comedies</button>
      <button className={styles.dropdownItem}>Documentaries</button>
      <button className={styles.dropdownItem}>Dramas</button>
      <button className={styles.dropdownItem}>Family Movies</button>
      <button className={styles.dropdownItem}>Fantasy</button>
      <button className={styles.dropdownItem}>Horror</button>
      <button className={styles.dropdownItem}>International</button>
      <button className={styles.dropdownItem}>Kids</button>
      <button className={styles.dropdownItem}>Thriller</button>
    </div>
  );
};

export default Dropdown;
