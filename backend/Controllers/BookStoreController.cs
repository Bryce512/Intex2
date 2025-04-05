using Microsoft.AspNetCore.Mvc;
using intex2.Models;

namespace intex2.Controllers;

[ApiController]
[Route("[controller]")]

public class BookStoreController : ControllerBase
{
    private BookstoreContext _context;
    public BookStoreController(BookstoreContext temp)
    {
        _context = temp;
    }

    [HttpGet("AllBooks")]
    public IActionResult GetBooks(int pageNum , int resultsPerPage, [FromQuery] List<string>? categories = null)
    {
        var query = _context.Books.AsQueryable();

        if (categories != null && categories.Any()) {
            query = query.Where(c => categories.Contains(c.Category));
        }

        var totalBooks = query.Count();

        var books =  query
            .Skip((pageNum-1) * resultsPerPage)
            .Take(resultsPerPage)
            .ToList();
        

        return Ok(new
        {
            books = books,
            totalNumBooks = totalBooks
        });
    }

    [HttpGet ("getCategories")]
    public List<string> GetCategories()
    {
        var categories = _context.Books
            .Select(x => x.Category)
            .Distinct()
            .ToList();

        return categories;
    }

    [HttpPost("AddBook")]
    public IActionResult AddBook([FromBody] Book newBook)
    {
        _context.Books.Add(newBook);
        _context.SaveChanges();
        return Ok(newBook);
    }

    [HttpDelete("DeleteBook/{id}")]
    public IActionResult DeleteBook(int id)
    {
        var book = _context.Books.Find(id);
        if (book == null)
        {
            return NotFound();
        }

        _context.Books.Remove(book);
        _context.SaveChanges();
        return Ok(book);
    }

    [HttpPut("UpdateBook/{id}")]
    public IActionResult UpdateBook(int id,[FromBody] Book updatedBook)
    {
        var book = _context.Books.Find(id);
        if (book == null)
        {
            return NotFound();
        }
        book.Title = updatedBook.Title;
        book.Author = updatedBook.Author;
        book.Category = updatedBook.Category;
        book.Price = updatedBook.Price;
        book.Classification = updatedBook.Classification;
        book.Isbn = updatedBook.Isbn;
        book.Publisher = updatedBook.Publisher;
        book.PageCount = updatedBook.PageCount;

        _context.Books.Update(book);
        _context.SaveChanges();
        return Ok(book);
    }
        
}