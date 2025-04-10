import { useEffect, useState, useCallback, useRef } from 'react';
import HeaderHome from '../components/HeaderHome';
import { Movie } from '../types/movies';
import '../css/AllMovies.css';
import { Link } from 'react-router-dom';
import AuthorizeView from '../components/AuthorizeView';

const API_URL = import.meta.env.VITE_API_URL;

function AllMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showGenreModal, setShowGenreModal] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const isMounted = useRef(true);

  const genres = ['Action', 'Comedy', 'Docuseries', 'Fantasy', 'Children'];

  const loadMovies = useCallback(
    async (search = '', genreList = '', resetList = false) => {
      if (loading || (!hasMore && !resetList)) return;

      setLoading(true);
      setError(null);

      try {
        const url = new URL(`${API_URL}/Movies/AllMoviesMax`);
        url.searchParams.append('page', String(page));
        url.searchParams.append('pageSize', '20');
        if (search) url.searchParams.append('search', search);
        if (genreList) url.searchParams.append('genres', genreList);

        const response = await fetch(url.toString(), {
          credentials: 'include',
        });

        if (!isMounted.current) return;

        if (response.ok) {
          const data = await response.json();

          const newMovies = data.result.map(
            (movie: { genres: string[]; showId: string; title: string }) => ({
              showId: movie.showId,
              title: movie.title,
              posterUrl: `https://movieposters123.blob.core.windows.net/movieposters/${movie.title.replace(
                /[^a-zA-Z0-9À-ÿ ]/g,
                ''
              )}.jpg`,
              genres: movie.genres,
            })
          );

          if (resetList) {
            setMovies(newMovies);
            setPage(2);
          } else {
            setMovies((prev) => [...prev, ...newMovies]);
            setPage((prev) => prev + 1);
          }

          setHasMore(data.hasMore);
        } else {
          const errorDetails = await response.text();
          throw new Error(`Failed to fetch movies: ${errorDetails}`);
        }
      } catch (error) {
        if (isMounted.current) {
          setError('Failed to load movies. Please try again later.');
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    },
    [loading, hasMore, page]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      setHasMore(true);
      setPage(1);
      loadMovies(newSearchQuery, selectedGenres.join(','), true);
      debounceTimerRef.current = null;
    }, 500);
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((item) => item !== genre)
        : [...prev, genre]
    );
  };

  const handleModalSubmit = () => {
    setShowGenreModal(false);
    setHasMore(true);
    setPage(1);
    loadMovies(searchQuery, selectedGenres.join(','), true);
  };

  useEffect(() => {
    loadMovies('', '', true);

    return () => {
      isMounted.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore && !loading) {
          loadMovies();
        }
      },
      { rootMargin: '100px' }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current && sentinelRef.current) {
        observerRef.current.unobserve(sentinelRef.current);
      }
    };
  }, [loadMovies, hasMore, loading]);

  return (
    <AuthorizeView>
      <HeaderHome />
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by title..."
          className="search-bar"
        />
        <button
          onClick={() => setShowGenreModal(true)}
          className="genre-filter-button"
          aria-label="Filter movies by genre"
        >
          Filter by Genre
        </button>
      </div>

      {showGenreModal && (
        <div className="genre-modal">
          <div className="modal-content">
            <h2>Select Genres</h2>
            {genres.map((genre) => (
              <div key={genre} className="genre-item">
                <input
                  type="checkbox"
                  id={genre}
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleGenreSelect(genre)}
                />
                <label htmlFor={genre}>{genre}</label>
              </div>
            ))}
            <div className="modal-actions">
              <button onClick={handleModalSubmit} className="btn-submit">
                Apply
              </button>
              <button
                onClick={() => setShowGenreModal(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="gridWrapper">
        {movies.length === 0 && !loading ? (
          <p>No movies found. Try different search criteria.</p>
        ) : (
          movies.map((movie) => (
            <div key={movie.showId} className="movie-card">
              <Link to={`/MovieDetailsPage/${movie.showId}`}>
                <div className="poster-container">
                  <img
                    className="image"
                    src={movie.posterUrl}
                    alt={movie.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder.jpg';
                    }}
                  />
                </div>
                <div className="movie-title2" title={movie.title}>
                  {movie.title.length > 25
                    ? `${movie.title.slice(0, 25)}...`
                    : movie.title}
                </div>
              </Link>
            </div>
          ))
        )}
      </div>

      <div ref={sentinelRef} style={{ height: '1px' }} />

      {loading && <p className="loading-indicator">Loading more movies...</p>}
      {!hasMore && movies.length > 0 && (
        <p className="end-message">No more movies to load</p>
      )}
      {error && <p className="text-danger error-message">{error}</p>}
    </AuthorizeView>
  );
}

export default AllMovies;
