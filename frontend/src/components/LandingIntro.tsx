import { useState } from 'react';
import '../css/LandingIntro.css';
import RegisterModal from './RegisterModal';
import bannerVideo from '../assets/bannerVideo.mp4'

const LandingIntro = () => {
  const [modalShow, setModalShow] = useState(false);
  const [validated, setValidated] = useState(false);

  return (
    <div className="video-carousel-wrapper full-bleed">
      <div className="video-container">
        <video
          className="video-background"
          src={bannerVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="content-overlay">
          <div className="overlay-content">
            <h1 className="carousel-text">Your Go-To for Niche Movies & TV</h1>
            <h3 className="carousel-subtext">
              Start watching <strong>now</strong>
            </h3>
            {!modalShow && (
              <button className="cta-button" onClick={() => setModalShow(true)}>
                Sign Up
              </button>
            )}

            {modalShow && (
              <RegisterModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                validated={validated}
                setValidated={setValidated}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingIntro;
