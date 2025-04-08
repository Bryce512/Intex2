import CategoryFilter from "../components/CategoryFilter";
import Booklist from "../components/booklist";
import Header from "../components/Header";
import { useState } from "react";
import CartSummary from "../components/CartSummary";
import HeaderHome from "../components/HeaderHome";

function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <>
      <HeaderHome />
      <p className="text-success">ALL MOVIES</p>
    </>
  );
}

export default Home;
