

import '../css/LandingIntro.css';
import bannerVideo from '../assets/bannerVideo.mp4'
import { useNavigate } from 'react-router-dom';

const TopMovieRecommendation = () => {
  const navigate = useNavigate();

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
            <h1 className="carousel-text">All Your Favorites</h1>
            <h3 className="carousel-subtext">
              In one place
            </h3>
              <button className="cta-button" onClick={() => navigate('/All')}>
                Start Browsing
              </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TopMovieRecommendation;
