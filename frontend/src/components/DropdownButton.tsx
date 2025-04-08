import React, { useRef, useState, forwardRef, useEffect } from "react";
import styles from "../css/Header.module.css";
import GenreFilterDropdown from "./GenreFilterDropdown";

type Props = {
  onToggle: () => void;
  isOpen: boolean;
  dropdownPosition: { top: number; left: number };
};

const AllMoviesDropdown = forwardRef<HTMLButtonElement, Props>(
  ({ onToggle, isOpen, dropdownPosition }, ref) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [calculatedPosition, setCalculatedPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setCalculatedPosition({
          top: rect.bottom + window.scrollY, // Position the dropdown below the button
          left: rect.left + window.scrollX,  // Align the dropdown with the button
        });
      }
    }, [isOpen]);  // Recalculate position when the dropdown is toggled

    return (
      <>
        <button
          className={styles.moviesButton}
          ref={buttonRef}
          onClick={onToggle}
        >
          All Movies
        </button>
        {isOpen && <GenreFilterDropdown dropdownPosition={calculatedPosition} />}
      </>
    );
  }
);

export default AllMoviesDropdown;
