import React, { useState, useRef, useEffect } from "react";
import styles from "../css/Header.module.css";

export default function UserInfo() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Your logout logic here
    console.log("Logging out...");
    // e.g., clear token, redirect, etc.
  };

  return (
    <div className={styles.userInfoWrapper} ref={dropdownRef}>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a879925be3c25e2c332006a3b64008be0c1ac1c?placeholderIfAbsent=true&apiKey=a08a181f712042cc9dfa58083dc0c568"
        alt="User Avatar"
        className={styles.img3}
        onClick={toggleDropdown}
        style={{ cursor: "pointer" }}
      />
      {isDropdownOpen && (
        <div className={styles.dropdownMenuUser}>
          <button className={styles.dropdownItem} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
