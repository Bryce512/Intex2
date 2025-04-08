using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using intex2.Models;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace intex2.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly TopRatedRecommendationsDbContext _topRatedRecommendationsContext;
        private readonly UserRecommendationsDbContext _userRecommendationsContext;
        private readonly PopularRecommendationsDbContext _popularRecommendationsContext;
        private readonly FantasyRecommendationsDbContext _fantasyRecommendationsContext;
        private readonly ChildrenRecommendationsDbContext _childrenRecommendationsContext;
        private readonly ComedyRecommendationsDbContext _comedyRecommendationsContext;
        private readonly ActionRecommendationsDbContext _actionRecommendationsContext;
        private readonly MoviesDbContext _moviesContext;
        private readonly UserManager<MoviesUser> _userManager;
        private readonly SignInManager<MoviesUser> _signInManager;

        public MoviesController(TopRatedRecommendationsDbContext topRatedRecommendationsContext, UserRecommendationsDbContext userRecommendationsContext, PopularRecommendationsDbContext popularRecommendationsContext, FantasyRecommendationsDbContext fantasyRecommendationsContext, ChildrenRecommendationsDbContext childrenRecommendationsContext, ComedyRecommendationsDbContext comedyRecommendationsContext, ActionRecommendationsDbContext actionRecommendationsContext, MoviesDbContext moviesContext, UserManager<MoviesUser> userManager, SignInManager<MoviesUser> signInManager)
        {
            _topRatedRecommendationsContext = topRatedRecommendationsContext;
            _userRecommendationsContext = userRecommendationsContext;
            _popularRecommendationsContext = popularRecommendationsContext;
            _fantasyRecommendationsContext = fantasyRecommendationsContext;
            _childrenRecommendationsContext = childrenRecommendationsContext;
            _comedyRecommendationsContext = comedyRecommendationsContext;
            _actionRecommendationsContext = actionRecommendationsContext;
            _moviesContext = moviesContext;
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

        [HttpGet("UserActionMovies")]
        public async Task<IActionResult> GetUserActionMovies()
        {
            // Step 1: Get the currently logged-in user
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                // return Unauthorized(new { message = "User not logged in." });
                // Mock data for testing
                var mockMovies = new List<object>
                {
                    new { ShowId = "1", Title = "3022" },
                    new { ShowId = "2", Title = "A Mission in an Old Movie" },
                    new { ShowId = "3", Title = "Dogs of Berlin" },
                    new { ShowId = "4", Title = "Afflicted" },
                    new { ShowId = "5", Title = "Feel Rich" },
                    new { ShowId = "6", Title = "100 Hotter" },
                    new { ShowId = "7", Title = "Follow This" },
                    new { ShowId = "8", Title = "1 Chance 2 Dance" },
                    new { ShowId = "9", Title = "Slow Country" },
                    new { ShowId = "10", Title = "Small Town Crime" }
                };
                return Ok(mockMovies);
            }

            // Step 2: Look up this user's recommendations
            var recs = _actionRecommendationsContext.Recommendations.FirstOrDefault(r => r.UserId == user.Id);

            if (recs == null)
            {
                return NotFound(new { message = "No action recommendations found for this user." });
            }

            // Step 3: Collect all the show IDs from the recommendations
            var showIds = new List<string?>
            {
                recs.Rec1, recs.Rec2, recs.Rec3, recs.Rec4, recs.Rec5,
                recs.Rec6, recs.Rec7, recs.Rec8, recs.Rec9, recs.Rec10
            }.Where(id => !string.IsNullOrEmpty(id)).ToList();

            // Step 4: Match those show IDs with movies from Movies.db
            var movies = _moviesContext.MoviesTitles
                .Where(m => showIds.Contains(m.ShowId))
                .Select(m => new { m.ShowId, m.Title })
                .ToList();

            return Ok(movies);
        }

        [HttpGet("UserComedyMovies")]
        public async Task<IActionResult> GetUserComedyMovies()
        {
            // Step 1: Get the currently logged-in user
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                // return Unauthorized(new { message = "User not logged in." });
                // Mock data for testing
                var mockMovies = new List<object>
                {
                    new { ShowId = "1", Title = "Small Chops" },
                    new { ShowId = "2", Title = "A Mission in an Old Movie" },
                    new { ShowId = "3", Title = "Dogs of Berlin" },
                    new { ShowId = "4", Title = "Afflicted" },
                    new { ShowId = "5", Title = "Feel Rich" },
                    new { ShowId = "6", Title = "100 Hotter" },
                    new { ShowId = "7", Title = "Follow This" },
                    new { ShowId = "8", Title = "1 Chance 2 Dance" },
                    new { ShowId = "9", Title = "Slow Country" },
                    new { ShowId = "10", Title = "Small Town Crime" }
                };
                return Ok(mockMovies);
            }

            // Step 2: Look up this user's recommendations
            var recs = _comedyRecommendationsContext.Recommendations.FirstOrDefault(r => r.UserId == user.Id);

            if (recs == null)
            {
                return NotFound(new { message = "No comedy recommendations found for this user." });
            }

            // Step 3: Collect all the show IDs from the recommendations
            var showIds = new List<string?>
            {
                recs.Rec1, recs.Rec2, recs.Rec3, recs.Rec4, recs.Rec5,
                recs.Rec6, recs.Rec7, recs.Rec8, recs.Rec9, recs.Rec10
            }.Where(id => !string.IsNullOrEmpty(id)).ToList();

            // Step 4: Match those show IDs with movies from Movies.db
            var movies = _moviesContext.MoviesTitles
                .Where(m => showIds.Contains(m.ShowId))
                .Select(m => new { m.ShowId, m.Title })
                .ToList();

            return Ok(movies);
        }

        [HttpGet("UserChildrenMovies")]
        public async Task<IActionResult> GetUserChildrenMovies()
        {
            // Step 1: Get the currently logged-in user
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                // return Unauthorized(new { message = "User not logged in." });
                // Mock data for testing
                var mockMovies = new List<object>
                {
                    new { ShowId = "1", Title = "Shooter" },
                    new { ShowId = "2", Title = "A Mission in an Old Movie" },
                    new { ShowId = "3", Title = "Dogs of Berlin" },
                    new { ShowId = "4", Title = "Afflicted" },
                    new { ShowId = "5", Title = "Feel Rich" },
                    new { ShowId = "6", Title = "100 Hotter" },
                    new { ShowId = "7", Title = "Follow This" },
                    new { ShowId = "8", Title = "1 Chance 2 Dance" },
                    new { ShowId = "9", Title = "Slow Country" },
                    new { ShowId = "10", Title = "Small Town Crime" }
                };
                return Ok(mockMovies);
            }

            // Step 2: Look up this user's recommendations
            var recs = _childrenRecommendationsContext.Recommendations.FirstOrDefault(r => r.UserId == user.Id);

            if (recs == null)
            {
                return NotFound(new { message = "No children recommendations found for this user." });
            }

            // Step 3: Collect all the show IDs from the recommendations
            var showIds = new List<string?>
            {
                recs.Rec1, recs.Rec2, recs.Rec3, recs.Rec4, recs.Rec5,
                recs.Rec6, recs.Rec7, recs.Rec8, recs.Rec9, recs.Rec10
            }.Where(id => !string.IsNullOrEmpty(id)).ToList();

            // Step 4: Match those show IDs with movies from Movies.db
            var movies = _moviesContext.MoviesTitles
                .Where(m => showIds.Contains(m.ShowId))
                .Select(m => new { m.ShowId, m.Title })
                .ToList();

            return Ok(movies);
        }

        [HttpGet("UserFantasyMovies")]
        public async Task<IActionResult> GetUserFantasyMovies()
        {
            // Step 1: Get the currently logged-in user
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                // return Unauthorized(new { message = "User not logged in." });
                // Mock data for testing
                var mockMovies = new List<object>
                {
                    new { ShowId = "1", Title = "Scissor Seven" },
                    new { ShowId = "2", Title = "A Mission in an Old Movie" },
                    new { ShowId = "3", Title = "Dogs of Berlin" },
                    new { ShowId = "4", Title = "Afflicted" },
                    new { ShowId = "5", Title = "Feel Rich" },
                    new { ShowId = "6", Title = "100 Hotter" },
                    new { ShowId = "7", Title = "Follow This" },
                    new { ShowId = "8", Title = "1 Chance 2 Dance" },
                    new { ShowId = "9", Title = "Slow Country" },
                    new { ShowId = "10", Title = "Small Town Crime" }
                };
                return Ok(mockMovies);
            }

            // Step 2: Look up this user's recommendations
            var recs = _fantasyRecommendationsContext.Recommendations.FirstOrDefault(r => r.UserId == user.Id);

            if (recs == null)
            {
                return NotFound(new { message = "No fantasy recommendations found for this user." });
            }

            // Step 3: Collect all the show IDs from the recommendations
            var showIds = new List<string?>
            {
                recs.Rec1, recs.Rec2, recs.Rec3, recs.Rec4, recs.Rec5,
                recs.Rec6, recs.Rec7, recs.Rec8, recs.Rec9, recs.Rec10
            }.Where(id => !string.IsNullOrEmpty(id)).ToList();

            // Step 4: Match those show IDs with movies from Movies.db
            var movies = _moviesContext.MoviesTitles
                .Where(m => showIds.Contains(m.ShowId))
                .Select(m => new { m.ShowId, m.Title })
                .ToList();

            return Ok(movies);
        }

        [HttpGet("UserMovies")]
        public async Task<IActionResult> GetUserMovies()
        {
            // Step 1: Get the currently logged-in user
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                // return Unauthorized(new { message = "User not logged in." });
                // Mock data for testing
                var mockMovies = new List<object>
                {
                    new { ShowId = "1", Title = "Sweet Girl" },
                    new { ShowId = "2", Title = "A Mission in an Old Movie" },
                    new { ShowId = "3", Title = "Dogs of Berlin" },
                    new { ShowId = "4", Title = "Afflicted" },
                    new { ShowId = "5", Title = "Feel Rich" },
                    new { ShowId = "6", Title = "100 Hotter" },
                    new { ShowId = "7", Title = "Follow This" },
                    new { ShowId = "8", Title = "1 Chance 2 Dance" },
                    new { ShowId = "9", Title = "Slow Country" },
                    new { ShowId = "10", Title = "Small Town Crime" }
                };
                return Ok(mockMovies);
            }

            // Step 2: Look up this user's recommendations
            var recs = _userRecommendationsContext.Recommendations.FirstOrDefault(r => r.UserId == user.Id);

            if (recs == null)
            {
                return NotFound(new { message = "No recommendations found for this user." });
            }

            // Step 3: Collect all the show IDs from the recommendations
            var showIds = new List<string?>
            {
                recs.Rec1, recs.Rec2, recs.Rec3, recs.Rec4, recs.Rec5,
                recs.Rec6, recs.Rec7, recs.Rec8, recs.Rec9, recs.Rec10
            }.Where(id => !string.IsNullOrEmpty(id)).ToList();

            // Step 4: Match those show IDs with movies from Movies.db
            var movies = _moviesContext.MoviesTitles
                .Where(m => showIds.Contains(m.ShowId))
                .Select(m => new { m.ShowId, m.Title })
                .ToList();

            return Ok(movies);
        }

        [HttpGet("TopRatedMovies")]
        public async Task<IActionResult> GetTopRatedMovies()
        {
            // Step 1: Get all top-rated movies
            var topRatedMovies = await _topRatedRecommendationsContext.TopRatedRecommendations
                .Take(20)
                .Select(r => new { r.ShowId, r.Title })
                .ToListAsync();

            if (topRatedMovies == null || !topRatedMovies.Any())
            {
                return NotFound(new { message = "No top-rated movies found." });
            }

            return Ok(topRatedMovies);
        }

        [HttpGet("PopularMovies")]
        public async Task<IActionResult> GetPopularMovies()
        {
            // Step 1: Get all popular movies
            var popularMovies = await _popularRecommendationsContext.PopularRecommendations
                .Take(20)
                .Select(r => new { r.ShowId, r.Title })
                .ToListAsync();

            if (popularMovies == null || !popularMovies.Any())
            {
                return NotFound(new { message = "No popular movies found." });
            }

            return Ok(popularMovies);
        }
    }
}

