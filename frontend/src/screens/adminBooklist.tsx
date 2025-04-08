import { useEffect, useState } from "react";
import { deleteBook, fetchBooks } from "../api/BooklistAPI";
import { Book } from "../types/books";
import '../css/adminBooklist.css';
import Pagination from "../components/pagination";
import NewBookForm from "../components/newBookForm";
import EditBookForm from "../components/editBookForm";
import Header from "../components/Header";
import AuthorizeView, { AuthorizedUser } from "../components/AuthorizeView";
import Logout from "../components/Logout";



function AdminBooklist() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks(page, resultsPerPage, []);
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / resultsPerPage));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }; loadBooks();
  }, [page, resultsPerPage, showForm, editingBook]);

  const handleDelete = async (bookId: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(bookId);
        setBooks((prevBooks) => prevBooks.filter((book) => book.bookId !== bookId));
        setTotalPages(Math.ceil((totalPages - 1) / resultsPerPage));
      } catch (error) {
        setError((error as Error).message);
      }
    }
  };

    if (loading) {
      return <p>Loading...</p>;
    }
    if (error) {
      return <p className="text-red-500">Error: {error}</p>;
    }

  return (
    <AuthorizeView>
      <span>
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>
      </span>
      <>
        <Header />
        <h1>Admin Library</h1>

        {!showForm && (
          <button
            className="btn btn-success mb-3"
            onClick={() => setShowForm(true)}
          >
            Add Book
          </button>
        )}

        {showForm && (
          <NewBookForm
            onSuccess={() => {
              setShowForm(false);
              fetchBooks(page, resultsPerPage, []).then((data) =>
                setBooks(data.books)
              );
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {editingBook && (
          <EditBookForm
            book={editingBook}
            onSuccess={() => {
              setEditingBook(null);
              fetchBooks(page, resultsPerPage, []).then((data) =>
                setBooks(data.books)
              );
            }}
            onCancel={() => setEditingBook(null)}
          />
        )}

        <table className="table-auto table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th className="px-4 py-2">Book ID</th>
              <th className="px-4 py-2">ISBN</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Author</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Publisher</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.bookId}>
                <td className="border px-4 py-2">{book.bookId}</td>
                <td className="border px-4 py-2">{book.isbn}</td>
                <td className="border px-4 py-2">{book.title}</td>
                <td className="border px-4 py-2">{book.author}</td>
                <td className="border px-4 py-2">{book.category}</td>
                <td className="border px-4 py-2">${book.price}</td>
                <td className="border px-4 py-2">{book.publisher}</td>
                <td>
                  <button
                    className="btn-blue mb-2 text-white px-4 py-2 rounded btn-edit btn-small"
                    onClick={() => {
                      setEditingBook(book);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-red text-white px-4 py-2 rounded ml-2"
                    onClick={() => handleDelete(book.bookId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          itemsPerPage={resultsPerPage}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setResultsPerPage(newSize);
            setPage(1);
          }}
        />
      </>
    </AuthorizeView>
  );
 
}
export default AdminBooklist;