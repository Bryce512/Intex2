import { useEffect, useState } from 'react';
import LandingHeader from '../components/LandingHeader';
// import TopMovieRecommendation from '../components/TopMovie';
import HorizontalCarousel from '../components/HorizontalCarousel';
// import AuthorizeView from '../components/AuthorizeView';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import LandingIntro from '../components/LandingIntro';

function Landing() {
  // State to hold multiple categories of movies
  const [carouselMovies, setCarouselMovies] = useState<{
    [category: string]: { title: string; showId: string }[];
  }>({});

  const API_URL =
    'https://intex2-backend-ezargqcgdwbgd4hq.westus3-01.azurewebsites.net';

  // Fetch different movie categories
  useEffect(() => {
    const fetchAllCarousels = async () => {
      const endpoints = [
        {
          key: 'Top Rated',
          url: `${API_URL}/Movies/TopRatedMovies`,
        },
        {
          key: 'Trending Now',
          url: `${API_URL}/Movies/PopularMovies`,
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
      setCarouselMovies(results);
    };

    fetchAllCarousels();
  }, []);

  // Transform titles into movie items for the carousel
  const getMovieItems = (movies: { title: string; showId: string }[]) => {
    return movies.map((movie) => ({
      id: movie.showId,
      imageUrl: `https://movieposters123.blob.core.windows.net/movieposters/${movie.title}.jpg`,
      linkUrl: `/MovieDetailsPage/${movie.showId}`,
    }));
  };

  return (
    <>
      <LandingHeader />
      <LandingIntro />
      <br />
      <br />

      {Object.entries(carouselMovies).map(([category, movies]) => (
        <HorizontalCarousel
          key={category}
          title={category}
          items={getMovieItems(movies)}
        />
      ))}
      <CookieConsent />
      <Footer />
    </>
  );
}

export default Landing;
