import { useEffect, useState, useCallback, useRef } from 'react';
import HeaderHome from '../components/HeaderHome';
import { Movie } from '../types/movies';
import '../css/AllMovies.css';
import { Link } from 'react-router-dom';
import AuthorizeView from '../components/AuthorizeView';

const API_URL = import.meta.env.VITE_API_URL;

function AllMovies() {
  // Renamed from Home to match file name
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showGenreModal, setShowGenreModal] = useState(false);

  // Add a ref to track if the component is mounted
  const isMounted = useRef(true);
  // Add a debounce timer ref
  const debounceTimerRef = useRef<number | null>(null);

  const genres = ['Action', 'Comedy', 'Docuseries', 'Fantasy', 'Children'];

  // Memoize loadMovies function with useCallback
  const loadMovies = useCallback(
    async (
      pageToLoad = page,
      search = searchQuery,
      genreList = selectedGenres.join(','),
      resetList = false
    ) => {
      if (loading || (!hasMore && !resetList)) return;

      setLoading(true);
      setError(null);

      try {
        const url = new URL(`${API_URL}/Movies/AllMoviesMax`);
        url.searchParams.append('page', String(pageToLoad));
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
            setPage(2); // Set to load page 2 next
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
        console.error('Error fetching movies:', error);
        if (isMounted.current) {
          setError('Failed to load movies. Please try again later.');
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    },
    [loading, hasMore, searchQuery, selectedGenres, page] // Added page
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Reset movies when search changes
    debounceTimerRef.current = window.setTimeout(() => {
      setHasMore(true);
      loadMovies(1, newSearchQuery, selectedGenres.join(','), true);
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
    loadMovies(1, searchQuery, selectedGenres.join(','), true);
  };

  // Initial load
  useEffect(() => {
    loadMovies(1, '', '', true);

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        !loading &&
        hasMore &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 80
      ) {
        loadMovies(page, searchQuery, selectedGenres.join(','), false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, page, searchQuery, selectedGenres, loadMovies]);

  // Add this right before the return statement to see what's happening
  console.log({
    page,
    loading,
    hasMore,
    moviesCount: movies.length,
  });

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
            <div key={movie.showId} className="gridItem">
              <Link to={`/MovieDetailsPage/${movie.showId}`}>
                <img
                  className="image"
                  src={movie.posterUrl}
                  alt={movie.title}
                />
              </Link>
            </div>
          ))
        )}
      </div>

      {loading && <p className="loading-indicator">Loading more movies...</p>}
      {!hasMore && movies.length > 0 && (
        <p className="end-message">No more movies to load</p>
      )}
      {error && <p className="text-danger error-message">{error}</p>}
    </AuthorizeView>
  );
}

export default AllMovies; // Renamed export to match component name
