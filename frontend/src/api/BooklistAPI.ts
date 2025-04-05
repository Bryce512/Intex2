import { Book } from "../types/books";

interface fetchBooksResponse {
  books: Book[];
  totalNumBooks: number;
}
const API_URL =
  "https://intex2-backend-ezargqcgdwbgd4hq.westus3-01.azurewebsites.net/BookStore";

export const fetchBooks = async (
  page: number,
  resultsPerPage: number,
  selectedCategories: string[]
): Promise<fetchBooksResponse> => {
  try {
        const catParams = selectedCategories.map((c) => 
        `categories=${encodeURIComponent(c)}`)
        .join("&");
  
      const response = await fetch(
        `${API_URL}/AllBooks?pageNum=${page}&resultsPerPage=${resultsPerPage}${selectedCategories.length ? `&${catParams}` : ""}`
      );
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    const data = await response.json();
  
    return data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
  }
}

export const addBook = async (newBook: Book): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/AddBook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBook),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
};

export const updateBook = async (
  bookId: number,
  updatedBook: Book
): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/UpdateBook/${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBook),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }

}

export const deleteBook = async (bookId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/DeleteBook/${bookId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
}