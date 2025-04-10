import { useState, useRef, useEffect } from 'react';
import styles from '../css/Header.module.css';
import { useNavigate } from 'react-router-dom';

export default function UserInfo() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        'https://intex2-backend-ezargqcgdwbgd4hq.westus3-01.azurewebsites.net/logout',
        {
          method: 'POST',
          credentials: 'include', // 👈 this is important for cookie-based auth
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        console.log('Logout resonse: ', response);
        // Clear any client-side state if needed
        // Redirect user to login or home
        window.location.href = '/login';
      } else {
        console.error('Logout failed:', response);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className={styles.userInfoWrapper} ref={dropdownRef}>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a879925be3c25e2c332006a3b64008be0c1ac1c?placeholderIfAbsent=true&apiKey=a08a181f712042cc9dfa58083dc0c568"
        alt="User Avatar"
        className={styles.img3}
        onClick={toggleDropdown}
        style={{ cursor: 'pointer' }}
      />
      {isDropdownOpen && (
        <div className={styles.dropdownMenuUser}>
          <button
            className={styles.dropdownItem}
            onClick={() => navigate('/Privacy')}
          >
            Privacy Policy
          </button>
          <button className={styles.dropdownItem} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
