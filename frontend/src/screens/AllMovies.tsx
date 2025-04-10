import { useEffect, useState } from 'react';
import HeaderHome from '../components/HeaderHome';
import { Movie } from '../types/movies';
import '../css/AllMovies.css';
import { Link } from 'react-router-dom';
import AuthorizeView from '../components/AuthorizeView';

const API_URL = import.meta.env.VITE_API_URL;


function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]); // Array of selected genres
  const [showGenreModal, setShowGenreModal] = useState(false); // Show or hide genre modal

  const genres = ['Action', 'Comedy', 'Docuseries', 'Fantasy', 'Children']; // List of genres (can be dynamic if fetched from API)

  const loadMovies = async (search = '', genres = '') => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const url = new URL('${API_URL}/Movies/AllMoviesMax');
      url.searchParams.append('page', String(page));
      url.searchParams.append('pageSize', '20');
      if (search) url.searchParams.append('search', search);
      if (genres) url.searchParams.append('genres', genres); // Pass genres filter to the API

      const response = await fetch(url.toString(), {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Movies data:', data.result);

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

        setMovies((prev) => [...prev, ...newMovies]);
        setPage((prev) => prev + 1);
        setHasMore(data.result.length > 0);
      } else {
        const errorDetails = await response.text();
        throw new Error(`Failed to fetch movies: ${errorDetails}`);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to the first page when search query changes
    setMovies([]); // Clear current movie list
    setHasMore(true);
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenres(
      (prev) =>
        prev.includes(genre)
          ? prev.filter((item) => item !== genre) // Remove genre if already selected
          : [...prev, genre] // Add genre if not selected
    );
  };

  const toggleGenreModal = () => {
    setShowGenreModal((prev) => !prev); // Toggle the genre modal visibility
  };

  const handleModalSubmit = () => {
    if (selectedGenres.length === 0) {
      // Clear the genre filter and reload data without genres
      setPage(-1); // Reset to the first page when genre filter changes
      setMovies([]); // Clear current movie list
      setHasMore(true);
      loadMovies(searchQuery, ''); // Pass an empty string to remove the genre filter
    } else {
      // If genres are selected, pass them to the backend
      setPage(-1); // Reset to the first page when genre filter changes
      setMovies([]); // Clear current movie list
      setHasMore(true);
      loadMovies(searchQuery, selectedGenres.join(',')); // Pass selected genres as a comma-separated string
    }

    setShowGenreModal(false); // Close the modal
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      loadMovies(searchQuery, selectedGenres.join(',')); // Pass selected genres with the search query
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, selectedGenres]);

  useEffect(() => {
    loadMovies('', selectedGenres.join(',')); // Initial load of the first page when the component mounts
  }, []); // Only run once when component is first loaded

  useEffect(() => {
    const handleScroll = () => {
      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 80
      ) {
        loadMovies(searchQuery, selectedGenres.join(',')); // Load more movies with the selected genres
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, searchQuery, selectedGenres]);

  return (
    <>
      <HeaderHome />
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by title..."
          className="search-bar"
        />
        <button onClick={toggleGenreModal} className="genre-filter-button">
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
              <button onClick={toggleGenreModal} className="btn-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="gridWrapper">
        {movies.map((movie) => (
          <div key={movie.showId} className="gridItem">
            <Link to={`/MovieDetailsPage/${movie.showId}`}>
              <img className="image" src={movie.posterUrl} alt={movie.title} />
            </Link>
          </div>
        ))}
      </div>

      {loading && <p>Loading more movies...</p>}
      {!hasMore && <p>No more movies to load</p>}
      {error && <p className="text-danger">{error}</p>}
    </>
  );
}

export default Home;
