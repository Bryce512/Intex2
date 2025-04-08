import CategoryFilter from '../components/CategoryFilter';
import Booklist from '../components/booklist';
import Header from '../components/Header';
import { useState } from 'react';
import CartSummary from '../components/CartSummary';
import TopMovieRecommendation from '../components/TopMovie';
import HorizontalCarousel from '../components/HorizontalCarousel';

const movieTitles = [
  '3022',
  'A Mission in an Old Movie',
  'Dogs of Berlin',
  'Afflicted',
  'Feel Rich',
  '100 Hotter',
  'Follow This',
  '1 Chance 2 Dance',
  'Slow Country',
  'Small Town Crime',
];

const getMovieItems = (titles: string[]) => {
  return titles.map((title, index) => ({
    id: (index + 1).toString(),
    imageUrl: `/images/Movie Posters/${title}.jpg`, // Adjust if necessary (e.g., file extensions like .jpeg, .png, etc.)
    linkUrl: `/show/${index + 1}`,
  }));
};

const movieItems = getMovieItems(movieTitles);

function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <>
      <Header />
      <TopMovieRecommendation />
      <br />
      <HorizontalCarousel title="Your Top Picks" items={movieItems} />
      <HorizontalCarousel title="Top Rated" items={movieItems} />
      <HorizontalCarousel title="Trending Now" items={movieItems} />
      <HorizontalCarousel title="Comedy" items={movieItems} />
      <HorizontalCarousel title="Fantasy" items={movieItems} />
      <HorizontalCarousel title="Kids" items={movieItems} />
      <HorizontalCarousel title="Action" items={movieItems} />
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
