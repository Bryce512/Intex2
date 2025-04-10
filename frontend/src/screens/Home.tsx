import { useEffect, useState } from 'react';
import HeaderHome from '../components/HeaderHome';
import TopMovieRecommendation from '../components/TopMovie';
import HorizontalCarousel from '../components/HorizontalCarousel';
import AuthorizeView from '../components/AuthorizeView';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';

function Home() {
  // State to hold multiple categories of movies
  const [carouselMovies, setCarouselMovies] = useState<{
    [category: string]: { title: string; showId: string }[];
  }>({});

  // Fetch different movie categories
  useEffect(() => {
    const fetchAllCarousels = async () => {
      const endpoints = [
        {
          key: 'Top Rated',
          url: 'https://intex2-backend-ezargqcgdwbgd4hq.westus3-01.azurewebsites.net/Movies/TopRatedMovies',
        },
        {
          key: 'Trending Now',
          url: 'https://intex2-backend-ezargqcgdwbgd4hq.westus3-01.azurewebsites.net/Movies/PopularMovies',
        },
        {
          key: 'Your Top Picks',
          url: 'https://intex2-backend-ezargqcgdwbgd4hq.westus3-01.azurewebsites.net/Movies/UserMovies',
        },
        {
          key: 'Comedy',
          url: 'https://intex2-backend-ezargqcgdwbgd4hq.westus3-01.azurewebsites.net/Movies/UserComedyMovies',
        },
        {
          key: 'Fantasy',
          url: 'https://intex2-backend-ezargqcgdwbgd4hq.westus3-01.azurewebsites.net/Movies/UserFantasyMovies',
        },
        {
          key: 'Kids',
          url: 'https://intex2-backend-ezargqcgdwbgd4hq.westus3-01.azurewebsites.net/Movies/UserChildrenMovies',
        },
        {
          key: 'Action',
          url: 'https://intex2-backend-ezargqcgdwbgd4hq.westus3-01.azurewebsites.net/Movies/UserActionMovies',
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
      imageUrl: `https://movieposters123.blob.core.windows.net/movieposters/${movie.title.replace(
        /[^a-zA-Z0-9 ]/g,
        ''
      )}.jpg`,
      linkUrl: `/MovieDetailsPage/${movie.showId}`,
    }));
  };

  return (
    <>
      <AuthorizeView>
        <HeaderHome />
        <TopMovieRecommendation />
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
      </AuthorizeView>
    </>
  );
}

export default Home;
