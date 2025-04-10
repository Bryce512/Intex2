import { useEffect, useState } from 'react';
import HeaderHome from '../components/HeaderHome';
import { Movie } from '../types/movies';
import '../css/AllMovies.css';
import { Link } from 'react-router-dom';
import AuthorizeView from '../components/AuthorizeView';

function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1); // Track current page
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Flag for whether there are more movies
  const [error, setError] = useState<string | null>(null);

  const loadMoreMovies = async () => {
    if (loading || !hasMore) return; // Prevent multiple requests at the same time and stop if no more data

    setLoading(true);
    setError(null); // Reset error state before fetching

    try {
      // Fetch the next page of movies
      const response = await fetch(
        `https://intex2-backend-ezargqcgdwbgd4hq.westus3-01.azurewebsites.net/Movies/AllMoviesMax?page=${page}&pageSize=20`,
        {
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        const newMovies = data.result.map(
          (movie: { genres: string[]; showId: string; title: string }) => ({
            showId: movie.showId,
            title: movie.title,
            posterUrl: `https://movieposters123.blob.core.windows.net/movieposters/${movie.title.replace(
              /[^a-zA-Z0-9À-ÿ ]/g,
              ''
            )}.jpg`, // Example URL, replace with your actual poster URL if needed
            genres: movie.genres, // You can replace this with actual genres if available
          })
        );

        // Append new movies to the existing list
        setMovies((prev) => [...prev, ...newMovies]);
        setPage((prev) => prev + 1); // Increment the page
        setHasMore(data.result.length > 0); // Stop if no more data is available
      } else {
        throw new Error('Failed to fetch movies');
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoreMovies(); // Initial load of the first page
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Check if we're near the bottom of the page and not currently loading
      if (
        !loading && // Only load more if not currently loading
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 50
      ) {
        loadMoreMovies(); // Load the next page
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener when the component is unmounted or when the page changes
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]); // Only depend on `loading` and `hasMore` so we avoid unnecessary rerenders

  return (
    <>
      <AuthorizeView>
        <HeaderHome />
        <p className="text-success text-2xl font-bold ml-6">ALL MOVIES</p>
        <div className="gridWrapper">
          {movies.map((movie) => (
            <div key={movie.showId} className="gridItem">
              <Link to={`/MovieDetailsPage/${movie.showId}`}>
                <img
                  className="image"
                  src={movie.posterUrl}
                  alt={movie.title}
                />
              </Link>
            </div>
          ))}
        </div>
        {loading && <p>Loading more movies...</p>}
        {!hasMore && <p>No more movies to load</p>}
        {error && <p className="text-danger">{error}</p>} {/* Error display */}
      </AuthorizeView>
    </>
  );
}

export default Home;
