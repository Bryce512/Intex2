import React from "react";
import styles from "../css/Header.module.css";

interface DropdownProps {
  dropdownPosition: { top: number, left: number };
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
      <button className={styles.dropdownItem}>Profile</button>
      <button className={styles.dropdownItem}>Settings</button>
      <button className={styles.dropdownItem}>Logout</button>
    </div>
  );
};

export default Dropdown;
