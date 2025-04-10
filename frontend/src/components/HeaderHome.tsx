import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserRoles } from '../api/moviesAPI'; // update this import path based on where you defined it
import UserInfo from './UserInfo';
import styles from '../css/Header.module.css';

export default function Header() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const roles = await fetchUserRoles();
        setIsAdmin(roles.includes('admin'));
      } catch (error) {
        console.error('Failed to fetch roles:', error);
        setIsAdmin(false); // fallback: treat as not admin
      }
    };

    checkAdminRole();
  }, []);

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
            onClick={() => navigate('/Home')}
          >
            Home
          </button>

          <button
            className={styles.buttonHeader}
            onClick={() => navigate('/All')}
          >
            All Movies/TV
          </button>

          {isAdmin && (
            <button
              className={styles.buttonHeader}
              onClick={() => navigate('/Admin')}
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
