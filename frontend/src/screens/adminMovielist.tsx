import { useEffect, useState, useRef, useCallback } from 'react';
import { deleteMovie, fetchMovies, fetchUserRoles } from '../api/moviesAPI';
import '../css/Admin.css';
import Pagination from '../components/pagination';
import NewMovieForm from '../components/NewMovieForm';
import EditMovieForm from '../components/EditMovieForm';
import HeaderHome from '../components/HeaderHome';
import { Movie } from '../types/movies';
import NewMovieModal from '../components/NewMovieModal';
import { useNavigate } from 'react-router-dom';
import AuthorizeView from '../components/AuthorizeView';
import AdminTableData from '../components/AdminTableData';

function AdminMovielist() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // New state for refresh operations
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Create a reference for the search input
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Add at the top of your component, near the other refs
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize loadMovies function to prevent unnecessary re-creation
  const loadMovies = useCallback(
    async (searchValue = searchTerm) => {
      try {
        // For user-initiated searches, always use refreshing instead of initialLoading
        const isSearchChange = searchValue !== searchTerm;

        // Only show loading indicators if we're actually doing a search
        if (isSearchChange || movies.length > 0) {
          setRefreshing(true);
          // Never set initialLoading during a search operation
        } else if (movies.length === 0) {
          // This is truly initial load
          setInitialLoading(true);
        }

        const data = await fetchMovies(page, resultsPerPage, searchValue);

        // Safely handle empty results
        setMovies(data.movies || []);

        // Make sure totalPages is at least 1 to prevent pagination issues
        const calculatedPages = Math.ceil(data.totalNumMovies / resultsPerPage);
        setTotalPages(calculatedPages > 0 ? calculatedPages : 1);

        setError(null);
      } catch (error) {
        console.error('Error loading movies:', error);
        setError(
          (error as Error).message ||
            'An error occurred while fetching movies. Please try again.'
        );
        // Don't clear movies on error
      } finally {
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [page, resultsPerPage, searchTerm, movies.length]
  );

  // Check user access
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const roles = await fetchUserRoles();
        console.log('User roles:', roles);

        if (!roles.includes('admin')) {
          navigate('/Home');
        }
      } catch (error) {
        console.error('Error fetching user roles:', error);
        navigate('/Home');
      }
    };

    checkAccess();
  }, [navigate]);

  // Preserve focus after re-render
  useEffect(() => {
    if (document.activeElement === searchInputRef.current) {
      searchInputRef.current?.focus();
    }
  }, [movies]);

  // Modify your useEffect to prevent double loading
  useEffect(() => {
    // Only load on mount, page changes, or resultsPerPage changes
    // Don't reload when searchTerm changes (that's handled by handleSearchChange)
    if (!searchTimerRef.current) {
      loadMovies();
    }
  }, [loadMovies]);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Reset page if needed
    if (page !== 1) {
      setPage(1);
    }

    // Clear any existing timer
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    // Set a new timer to debounce search
    searchTimerRef.current = setTimeout(() => {
      loadMovies(value);
      searchTimerRef.current = null;
    }, 150);

    // Prevent form submission
    e.preventDefault();
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const handleDelete = async (showId: string) => {
    if (window.confirm('Are you sure you want to delete this Movie?')) {
      try {
        await deleteMovie(showId);
        // Refresh the current page after deletion
        loadMovies();
      } catch (error) {
        setError((error as Error).message);
      }
    }
  };

  const handleEditSuccess = () => {
    setEditingMovie(null);
    loadMovies();
  };

  const handleAddSuccess = () => {
    setShowForm(false);
    loadMovies();
  };

  if (initialLoading) {
    return <p>Loading movies...</p>;
  }

  return (
    <>
      <AuthorizeView>
        <div
          className="admin-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <HeaderHome />

          <div
            className="admin-content"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
            }}
          >
            {/* Search and controls */}
            <div
              className="controls-container"
              style={{ marginBottom: '20px', height: '40px' }}
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="px-4 py-2 border rounded"
              />
              {refreshing && (
                <span className="ml-3 text-blue-600">Updating results...</span>
              )}
            </div>

            {/* Action buttons - fixed height */}
            <div
              className="actions-container"
              style={{ height: '50px', marginBottom: '20px' }}
            >
              {!showForm && (
                <button
                  className="btn btn-success"
                  onClick={() => setShowForm(true)}
                >
                  Add Movie/TV Show
                </button>
              )}
            </div>

            {/* Table with absolute positioned modals */}
            <div
              className="table-container"
              style={{
                flex: 1,
                position: 'relative',
                minHeight: '500px', // Increased min-height
                height: 'calc(100vh - 250px)', // Responsive height calculation
                overflow: 'auto',
              }}
            >
              <table className="table-auto w-full table table-striped table-bordered">
                <thead className="bg-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Director</th>
                    <th className="px-4 py-2">Year</th>
                    <th className="px-4 py-2">Rating</th>
                    <th className="px-4 py-2">Duration</th>
                    <th className="px-4 py-2">Genre Tags</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AdminTableData
                    movies={movies}
                    onEdit={setEditingMovie}
                    onDelete={handleDelete}
                  />
                </tbody>
              </table>

              {/* Overlay loading indicator */}
              {refreshing && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    zIndex: 20,
                  }}
                >
                  Loading...
                </div>
              )}
            </div>

            {/* Pagination - fixed position */}
            <div
              className="pagination-container"
              style={{ height: '60px', marginTop: '20px' }}
            >
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                itemsPerPage={resultsPerPage}
                onPageChange={setPage}
                onPageSizeChange={(newSize) => {
                  setResultsPerPage(newSize);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* Modals - positioned outside the flow */}
        {showForm && (
          <NewMovieModal onClose={() => setShowForm(false)}>
            <NewMovieForm
              onSuccess={handleAddSuccess}
              onCancel={() => setShowForm(false)}
            />
          </NewMovieModal>
        )}

        {editingMovie && (
          <NewMovieModal onClose={() => setEditingMovie(null)}>
            <EditMovieForm
              movie={editingMovie}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingMovie(null)}
            />
          </NewMovieModal>
        )}

        {error && (
          <div
            className="error-alert"
            style={{ color: 'red', margin: '10px 0' }}
          >
            {error}
          </div>
        )}
      </AuthorizeView>
    </>
  );
}

export default AdminMovielist;
