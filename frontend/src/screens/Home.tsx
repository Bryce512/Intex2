import CategoryFilter from "../components/CategoryFilter";
import Booklist from "../components/booklist";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import CartSummary from "../components/CartSummary";
import HeaderHome from "../components/HeaderHome";

function Home() {
  // State to hold movie titles
  const [movieTitles, setMovieTitles] = useState<string[]>([]);

  // Fetch movie titles from the backend
  useEffect(() => {
    const fetchMovieTitles = async () => {
      try {
        const response = await fetch(
          'https://localhost:5000/Movies/UserActionMovies'
        );
        if (response.ok) {
          const data = await response.json();
          // Extract the titles from the backend response
          const titles = data.map((movie: { title: string }) => movie.title);
          setMovieTitles(titles); // Store the titles
        } else {
          console.error('Error fetching movie titles');
        }
      } catch (error) {
        console.error('Error fetching movie titles:', error);
      }
    };

    fetchMovieTitles();
  }, []); // Runs once when the component mounts

  // Transform titles into movie items for the carousel
  const getMovieItems = (titles: string[]) => {
    return titles.map((title, index) => ({
      id: (index + 1).toString(),
      imageUrl: `images/Movie Posters/${title}.jpg`, // Adjust the file extension if needed
      linkUrl: `/show/${index + 1}`, // Adjust the link if necessary
    }));
  };

  const movieItems = getMovieItems(movieTitles);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <>
      <HeaderHome />
      <CartSummary />
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <CategoryFilter
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
          <div className="col-md-9">
            <Booklist selectedCategories={selectedCategories} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
