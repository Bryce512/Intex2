import CategoryFilter from "../components/CategoryFilter";
import Booklist from "../components/booklist";
import Header from "../components/Header";
import { useState } from "react";
import CartSummary from "../components/CartSummary";
import HeaderBuilder from "../components/HeaderBuilder";

function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); 

  return (
    <>
      <HeaderBuilder />
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

