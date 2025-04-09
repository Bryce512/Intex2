import { useEffect, useState } from 'react';
import { fetchMovieById } from '../api/moviesAPI';
import { Movie } from '../types/movies';

type MovieDetailsProps = {
  id: string;
};

export default function MovieDetails({ id }: MovieDetailsProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await fetchMovieById(id);
        if (!data || Object.keys(data).length === 0) {
          setError('Movie not found');
          return;
        }
        setMovie(data);
      } catch (err) {
        setError('Failed to load movie');
        console.error(err);
      }
    };

    fetchMovie();
  }, [id]);

  if (error) return <div>{error}</div>;
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
    <div className="p-6 rounded-xl shadow-lg bg-white max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
      <p className="text-gray-600 italic mb-4">{movie.type}</p>

      <ul className="space-y-1 text-base text-gray-700">
        <li>
          <strong>Director:</strong> {movie.director}
        </li>
        <li>
          <strong>Cast:</strong> {movie.cast}
        </li>
        <li>
          <strong>Country:</strong> {movie.country}
        </li>
        <li>
          <strong>Release Year:</strong> {movie.releaseYear}
        </li>
        <li>
          <strong>Rating:</strong> {movie.rating}
        </li>
        <li>
          <strong>Duration:</strong> {movie.duration}
        </li>
        <li>
          <strong>Description:</strong> {movie.description}
        </li>
      </ul>

      {genres.length > 0 && (
        <>
          <h2 className="mt-6 text-xl font-semibold">Genres</h2>
          <ul className="flex flex-wrap gap-2 mt-2">
            {genres.map((genre) => (
              <li
                key={genre}
                className="px-3 py-1 rounded-full bg-yellow-200 text-sm text-gray-800"
              >
                {genre
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
