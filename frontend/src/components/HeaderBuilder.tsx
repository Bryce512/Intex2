// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import styles from "../css/Header.module.css";
// import Dropdown from "./GenreFilterDropdown"; // Import the Dropdown component

import { useState, useRef, useEffect } from "react";
import AllMoviesDropdown from "./DropdownButton";
import SearchBar from "./SearchBar";
import UserInfo from "./UserInfo";
import styles from "../css/Header.module.css"

// export default function Header() {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const allMoviesBtnRef = useRef<HTMLButtonElement | null>(null); // Ref for the "All Movies" button
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

//   // Toggle the dropdown open/close
//   const toggleDropdown = () => {
//     setIsDropdownOpen((prev) => !prev);
//   };

//   // Calculate the position of the dropdown when the component mounts and when toggled
//   useEffect(() => {
//     if (allMoviesBtnRef.current) {
//       const rect = allMoviesBtnRef.current.getBoundingClientRect();
//       setDropdownPosition({
//         top: rect.bottom + window.scrollY + 10, // Position dropdown below the button
//         left: rect.left + window.scrollX, // Align left with the button
//       });
//     }
//   }, [isDropdownOpen]); // Recalculate the position when dropdown is toggled

//   return (
//     <header className={styles.header}>
//       {/* Logo */}
//       <img
//          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b0e4a24ed76b8821c34548fabb0ba032d854f233?placeholderIfAbsent=true&apiKey=a08a181f712042cc9dfa58083dc0c568"
//          alt="Logo"
//          className={styles.img}
//       />

//       {/* Search bar */}
//       <div className={styles.searchbar}>
//         <div className={styles.stateLayer}>
//           <input
//             type="text"
//             placeholder="Search movie titles..."
//             className={styles.searchInput}
//           />
//         </div>
//       </div>

//       {/* "All Movies" Button that triggers the dropdown */}
//       <button
//         className={styles.moviesButton}
//         ref={allMoviesBtnRef} // Attach ref to the "All Movies" button
//         onClick={toggleDropdown} // Toggle dropdown on click
//       >
//         All Movies
//       </button>

//       {/* User Info */}
//       <div className={styles.welcomeWrapper}>
//         <p className={styles.userInfo}>Welcome, User</p>
//         <img
//           src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a879925be3c25e2c332006a3b64008be0c1ac1c?placeholderIfAbsent=true&apiKey=a08a181f712042cc9dfa58083dc0c568"
//           alt="User Avatar"
//           className={styles.img3}
//         />
//       </div>

//       {/* Conditionally render the dropdown */}
//       {isDropdownOpen && (
//         <Dropdown
//           dropdownPosition={dropdownPosition} // Pass dropdown position to the Dropdown component
//         />
//       )}
//     </header>
//   );
// }
// Header.tsx
export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const allMoviesBtnRef = useRef<HTMLButtonElement | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  
    const toggleDropdown = () => {
      setIsDropdownOpen((prev) => !prev);
    };
  
    useEffect(() => {
      if (allMoviesBtnRef.current) {
        const rect = allMoviesBtnRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 10,
          left: rect.left + window.scrollX,
        });
      }
    }, [isDropdownOpen]);
  
    return (
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/b0e4a24ed76b8821c34548fabb0ba032d854f233?placeholderIfAbsent=true&apiKey=a08a181f712042cc9dfa58083dc0c568"
            alt="Logo"
            className={styles.img}
          />
          <SearchBar />
          <div className={styles.rightSection}>
            <AllMoviesDropdown
              ref={allMoviesBtnRef}
              onToggle={toggleDropdown}
              isOpen={isDropdownOpen}
              dropdownPosition={dropdownPosition}
            />
            <UserInfo />
          </div>
        </div>
      </header>
    );
  }
  