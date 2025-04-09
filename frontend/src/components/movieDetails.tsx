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

    // If it already has commas, return it as-is
    if (value.includes(',')) {
      return value.trim();
    }

    // Otherwise, try to group every 2 words into names
    const words = value.trim().split(/\s+/).filter(Boolean);

    const pairs: string[] = [];
    for (let i = 0; i < words.length; i += 2) {
      const name = words[i] + (words[i + 1] ? ' ' + words[i + 1] : '');
      pairs.push(name);
    }

    return pairs.join(', ');
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="movie-details-container">
      <div className="movie-details-content">
        <div className="movie-poster">
          <img
            src={`https://movieposters123.blob.core.windows.net/movieposters/${movie.title.replace(
              /[^a-zA-Z0-9 ]/g,
              ''
            )}.jpg`}
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
            <br></br>
            <li>
              <strong>Rating:</strong> {displayValue(movie.rating)}
            </li>

            <li>
              <strong>Duration:</strong> {displayValue(movie.duration)}
            </li>
            <li>
              <strong>Country:</strong> {displayCommaList(movie.country)}
            </li>
            <li>
              <strong>Director:</strong> {displayValue(movie.director)}
            </li>
            <li>
              <strong>Cast:</strong> {displayCommaList(movie.cast)}
            </li>
          </ul>

          {movie.genres.length > 0 && (
            <div className="movie-genres">
              <h2>Genres</h2>
              <div className="genre-badges">
                {movie.genres.map((genre) => (
                  <span key={genre} className="genre-badge">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="movie-rating">
            <h3>Rate this {movie.type}:</h3>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? 'filled' : ''}`}
                onClick={() => setRating(star === rating ? 0 : star)}
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
