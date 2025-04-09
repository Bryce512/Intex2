import { useNavigate, useParams } from 'react-router-dom';
import HeaderHome from '../components/HeaderHome';
import MovieDetails from '../components/movieDetails';
import Footer from '../components/Footer';
import '../css/movieDetailsPage.css'; // 👈 we'll define CSS here
import { useEffect, useState } from 'react';
import HorizontalCarousel from '../components/HorizontalCarousel';

function MovieDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [publicCarousels, setPublicCarousels] = useState<{
    [category: string]: { title: string; showId: string }[];
  }>({});

  useEffect(() => {
    const fetchPublicCarousels = async () => {
      const endpoints = [
        {
          key: 'Similar Titles',
          url: `https://intex2-backend-ezargqcgdwbgd4hq.westus3-01.azurewebsites.net/Movies/MovieToMovieRecommendations/${id}`,
        },
      ];

      const results: {
        [category: string]: { title: string; showId: string }[];
      } = {};

      for (const { key, url } of endpoints) {
        try {
          const response = await fetch(url, {
            credentials: 'include',
          });
          if (response.ok) {
            const data = await response.json();
            results[key] = data;
          } else {
            console.error(`Failed to fetch movies for ${key}`);
          }
        } catch (error) {
          console.error(`Error fetching ${key}:`, error);
        }
      }

      setPublicCarousels(results);
    };

    fetchPublicCarousels();
  }, [id]);

  const getMovieItems = (movies: { title: string; showId: string }[]) => {
    return movies.map((movie) => ({
      id: movie.showId,
      imageUrl: `https://movieposters123.blob.core.windows.net/movieposters/${movie.title}.jpg`,
      linkUrl: `/MovieDetailsPage/${movie.showId}`,
    }));
  };

  return (
    <>
      <HeaderHome />

      {!id ? (
        <div className="invalid-id-wrapper">
          <p className="invalid-id-message">Invalid movie ID</p>
        </div>
      ) : (
        <>
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <MovieDetails id={id} />
        </>
      )}

      {/* Carousels */}
      <div className="mt-5">
        {Object.entries(publicCarousels).map(([category, movies]) => (
          <HorizontalCarousel
            key={category}
            title={category}
            items={getMovieItems(movies)}
          />
        ))}
      </div>

      <Footer />
    </>
  );
}

export default MovieDetailsPage;
