import { useState } from 'react';
import { addMovie } from '../api/moviesAPI';
import { Movie } from '../types/movies';
import HeaderHome from './HeaderHome';
import '../css/NewMovie.css';

interface NewMovieFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

function NewMovieForm({ onSuccess, onCancel }: NewMovieFormProps) {
  const [formData, setFormData] = useState<Movie>({
    showId: '',
    title: '',
    type: '',
    director: '',
    cast: '',
    country: '',
    releaseYear: new Date().getFullYear(),
    rating: '',
    duration: '',
    description: '',

    action: 0,
    adventure: 0,
    animeSeriesInternationalTvShows: 0,
    britishTvShowsDocuseriesInternationalTvShows: 0,
    children: 0,
    comedies: 0,
    comediesDramasInternationalMovies: 0,
    comediesInternationalMovies: 0,
    comediesRomanticMovies: 0,
    crimeTvShowsDocuseries: 0,
    documentaries: 0,
    documentariesInternationalMovies: 0,
    docuseries: 0,
    dramas: 0,
    dramasInternationalMovies: 0,
    dramasRomanticMovies: 0,
    familyMovies: 0,
    fantasy: 0,
    horrorMovies: 0,
    internationalMoviesThrillers: 0,
    internationalTvShowsRomanticTvShowsTvDramas: 0,
    kidsTv: 0,
    languageTvShows: 0,
    musicals: 0,
    natureTv: 0,
    realityTv: 0,
    spirituality: 0,
    tvAction: 0,
    tvComedies: 0,
    tvDramas: 0,
    talkShowsTvComedies: 0,
    thrillers: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
    await addMovie(formData);
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
        <h2>Add New Movie/Show</h2>

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
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>

        <h3>Genres</h3>
        {genreKeys.map((key) => (
          <label key={key}>
            {formatGenreLabel(key)}:
            <input
              type="checkbox"
              name={key}
              checked={formData[key as keyof Movie] === 1}
              onChange={handleCheckboxChange}
            />
          </label>
        ))}

        <div style={{ marginTop: '1rem' }}>
          <button type="submit">Add Movie</button>
          <button
            type="button"
            onClick={onCancel}
            style={{ marginLeft: '1rem' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

export default NewMovieForm;
