import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AllMoviesDropdown from "./DropdownButton";
import SearchBar from "./SearchBar";
import UserInfo from "./UserInfo";
import styles from "../css/Header.module.css";

export default function Header() {
  const navigate = useNavigate();

  // You can later pull this from props, context, or auth state
  const isAdmin = false; // Set to true to see the "Manage Movies" button

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b0e4a24ed76b8821c34548fabb0ba032d854f233?placeholderIfAbsent=true&apiKey=a08a181f712042cc9dfa58083dc0c568"
          alt="Logo"
          className={styles.img}
        />

        <div className={styles.rightNav}>
          <button
            className={styles.buttonHeader}
            onClick={() => navigate("/Home")}
          >
            Home
          </button>

          <button
            className={styles.buttonHeader}
            onClick={() => navigate("/All")}
          >
            All Movies/TV
          </button>

          {isAdmin && (
            <button
              className={styles.buttonHeader}
              onClick={() => navigate("/Admin")}
            >
              Manage
            </button>
          )}

          <UserInfo />
        </div>
      </div>
    </header>
  );
}
