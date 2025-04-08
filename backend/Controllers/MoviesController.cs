using intex2.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace intex2.Controllers;

[ApiController]
[Route("[controller]")]
public class MoviesController : ControllerBase
{

    private MoviesDbContext _context;

    public MoviesController(MoviesDbContext context)
    {
        _context = context;
    }

//     [HttpPost("register")]
//     public async Task<IActionResult> RegisterUser(
//         [FromBody] RegisterUser data,
//         [FromServices] UserManager<AppIdentityUser> userManager,
//         [FromServices] MoviesDbContext moviesContext)
//     {
//         if (data == null)
//             return BadRequest(new { message = "No data provided" });
//
//         var user = new AppIdentityUser
//         {
//             // UserName = data.Username,
//             Email = data.Email,
//         };
//
//         var result = await userManager.CreateAsync(user, data.Password);
//
//         if (!result.Succeeded)
//             return BadRequest(result.Errors);
//
//
//         return Ok(new { message = "User registered!" });
//     }
}