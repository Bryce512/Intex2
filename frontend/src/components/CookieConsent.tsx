import React, { useEffect, useState } from 'react';

const CONSENT_COOKIE = 'cookie_consent_session';
const THANKS_COOKIE = 'cookie_consent_thanks';

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [showThanks, setShowThanks] = useState<boolean>(false);
  const [fadeOut, setFadeOut] = useState<boolean>(false);

  useEffect(() => {
    const consent = getCookie(CONSENT_COOKIE);
    const thanks = getCookie(THANKS_COOKIE);

    if (thanks === 'true') {
      setShowThanks(true);

      // Start fade-out after 2 seconds
      const timer1 = setTimeout(() => {
        setFadeOut(true);
      }, 1000);

      // Fully hide after fade completes (e.g. 0.5s fade)
      const timer2 = setTimeout(() => {
        setShowThanks(false);
      }, 1500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }

    if (!consent) {
      setVisible(true);
    }
  }, []);

  const getCookie = (name: string): string | null => {
    const cookies = document.cookie.split('; ');
    const found = cookies.find((row) => row.startsWith(`${name}=`));
    return found ? found.split('=')[1] : null;
  };

  const handleConsent = (value: 'accepted' | 'rejected') => {
    document.cookie = `${CONSENT_COOKIE}=${value}; path=/; SameSite=Lax`;

    if (value === 'accepted') {
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `${THANKS_COOKIE}=true; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;

      setShowThanks(true);

      setTimeout(() => setFadeOut(true), 2000);
      setTimeout(() => setShowThanks(false), 2500);
    }

    setVisible(false);
  };

  return (
    <>
      {showThanks && (
        <div
          style={{
            ...styles.thanksBanner,
            opacity: fadeOut ? 0 : 1,
            transition: 'opacity 0.5s ease-in-out',
          }}
        >
          🍿 Thanks for supporting <strong>CineNiche</strong>!
        </div>
      )}

      {visible && (
        <div style={styles.banner}>
          <p style={styles.text}>
            We use cookies to personalize content and analyze traffic. Do you
            accept our use of cookies?
          </p>
          <div>
            <button
              onClick={() => handleConsent('accepted')}
              style={{ ...styles.button, backgroundColor: '#4caf50' }}
            >
              Accept
            </button>
            <button
              onClick={() => handleConsent('rejected')}
              style={{ ...styles.button, backgroundColor: '#f44336' }}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  banner: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2c2c2c',
    color: '#fff',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
    flexWrap: 'wrap',
  },
  text: {
    margin: 0,
    flex: 1,
    paddingRight: '10px',
  },
  button: {
    marginLeft: '10px',
    padding: '10px 20px',
    border: 'none',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  thanksBanner: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '10px 20px',
    textAlign: 'center',
    fontWeight: 'bold',
    zIndex: 1100,
    borderBottom: '1px solid #ffeeba',
  },
};

export default CookieConsent;
