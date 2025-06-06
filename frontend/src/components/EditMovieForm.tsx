import { updateMovie } from '../api/moviesAPI';
import { Movie } from '../types/movies';
import { useState } from 'react';
import HeaderHome from './HeaderHome';

interface editMovieFormProps {
  movie: Movie;
  onSuccess: () => void;
  onCancel: () => void;
}

function EditMovieForm({ movie, onSuccess, onCancel }: editMovieFormProps) {
  const [formData, setFormData] = useState<Movie>({ ...movie });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'releaseYear' ? parseInt(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked ? 1 : 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateMovie(formData.showId, formData);
    onSuccess();
  };

  // Dynamically get all genre keys
  const genreKeys = Object.keys(formData).filter(
    (key) =>
      typeof formData[key as keyof Movie] === 'number' && key !== 'releaseYear'
  );

  const formatGenreLabel = (key: string): string =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

  return (
    <>
      <HeaderHome />
      <form onSubmit={handleSubmit}>
        <h2>Edit Movie/Show</h2>

        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Type:
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            <option value="Movie">Movie</option>
            <option value="TV Show">TV Show</option>
          </select>
        </label>

        <label>
          Director:
          <input
            type="text"
            name="director"
            value={formData.director}
            onChange={handleChange}
          />
        </label>

        <label>
          Cast:
          <input
            type="text"
            name="cast"
            value={formData.cast}
            onChange={handleChange}
          />
        </label>

        <label>
          Country:
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </label>

        <label>
          Release Year:
          <input
            type="number"
            name="releaseYear"
            value={formData.releaseYear}
            onChange={handleChange}
          />
        </label>

        <label>
          Rating:
          <select name="rating" value={formData.rating} onChange={handleChange}>
            <option value="">Select Rating</option>
            <option value="G">G</option>
            <option value="PG">PG</option>
            <option value="PG-13">PG-13</option>
            <option value="R">R</option>
            <option value="TV-Y">TV-Y</option>
            <option value="TV-Y7">TV-Y7</option>
            <option value="TV-Y7-FV">TV-Y7-FV</option>
            <option value="TV-G">TV-G</option>
            <option value="TV-PG">TV-PG</option>
            <option value="TV-14">TV-14</option>
            <option value="TV-MA">TV-MA</option>
            <option value="UR">UR</option>
            <option value="NR">NR</option>
          </select>
        </label>

        <label>
          Duration:
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="description-input"
          />
        </label>

        <br />
        <h3>Genres</h3>
        <div className="checkbox-list">
          {genreKeys.map((key) => (
            <div className="checkbox-item" key={key}>
              <input
                type="checkbox"
                name={key}
                checked={formData[key as keyof Movie] === 1}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={key}>{formatGenreLabel(key)}</label>
            </div>
          ))}
        </div>

        <div className='button-container' style={{ marginTop: '1rem' }}>
          <button type="submit">Update Movie</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

export default EditMovieForm;
