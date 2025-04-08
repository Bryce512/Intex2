'use client';
import styles from '../css/TopMovie.module.css';

/**
 * TopMovieRecommendation component displays the #1 watched movie globally
 * with an image and details in a responsive layout
 */
function TopMovieRecommendation() {
  return (
    <section className={styles.recommendationContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.imageColumn}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d649bed2003d146a5e11396e53c280e5534f1de2?placeholderIfAbsent=true&apiKey=1d4cf9c17b5e49bab59666098f731bc6"
            alt="Top movie poster"
            className={styles.moviePoster}
          />
        </div>
        <div className={styles.detailsColumn}>
          <article className={styles.movieDetails}>
            <h2 className={styles.movieTitle}>#1 Watched Movie Globally </h2>

            <p className={styles.movieDescription}>
              Before Dorothy ever arrived in Oz, there was another story — the
              untold tale of two young women: Elphaba, born with green skin and
              fierce intelligence, and Glinda, beautiful, popular, and
              ambitious. Though they start as rivals at Shiz University, their
              unlikely friendship is tested by opposing destinies, love, and the
              corrupt powers that rule Oz.
            </p>

            <p className={styles.movieMetadata}>2024 | PG</p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default TopMovieRecommendation;
