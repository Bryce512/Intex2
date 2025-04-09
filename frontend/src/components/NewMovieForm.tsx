import { addMovie} from '../api/moviesAPI';
import { Movie } from '../types/movies';
import { useState } from 'react';
import HeaderHome from './HeaderHome';

interface newMovieFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

function NewMovieForm({ onSuccess, onCancel }: newMovieFormProps) {
  const [formData, setFormData] = useState<Movie>({
    showId: '',
    title: '',
    type: '',
    director: '',
    cast: '',
    country: '',
    releaseYear: 0,
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addMovie(formData);
    onSuccess();
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked ? 1 : 0 });
  };



  return (
    <>
      <HeaderHome />
      <form onSubmit={handleSubmit}>
        <h2>Add New Movie/Show</h2>
        <label>
          Title:{' '}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>
        <label>
          Type:
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="">Select Type</option>
            <option value="Movie">Movie</option>
            <option value="TV Show">TV Show</option>
          </select>
        </label>

        <label>
          Director:{' '}
          <input
            type="text"
            name="director"
            value={formData.director}
            onChange={handleChange}
          />
        </label>
        <label>
          Cast:{' '}
          <input
            type="text"
            name="cast"
            value={formData.cast}
            onChange={handleChange}
          />
        </label>
        <label>
          Country:{' '}
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </label>
        <label>
          Release Year:{' '}
          <input
            type="number"
            name="releaseYear"
            value={formData.releaseYear}
            onChange={handleChange}
          />
        </label>
        <label>
          Rating:
          <select name="rating" value={formData.type} onChange={handleChange}>
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
          Duration:{' '}
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />
        </label>
        <label>
          Description:{' '}
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <h3>Genres</h3>
        <label>
          Action:
          <input
            type="checkbox"
            name="action"
            checked={formData.action === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Adventure:
          <input
            type="checkbox"
            name="adventure"
            checked={formData.adventure === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Anime Series / International TV Shows:
          <input
            type="checkbox"
            name="animeSeriesInternationalTvShows"
            checked={formData.animeSeriesInternationalTvShows === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          British TV Shows / Docuseries / International TV Shows:
          <input
            type="checkbox"
            name="britishTvShowsDocuseriesInternationalTvShows"
            checked={
              formData.britishTvShowsDocuseriesInternationalTvShows === 1
            }
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Children:
          <input
            type="checkbox"
            name="children"
            checked={formData.children === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Comedies:
          <input
            type="checkbox"
            name="comedies"
            checked={formData.comedies === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Comedies / Dramas / International Movies:
          <input
            type="checkbox"
            name="comediesDramasInternationalMovies"
            checked={formData.comediesDramasInternationalMovies === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Comedies / International Movies:
          <input
            type="checkbox"
            name="comediesInternationalMovies"
            checked={formData.comediesInternationalMovies === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Comedies / Romantic Movies:
          <input
            type="checkbox"
            name="comediesRomanticMovies"
            checked={formData.comediesRomanticMovies === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Crime TV Shows / Docuseries:
          <input
            type="checkbox"
            name="crimeTvShowsDocuseries"
            checked={formData.crimeTvShowsDocuseries === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Documentaries:
          <input
            type="checkbox"
            name="documentaries"
            checked={formData.documentaries === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Documentaries / International Movies:
          <input
            type="checkbox"
            name="documentariesInternationalMovies"
            checked={formData.documentariesInternationalMovies === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Docuseries:
          <input
            type="checkbox"
            name="docuseries"
            checked={formData.docuseries === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Dramas:
          <input
            type="checkbox"
            name="dramas"
            checked={formData.dramas === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Dramas / International Movies:
          <input
            type="checkbox"
            name="dramasInternationalMovies"
            checked={formData.dramasInternationalMovies === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Dramas / Romantic Movies:
          <input
            type="checkbox"
            name="dramasRomanticMovies"
            checked={formData.dramasRomanticMovies === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Family Movies:
          <input
            type="checkbox"
            name="familyMovies"
            checked={formData.familyMovies === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Fantasy:
          <input
            type="checkbox"
            name="fantasy"
            checked={formData.fantasy === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Horror Movies:
          <input
            type="checkbox"
            name="horrorMovies"
            checked={formData.horrorMovies === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          International Movies / Thrillers:
          <input
            type="checkbox"
            name="internationalMoviesThrillers"
            checked={formData.internationalMoviesThrillers === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          International TV Shows / Romantic TV Shows / TV Dramas:
          <input
            type="checkbox"
            name="internationalTvShowsRomanticTvShowsTvDramas"
            checked={formData.internationalTvShowsRomanticTvShowsTvDramas === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Kids TV:
          <input
            type="checkbox"
            name="kidsTv"
            checked={formData.kidsTv === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Language TV Shows:
          <input
            type="checkbox"
            name="languageTvShows"
            checked={formData.languageTvShows === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Musicals:
          <input
            type="checkbox"
            name="musicals"
            checked={formData.musicals === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Nature TV:
          <input
            type="checkbox"
            name="natureTv"
            checked={formData.natureTv === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Reality TV:
          <input
            type="checkbox"
            name="realityTv"
            checked={formData.realityTv === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Spirituality:
          <input
            type="checkbox"
            name="spirituality"
            checked={formData.spirituality === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          TV Action:
          <input
            type="checkbox"
            name="tvAction"
            checked={formData.tvAction === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          TV Comedies:
          <input
            type="checkbox"
            name="tvComedies"
            checked={formData.tvComedies === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          TV Dramas:
          <input
            type="checkbox"
            name="tvDramas"
            checked={formData.tvDramas === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Talk Shows / TV Comedies:
          <input
            type="checkbox"
            name="talkShowsTvComedies"
            checked={formData.talkShowsTvComedies === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Thrillers:
          <input
            type="checkbox"
            name="thrillers"
            checked={formData.thrillers === 1}
            onChange={handleCheckboxChange}
          />
        </label>
        <button type="submit">Add Book</button>
        <button type="reset" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </>
  );
}

export default NewMovieForm;
function useEffect(arg0: () => void, arg1: never[]) {
  throw new Error('Function not implemented.');
}
