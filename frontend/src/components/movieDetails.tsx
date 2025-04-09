import { useEffect, useState } from 'react';
import { fetchMovieById } from '../api/moviesAPI';
import { Movie } from '../types/movies';
import '../css/movieDetails.css';

type MovieDetailsProps = {
  id: string;
};

export default function MovieDetails({ id }: MovieDetailsProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [rating, setRating] = useState<number>(0);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await fetchMovieById(id);
        setMovie(data);
      } catch (err) {
        console.error('Failed to fetch movie:', err);
      }
    };

    fetchMovie();
  }, [id]);

  const displayValue = (value?: string | number) => {
    return value && value.toString().trim() !== '' ? value : 'Not available';
  };

  const displayCommaList = (value?: string) => {
    if (!value || value.trim() === '') return 'Not available';

    // Split by whitespace and filter out blanks
    const words = value.trim().split(/\s+/).filter(Boolean);

    const pairs: string[] = [];
    for (let i = 0; i < words.length; i += 2) {
      const name = words[i] + (words[i + 1] ? ' ' + words[i + 1] : '');
      pairs.push(name);
    }

    return pairs.join(', ');
  };

  if (!movie) return <div>Loading...</div>;

  const genreKeys = [
    'action',
    'adventure',
    'animeSeriesInternationalTvShows',
    'britishTvShowsDocuseriesInternationalTvShows',
    'children',
    'comedies',
    'comediesDramasInternationalMovies',
    'comediesInternationalMovies',
    'comediesRomanticMovies',
    'crimeTvShowsDocuseries',
    'documentaries',
    'documentariesInternationalMovies',
    'docuseries',
    'dramas',
    'dramasInternationalMovies',
    'dramasRomanticMovies',
    'familyMovies',
    'fantasy',
    'horrorMovies',
    'internationalMoviesThrillers',
    'internationalTvShowsRomanticTvShowsTvDramas',
    'kidsTv',
    'languageTvShows',
    'musicals',
    'natureTv',
    'realityTv',
    'spirituality',
    'tvAction',
    'tvComedies',
    'tvDramas',
    'talkShowsTvComedies',
    'thrillers',
  ];

  const genres = genreKeys.filter((key) => movie[key as keyof Movie] === 1);

  return (
    <div className="movie-details-container">
      <div className="movie-details-content">
        <div className="movie-poster">
          <img
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/placeholder.jpg'; // fallback image
            }}
          />
        </div>

        <div className="movie-info">
          <h1 className="movie-title">{displayValue(movie.title)}</h1>
          <p className="movie-type">
            {displayValue(movie.type)} — {displayValue(movie.releaseYear)}
          </p>

          <ul className="movie-meta">
            <li>{displayValue(movie.description)}</li>
            <li>
              <strong>Rating:</strong> {displayValue(movie.rating)}
            </li>
            <li>
              <li>
                <strong>Duration:</strong> {displayValue(movie.duration)}
              </li>
              <li>
                <strong>Country:</strong> {displayCommaList(movie.country)}
              </li>
              <strong>Director:</strong> {displayValue(movie.director)}
            </li>
            <li>
              <strong>Cast:</strong> {displayCommaList(movie.cast)}
            </li>
          </ul>

          {genres.length > 0 && (
            <div className="movie-genres">
              <h2>Genres</h2>
              <div className="genre-badges">
                {genres.map((genre) => (
                  <span key={genre} className="genre-badge">
                    {genre
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="movie-rating">
            <h3>Rate this movie:</h3>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? 'filled' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>

          <button className="play-button">▶️ Watch Now</button>
        </div>
      </div>
    </div>
  );
}
