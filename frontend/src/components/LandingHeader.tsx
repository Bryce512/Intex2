import { useNavigate } from 'react-router-dom';
import styles from '../css/Header.module.css';

function LandingHeader() {
  const navigate = useNavigate();
  
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
            onClick={() => navigate('/login')}
          >
            Login
          </button>

          <button
            className={styles.buttonHeader}
            onClick={() => navigate('/Create')}
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}

export default LandingHeader;