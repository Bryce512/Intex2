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
    public IActionResult GetBooks(int pageNum ,int resultsPerPage, [FromQuery] List<string>? categories = null)
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
            bookList = books,
            totalBooks = totalBooks
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
}