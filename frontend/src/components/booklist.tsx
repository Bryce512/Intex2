import { useEffect, useState } from "react";
import { Book } from "../types/books";
import { cartItem } from "../types/cartItem";
import { useCart } from "../context/CartContext";

function booklist(
  {selectedCategories} : {selectedCategories: string[] }
) {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const {addToCart} = useCart();


  // Filter books based on the search term
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );


  useEffect(() => {
  const fetchBooks = async () => {
      const catParams = selectedCategories.map((c) => 
      `categories=${encodeURIComponent(c)}`)
      .join("&")

      const response = await fetch(
        `https://localhost:5000/BookStore/AllBooks?pageNum=${page}&resultsPerPage=${resultsPerPage}${selectedCategories.length ? `&${catParams}`: ''}`
      );
      const data = await response.json();
      setBooks(data.bookList);
      setTotalResults(data.totalBooks);
      setTotalPages(Math.ceil(totalResults / resultsPerPage));
    };

    fetchBooks();
  }, [resultsPerPage, page, selectedCategories, totalResults]);

  const handleAddToCart = (book: Book) => {
    const newItem: cartItem = {
      bookId: book.bookId,
      bookPrice: book.price,
      bookTitle: book.title,
      totalPrice: book.price, // Assuming totalPrice is the same as price for now
      quantity: 1, // Default quantity set to 1
    };
    // Set the alert message and show it
    setAlertMessage(`${book.title} has been added to the cart!`);
    setShowAlert(true);

    // Hide the alert after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    addToCart(newItem);
  };
  


  return (
    <>
      {showAlert && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          {alertMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowAlert(false)}
          ></button>
        </div>
      )}
      <input
        type="text"
        placeholder="Search by book name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <br />
      <br />
      {filteredBooks.map((book) => (
        <div key={book.bookId} className="card">
          <h2 className="card-title"> {book.title}</h2>
          <div className="card-body">
            <ul className="list-unstyled">
              <li>
                <strong>Author: </strong>
                {book.author}
              </li>
              <li>
                <strong>Genre: </strong>
                {book.classification}
              </li>
              <li>
                <strong>Publisher: </strong>
                {book.publisher}
              </li>
              <li>
                <strong>Page Count: </strong>
                {book.pageCount}
              </li>
              <li>
                <strong>Price: </strong>
                {book.price}
              </li>
              <li>
                <strong>ISBN: </strong>
                {book.isbn}
              </li>
            </ul>
            <button
              className="btn btn-success"
              onClick={() => {
                handleAddToCart(book);
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
      <br />

      <div>
        <button>Previous</button>

        {[...Array(totalPages)].map((_, i) => (
          <button key={i} onClick={() => setPage(i + 1)}>
            {i + 1}
          </button>
        ))}

        <button>Next</button>
      </div>

      <br />
      <label>
        Results per page:
        <span> </span>
        <select
          value={resultsPerPage}
          onChange={(p) => {
            console.log("results per page: ", p.target.value);
            setResultsPerPage(Number(p.target.value));
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </label>
    </>
  );
}

export default booklist;
