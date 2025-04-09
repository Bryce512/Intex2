using Microsoft.AspNetCore.Identity;
using intex2.Models;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

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
        private readonly UserManager<AppIdentityUser> _userManager;
        private readonly SignInManager<AppIdentityUser> _signInManager;

        public MoviesController(
            TopRatedRecommendationsDbContext topRatedRecommendationsContext,
            UserRecommendationsDbContext userRecommendationsContext,
            PopularRecommendationsDbContext popularRecommendationsContext,
            FantasyRecommendationsDbContext fantasyRecommendationsContext,
            ChildrenRecommendationsDbContext childrenRecommendationsContext,
            ComedyRecommendationsDbContext comedyRecommendationsContext,
            ActionRecommendationsDbContext actionRecommendationsContext,
            MoviesDbContext moviesContext,
            UserManager<AppIdentityUser> userManager,
            SignInManager<AppIdentityUser> signInManager)
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

        [Authorize]
        [HttpGet("UserActionMovies")]
        public async Task<IActionResult> GetUserActionMovies()
        {
            // Step 1: Get the currently logged-in user
            var user = await _userManager.GetUserAsync(User);

            Console.WriteLine($"CURRENT USER: {user}");

            if (user == null)
            {
                // return Unauthorized(new { message = "User not logged in." });
                // Mock data for testing
                var mockMovies = new List<object>
                {
                    new { ShowId = "s1", Title = "3022" },
                    new { ShowId = "s2", Title = "A Mission in an Old Movie" },
                    new { ShowId = "s3", Title = "Dogs of Berlin" },
                    new { ShowId = "s4", Title = "Afflicted" },
                    new { ShowId = "s5", Title = "Feel Rich" },
                    new { ShowId = "s6", Title = "100 Hotter" },
                    new { ShowId = "s7", Title = "Follow This" },
                    new { ShowId = "s8", Title = "1 Chance 2 Dance" },
                    new { ShowId = "s9", Title = "Slow Country" },
                    new { ShowId = "s10", Title = "Small Town Crime" }
                };
                return Ok(mockMovies);
            }


            Console.WriteLine($"CURRENT USER ID: {user.Id}");

            // Step 2: Look up this user's recommendations
            var recs = _actionRecommendationsContext.Recommendations.FirstOrDefault(r => r.UserId == user.Id);

            Console.WriteLine($"CURRENT RECS: {System.Text.Json.JsonSerializer.Serialize(recs)}");

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

            Console.WriteLine($"CURRENT SHOWIDS: {string.Join(", ", showIds)}");

            // Step 4: Match those show IDs with movies from Movies.db
            var movies = _moviesContext.MoviesTitles
                .Where(m => showIds.Contains(m.ShowId))
                .Select(m => new { m.ShowId, m.Title })
                .ToList();

            Console.WriteLine($"CURRENT MOVIES: {movies}");

            return Ok(movies);
        }

        [Authorize]
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
                    new { ShowId = "s1", Title = "Small Chops" },
                    new { ShowId = "s2", Title = "A Mission in an Old Movie" },
                    new { ShowId = "s3", Title = "Dogs of Berlin" },
                    new { ShowId = "s4", Title = "Afflicted" },
                    new { ShowId = "s5", Title = "Feel Rich" },
                    new { ShowId = "s6", Title = "100 Hotter" },
                    new { ShowId = "s7", Title = "Follow This" },
                    new { ShowId = "s8", Title = "1 Chance 2 Dance" },
                    new { ShowId = "s9", Title = "Slow Country" },
                    new { ShowId = "s10", Title = "Small Town Crime" }
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

        [Authorize]
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
                    new { ShowId = "s1", Title = "Shooter" },
                    new { ShowId = "s2", Title = "A Mission in an Old Movie" },
                    new { ShowId = "s3", Title = "Dogs of Berlin" },
                    new { ShowId = "s4", Title = "Afflicted" },
                    new { ShowId = "s5", Title = "Feel Rich" },
                    new { ShowId = "s6", Title = "100 Hotter" },
                    new { ShowId = "s7", Title = "Follow This" },
                    new { ShowId = "s8", Title = "1 Chance 2 Dance" },
                    new { ShowId = "s9", Title = "Slow Country" },
                    new { ShowId = "s10", Title = "Small Town Crime" }
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

        [Authorize]
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
                    new { ShowId = "s1", Title = "Scissor Seven" },
                    new { ShowId = "s2", Title = "A Mission in an Old Movie" },
                    new { ShowId = "s3", Title = "Dogs of Berlin" },
                    new { ShowId = "s4", Title = "Afflicted" },
                    new { ShowId = "s5", Title = "Feel Rich" },
                    new { ShowId = "s6", Title = "100 Hotter" },
                    new { ShowId = "s7", Title = "Follow This" },
                    new { ShowId = "s8", Title = "1 Chance 2 Dance" },
                    new { ShowId = "s9", Title = "Slow Country" },
                    new { ShowId = "s10", Title = "Small Town Crime" }
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

        [Authorize]
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
                    new { ShowId = "s1", Title = "Sweet Girl" },
                    new { ShowId = "s2", Title = "A Mission in an Old Movie" },
                    new { ShowId = "s3", Title = "Dogs of Berlin" },
                    new { ShowId = "s4", Title = "Afflicted" },
                    new { ShowId = "s5", Title = "Feel Rich" },
                    new { ShowId = "s6", Title = "100 Hotter" },
                    new { ShowId = "s7", Title = "Follow This" },
                    new { ShowId = "s8", Title = "1 Chance 2 Dance" },
                    new { ShowId = "s9", Title = "Slow Country" },
                    new { ShowId = "s10", Title = "Small Town Crime" }
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
        
        [HttpGet("AllMovies")]
        public IActionResult GetMovies(int pageNum, int resultsPerPage)
        {
            var query = _moviesContext.MoviesTitles.AsQueryable();

            var totalMovies = query.Count();

            var movies = query
                .Skip((pageNum - 1) * resultsPerPage)
                .Take(resultsPerPage)
                .ToList();

            return Ok(new
            {
                movies = movies,
                totalNumMovies = totalMovies
            });
        }



        // [HttpGet ("getCategories")]
        // public List<string> GetCategories()
        // {
        //     var categories = _context.Books
        //         .Select(x => x.Category)
        //         .Distinct()
        //         .ToList();
        //
        //     return categories;
        // }

        [HttpPost("AddMovie")]
        public IActionResult AddMovie([FromBody] MoviesTitle newMovie)
        {
            _moviesContext.MoviesTitles.Add(newMovie);
            _moviesContext.SaveChanges();
            return Ok(newMovie);
        }

        [HttpDelete("DeleteMovie/{id}")]
        public IActionResult DeleteMovie(string id)
        {
            var movie = _moviesContext.MoviesTitles.Find(id);
            if (movie == null)
            {
                return NotFound();
            }

            _moviesContext.MoviesTitles.Remove(movie);
            _moviesContext.SaveChanges();
            return Ok(movie);
        }

        [HttpPut("UpdateMovie/{id}")]
        public IActionResult UpdateMovie(string id,[FromBody] MoviesTitle updatedMovie)
        {
            var movie = _moviesContext.MoviesTitles.Find(id);
            if (movie == null)
            {
                return NotFound();
            }
            movie.Title = updatedMovie.Title;
            movie.Director = updatedMovie.Director;
            movie.Cast = updatedMovie.Cast;
            movie.Country = updatedMovie.Country;
            movie.ReleaseYear = updatedMovie.ReleaseYear;
            movie.Type = updatedMovie.Type;
            movie.Rating = updatedMovie.Rating;
            movie.Duration = updatedMovie.Duration;
            movie.Description = updatedMovie.Description;
            movie.Action = updatedMovie.Action;
            movie.Adventure = updatedMovie.Adventure;
            movie.AnimeSeriesInternationalTvShows = updatedMovie.AnimeSeriesInternationalTvShows;
            movie.BritishTvShowsDocuseriesInternationalTvShows = updatedMovie.BritishTvShowsDocuseriesInternationalTvShows;
            movie.Children = updatedMovie.Children;
            movie.Comedies = updatedMovie.Comedies;
            movie.ComediesDramasInternationalMovies = updatedMovie.ComediesDramasInternationalMovies;
            movie.ComediesInternationalMovies = updatedMovie.ComediesInternationalMovies;
            movie.ComediesRomanticMovies = updatedMovie.ComediesRomanticMovies;
            movie.CrimeTvShowsDocuseries = updatedMovie.CrimeTvShowsDocuseries;
            movie.Documentaries = updatedMovie.Documentaries;
            movie.DocumentariesInternationalMovies = updatedMovie.DocumentariesInternationalMovies;
            movie.Docuseries = updatedMovie.Docuseries;
            movie.Dramas = updatedMovie.Dramas;
            movie.DramasInternationalMovies = updatedMovie.DramasInternationalMovies;
            movie.DramasRomanticMovies = updatedMovie.DramasRomanticMovies;
            movie.FamilyMovies = updatedMovie.FamilyMovies;
            movie.Fantasy = updatedMovie.Fantasy;
            movie.HorrorMovies = updatedMovie.HorrorMovies;
            movie.InternationalMoviesThrillers = updatedMovie.InternationalMoviesThrillers;
            movie.InternationalTvShowsRomanticTvShowsTvDramas = updatedMovie.InternationalTvShowsRomanticTvShowsTvDramas;
            movie.KidsTv = updatedMovie.KidsTv;
            movie.LanguageTvShows = updatedMovie.LanguageTvShows;
            movie.Musicals = updatedMovie.Musicals;
            movie.NatureTv = updatedMovie.NatureTv;
            movie.RealityTv = updatedMovie.RealityTv;
            movie.Spirituality = updatedMovie.Spirituality;
            movie.TvAction = updatedMovie.TvAction;
            movie.TvComedies = updatedMovie.TvComedies;
            movie.TvDramas = updatedMovie.TvDramas;
            movie.TalkShowsTvComedies = updatedMovie.TalkShowsTvComedies;
            movie.Thrillers = updatedMovie.Thrillers;

            _moviesContext.MoviesTitles.Update(movie);
            _moviesContext.SaveChanges();
            return Ok(movie);
        }

        [HttpGet("GetMovieDetails/{id}")]
        public IActionResult GetMovieDetails(string id)
        {
            var movie = _moviesContext.MoviesTitles.Find(id);
            if (movie == null)
            {
                return NotFound();
            }
            return Ok(movie);
        }
        
    }
}

