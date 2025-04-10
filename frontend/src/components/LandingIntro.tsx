import { useEffect, useRef, useState } from 'react';
import '../css/LandingIntro.css';
import RegisterModal from './RegisterModal';

// Declare YouTube Player API global
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

const LandingIntro = () => {
  const videoId = '22QAcwuGqFs';
  const videos = [
    `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&loop=1&playlist=${videoId}`,
  ];

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const isManualChangeRef = useRef(false);
  const [modalShow, setModalShow] = useState(false);
  const [validated, setValidated] = useState(false);

  // Initialize YouTube player
  useEffect(() => {
    const loadYouTubeAPI = () => {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    };

    if (!window.YT) {
      loadYouTubeAPI();
    }

    window.onYouTubeIframeAPIReady = initializePlayer;

    return () => {
      window.onYouTubeIframeAPIReady = () => {};
    };
  }, []);

  const initializePlayer = () => {
    if (iframeRef.current) {
      new window.YT.Player(iframeRef.current, {
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    }
  };

  const onPlayerReady = (event: YT.PlayerEvent) => {
    event.target.playVideo();
  };

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    if (event.data === YT.PlayerState.ENDED && !isManualChangeRef.current) {
      event.target.playVideo();
    }
  };

  return (
    <div className="video-carousel-wrapper full-bleed">
      <div className="video-container">
        <iframe
          ref={iframeRef}
          src={videos[0]}
          title="Video"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="video-iframe"
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
