import { useEffect, useState } from "react";
import { Book } from "../types/books";
import { cartItem } from "../types/cartItem";
import { useCart } from "../context/CartContext";
import { fetchBooks } from "../api/BooklistAPI";
import Pagination from "./pagination";

function booklist(
  {selectedCategories} : {selectedCategories: string[] }
) {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(page, resultsPerPage, selectedCategories);
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / resultsPerPage));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, [page, resultsPerPage, selectedCategories]);

  if (loading) {return <p>Loading...</p>;}
  if (error) {return <p className="text-red-500">Error: {error}</p>;}

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

  const booksArray = Array.isArray(books) ? books : [];

  // Filter books based on the search term
  const filteredBooks = booksArray.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <Pagination currentPage={page}
         totalPages={totalPages}
         itemsPerPage={resultsPerPage}
         onPageChange={setPage}
         onPageSizeChange={(newSize) => {
          setResultsPerPage(newSize);
          setPage(1)
        }}/>
      <br />
    </>
  );
}

export default booklist;
