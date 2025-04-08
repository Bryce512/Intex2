import { useEffect, useState } from 'react';
import { deleteMovie, fetchMovies } from '../api/moviesAPI';
// import { Book } from "../types/books";
import '../css/adminBooklist.css';
import Pagination from '../components/pagination';
import NewBookForm from '../components/newBookForm';
import EditMovieForm from '../components/EditMovieForm';
import HeaderHome from '../components/HeaderHome';
import { Movie } from '../types/movies';

function AdminMovielist() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchMovies(page, resultsPerPage);
        setMovies(data.movies);
        setTotalPages(Math.ceil(data.totalNumMovies / resultsPerPage));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [page, resultsPerPage, showForm, editingMovie]);

  const handleDelete = async (showId: string) => {
    if (window.confirm('Are you sure you want to delete this Movie?')) {
      try {
        await deleteMovie(showId);
        setMovies((prevMovies) =>
          prevMovies.filter((movie) => movie.showId !== showId)
        );
        setTotalPages(Math.ceil((totalPages - 1) / resultsPerPage));
      } catch (error) {
        setError((error as Error).message);
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <>
      <HeaderHome />
      <h1>Manage Movies</h1>

      {!showForm && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(true)}
        >
          Add Movie/TV Show
        </button>
      )}

      {showForm && (
        <NewBookForm
          onSuccess={() => {
            setShowForm(false);
            fetchMovies(page, resultsPerPage).then((data) =>
              setMovies(data.movies)
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingMovie && (
        <EditMovieForm
          movie={editingMovie}
          onSuccess={() => {
            setEditingMovie(null);
            fetchMovies(page, resultsPerPage).then((data) =>
              setMovies(data.movies)
            );
          }}
          onCancel={() => setEditingMovie(null)}
        />
      )}

      <table className="table-auto table table-striped table-bordered">
        <thead className="table-dark">
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
          {movies.map((movie) => (
            <tr key={movie.showId}>
              <td className="border px-4 py-2">{movie.showId}</td>
              <td className="border px-4 py-2">{movie.title}</td>
              <td className="border px-4 py-2">{movie.type}</td>
              <td className="border px-4 py-2">{movie.director}</td>
              <td className="border px-4 py-2">{movie.releaseYear}</td>
              <td className="border px-4 py-2">${movie.rating}</td>
              <td className="border px-4 py-2">{movie.duration}</td>
              <td className="border px-4 py-2">Genres</td>
              <td>
                <button
                  className="btn-blue mb-2 text-white px-4 py-2 rounded btn-edit btn-small"
                  onClick={() => {
                    setEditingMovie(movie);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn-red text-white px-4 py-2 rounded ml-2"
                  onClick={() => handleDelete(movie.showId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
    </>
  );
}
export default AdminMovielist;
