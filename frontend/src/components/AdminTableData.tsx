import React from 'react';
import { Movie } from '../types/movies';

interface AdminTableDataProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onDelete: (movieId: string) => void;
}

// This component only handles the table rows and will be imported by AdminMovieTable
const AdminTableData = React.memo(
  ({ movies, onEdit, onDelete }: AdminTableDataProps) => {
    if (movies.length === 0) {
      return (
        <>
          <tr>
            <td colSpan={9} className="text-center py-4">
              <div style={{ minHeight: '50px' }}>
                No movies found matching your search criteria.
              </div>
            </td>
          </tr>
          {/* Always render the same number of rows to maintain height */}
          {Array(10)
            .fill(0)
            .map((_, idx) => (
              <tr key={`empty-${idx}`} style={{ height: '53px' }}>
                <td colSpan={9}>&nbsp;</td>
              </tr>
            ))}
        </>
      );
    }

    return (
      <>
        {movies.map((movie) => (
          <tr key={movie.showId}>
            <td className="border px-4 py-2">{movie.showId}</td>
            <td className="border px-4 py-2">{movie.title}</td>
            <td className="border px-4 py-2">{movie.type}</td>
            <td className="border px-4 py-2">{movie.director}</td>
            <td className="border px-4 py-2">{movie.releaseYear}</td>
            <td className="border px-4 py-2">{movie.rating}</td>
            <td className="border px-4 py-2">{movie.duration}</td>
            <td className="border px-4 py-2">
              <button
                className="btn-blue mb-2 text-white px-4 py-2 rounded btn-edit btn-small"
                onClick={() => onEdit(movie)}
              >
                Edit
              </button>
              <button
                className="btn-red text-white px-4 py-2 rounded ml-2"
                onClick={() => onDelete(movie.showId)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </>
    );
  }
);

export default AdminTableData;
