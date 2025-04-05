import { useEffect, useState } from "react";
import "../css/categoryFilter.css";


function CategoryFilter(
  {
    setSelectedCategories,
    selectedCategories,
  }: 
  { setSelectedCategories: (categories: string[]) => void,
    selectedCategories: string[] }
) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        fetch(
          "https://bookstore-backend-hrceaafxeyd9akfy.westus3-01.azurewebsites.net/BookStore/getCategories"
        )
          .then((response) => response.json())
          .then((data) => setCategories(data));
      } catch (e) {
        console.error("Error fetching categories:", e);
      }
    };
    fetchCategories();
  }, []);

  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedCategories = selectedCategories.includes(target.value)
      ? selectedCategories.filter((x) => x !== target.value)
      : [...selectedCategories, target.value];

    setSelectedCategories(updatedCategories);
  }

  return (
    <div className="CategoryFilter">
      <h2>Categories</h2>
      <div className="categoryList">
        {categories.map((c) => (
          <div key={c} className="categoryItem">
            <input
              type="checkbox"
              id={c}
              value={c}
              onChange={handleCheckboxChange}
            />
            <label htmlFor={c}>{c}</label>
          </div>
        ))}
      </div>
    </div>
  );
}


export default CategoryFilter;