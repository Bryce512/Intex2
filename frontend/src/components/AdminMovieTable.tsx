import React from 'react';
import { Movie } from '../types/movies';
import AdminTableData from './AdminTableData';

interface AdminMovieTableProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onDelete: (movieId: string) => void;
}

// Main table component that remains stable
const AdminMovieTable: React.FC<AdminMovieTableProps> = ({
  movies,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full table table-striped table-bordered">
        <thead className="bg-gray-200">
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
          <AdminTableData movies={movies} onEdit={onEdit} onDelete={onDelete} />
        </tbody>
      </table>
    </div>
  );
};

export default AdminMovieTable;
