"use client";
import * as React from "react";
import styles from "./Header.module.css";
import "../css/header.css";

export default function Header() {
  return (
    <header className={styles.header}>
      {/* Logo */}
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/b0e4a24ed76b8821c34548fabb0ba032d854f233?placeholderIfAbsent=true&apiKey=a08a181f712042cc9dfa58083dc0c568"
        alt="Logo"
        className={styles.img}
      />

      {/* Search Bar */}
      <div className={styles.searchbar}>
        <div className={styles.stateLayer}>
          <input
            type="text"
            placeholder="Search Movie Titles..."
            className={styles.searchInput}
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/477195b5f894b2a4f64a0966148a3829af02968d?placeholderIfAbsent=true&apiKey=a08a181f712042cc9dfa58083dc0c568"
            alt="Search Icon"
            className={styles.img2}
          />
        </div>
      </div>

      {/* Centered Welcome Text */}
      <div className={styles.welcomeWrapper}>
        <p className={styles.userInfo}>Welcome, User</p>
      </div>

      {/* User Avatar */}
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a879925be3c25e2c332006a3b64008be0c1ac1c?placeholderIfAbsent=true&apiKey=a08a181f712042cc9dfa58083dc0c568"
        alt="User Avatar"
        className={styles.img3}
      />
    </header>
  );
}
