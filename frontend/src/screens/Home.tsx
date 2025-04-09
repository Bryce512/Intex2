import { useEffect, useState } from 'react';
import HeaderHome from '../components/HeaderHome';
import TopMovieRecommendation from '../components/TopMovie';
import HorizontalCarousel from '../components/HorizontalCarousel';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
import Footer from '../components/Footer';

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
          url: 'https://localhost:5000/Movies/TopRatedMovies',
        },
        {
          key: 'Trending Now',
          url: 'https://localhost:5000/Movies/PopularMovies',
        },
        {
          key: 'Your Top Picks',
          url: 'https://localhost:5000/Movies/UserMovies',
        },
        {
          key: 'Comedy',
          url: 'https://localhost:5000/Movies/UserComedyMovies',
        },
        {
          key: 'Fantasy',
          url: 'https://localhost:5000/Movies/UserFantasyMovies',
        },
        {
          key: 'Kids',
          url: 'https://localhost:5000/Movies/UserChildrenMovies',
        },
        {
          key: 'Action',
          url: 'https://localhost:5000/Movies/UserActionMovies',
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
      imageUrl: `images/Movie Posters/${movie.title}.jpg`,
      linkUrl: `/show/${movie.showId}`,
    }));
  };

  return (
    <>
      <AuthorizeView>
        <span>
          <Logout>
            Logout <AuthorizedUser value="email" />
          </Logout>{' '}
        </span>
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
        <Footer />
      </AuthorizeView>
    </>
  );
}

export default Home;
