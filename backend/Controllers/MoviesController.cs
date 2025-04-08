using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using intex2.Models;
using System.Linq;
using System.Threading.Tasks;

namespace intex2.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly MoviesDbContext _context;
        private readonly UserManager<MoviesUser> _userManager;
        private readonly SignInManager<MoviesUser> _signInManager;

        public MoviesController(MoviesDbContext context, UserManager<MoviesUser> userManager, SignInManager<MoviesUser> signInManager)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.Username) || string.IsNullOrWhiteSpace(model.Password))
            {
                return BadRequest(new { message = "Username and password are required." });
            }

            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null)
            {
                return Unauthorized(new { message = "User not found." });
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded)
            {
                return Unauthorized(new { message = "Invalid password." });
            }

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                user = new
                {
                    id = user.Id,
                    username = user.UserName,
                    name = user.Name,
                    role = roles.FirstOrDefault()
                }
            });
        }
        
        
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterUser data)
        {
            Console.WriteLine(data);
                if (data == null)
    {
        Console.WriteLine("RegisterUser data is null");
        return BadRequest(new { message = "No data provided" });
    }
        Console.WriteLine($"Received: Username='{data.Username ?? "null"}', Email='{data.Email ?? "null"}', Name='{data.Name ?? "null"}', Password length={data.Password?.Length ?? 0}");

            // Create a new user object
            var user = new MoviesUser
            {
                UserName = data.Username,
                Email = data.Email,
                Name = data.Name
            };

            var result = await _userManager.CreateAsync(user, data.Password);

            if (result.Succeeded)
            {
                // Optionally, you can sign the user in immediately after creation
                await _signInManager.SignInAsync(user, isPersistent: false);

                return Ok("User created successfully!");
            }

            return BadRequest(result.Errors);
        }
        
    }
}

