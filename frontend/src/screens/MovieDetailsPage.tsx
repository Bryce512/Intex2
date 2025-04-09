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
          url: `https://localhost:5000/Movies/MovieToMovieRecommendations/${id}`,
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
      imageUrl: `/images/Movie Posters/${movie.title}.jpg`,
      linkUrl: `/MovieDetailsPage/${movie.showId}`,
    }));
  };

  return (
    <>
      <HeaderHome />

      <div className="page-wrapper">
        {!id ? (
          <div className="invalid-id-message">Invalid movie ID</div>
        ) : (
          <>
            <div className="back-button" onClick={() => navigate(-1)}>
              ← Back
            </div>
            <MovieDetails id={id} />
          </>
        )}
      </div>

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
