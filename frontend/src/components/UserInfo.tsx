import React from "react";
import styles from "../css/Header.module.css";

export default function UserInfo() {
  return (
    <div className={styles.welcomeWrapper}>
      <p className={styles.userInfo}>Welcome, User</p>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a879925be3c25e2c332006a3b64008be0c1ac1c?placeholderIfAbsent=true&apiKey=a08a181f712042cc9dfa58083dc0c568"
        alt="User Avatar"
        className={styles.img3}
      />
    </div>
  );
}