using Microsoft.AspNetCore.Identity;
using intex2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.Sqlite;

namespace intex2.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly MovieToMovieRecommendationsDbContext _movieToMovieRecommendationsContext;
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
        private readonly IConfiguration _config;


        public MoviesController(
            MovieToMovieRecommendationsDbContext movieToMovieRecommendationsContext,
            TopRatedRecommendationsDbContext topRatedRecommendationsContext,
            UserRecommendationsDbContext userRecommendationsContext,
            PopularRecommendationsDbContext popularRecommendationsContext,
            FantasyRecommendationsDbContext fantasyRecommendationsContext,
            ChildrenRecommendationsDbContext childrenRecommendationsContext,
            ComedyRecommendationsDbContext comedyRecommendationsContext,
            ActionRecommendationsDbContext actionRecommendationsContext,
            MoviesDbContext moviesContext,
            UserManager<AppIdentityUser> userManager,
            SignInManager<AppIdentityUser> signInManager,
            IConfiguration config)
        {
            _movieToMovieRecommendationsContext = movieToMovieRecommendationsContext;
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
            _config = config;
        }

        [Authorize(Roles = "admin,user")]
        [HttpGet("AllMoviesMax")]
        public async Task<IActionResult> GetMoviesPaged(string search = "", int page = 1, int pageSize = 20, string genres = "", bool exactMatch = false)
        {
            Console.WriteLine($"CURRENT SEARCH: {search}");
            Console.WriteLine($"SELECTED GENRES: {genres}");

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized(new { message = "User not logged in." });
            }

            // Step 1: Start the query
            var query = _moviesContext.MoviesTitles.AsQueryable();

            // Step 2: Apply search filter with prioritization
            if (!string.IsNullOrWhiteSpace(search))
            {
                string searchLower = search.ToLower().Trim();
                Console.WriteLine($"Debug - Searching for: '{searchLower}'");
                
                // Simplified SQL approach that ensures we catch all matches
                var sql = @"
                    SELECT m.*, 
                        CASE 
                            WHEN LOWER(m.Title) LIKE @startsWithPattern THEN 0 
                            ELSE 1 
                        END AS SortOrder 
                    FROM movies_titles m
                    WHERE LOWER(m.Title) LIKE @containsPattern COLLATE NOCASE
                    ORDER BY 
                        SortOrder,
                        m.Title
                    LIMIT @take OFFSET @skip";
                
                var startsWithPattern = searchLower + "%";
                var containsPattern = "%" + searchLower + "%";
                
                // Log patterns for debugging
                Console.WriteLine($"Debug - StartsWith pattern: '{startsWithPattern}'");
                Console.WriteLine($"Debug - Contains pattern: '{containsPattern}'");
                
                var parameters = new object[] {
                    new SqliteParameter("@startsWithPattern", startsWithPattern),
                    new SqliteParameter("@containsPattern", containsPattern),
                    new SqliteParameter("@skip", (page - 1) * pageSize),
                    new SqliteParameter("@take", pageSize)
                };
                
                var results = await _moviesContext.MoviesTitles.FromSqlRaw(sql, parameters).ToListAsync();
                
                // Debug output
                Console.WriteLine($"Debug - Found {results.Count} results");
                if (results.Count > 0)
                {
                    Console.WriteLine($"Debug - First 5 results: {string.Join(", ", results.Take(5).Select(m => m.Title))}");
                }
                
                // Fix the count query to get accurate total count
                int totalRecords = 0;
                using (var connection = _moviesContext.Database.GetDbConnection())
                {
                    // Simplified count query
                    var countSql = @"
                        SELECT COUNT(*) 
                        FROM movies_titles m 
                        WHERE LOWER(m.Title) LIKE @containsPattern COLLATE NOCASE";
                    
                    var command = connection.CreateCommand();
                    command.CommandText = countSql;
                    
                    // Only need the containsPattern parameter
                    var contains = command.CreateParameter();
                    contains.ParameterName = "@containsPattern";
                    contains.Value = containsPattern;
                    command.Parameters.Add(contains);
                    
                    if (connection.State != System.Data.ConnectionState.Open)
                        await connection.OpenAsync();
                    
                    var result = await command.ExecuteScalarAsync();
                    if (result != null && result != DBNull.Value)
                        totalRecords = Convert.ToInt32(result);
                    
                    Console.WriteLine($"Debug - Total records matching: {totalRecords}");
                }
                
                var moviesList = results.Select(m => new {
                    m.ShowId,
                    m.Title,
                    Genres = GetGenresForMovie(m),
                    StartsWithMatch = m.Title.ToLower().StartsWith(searchLower)
                });
                
                return Ok(new {
                    result = moviesList,
                    hasMore = (page * pageSize) < totalRecords
                });
            }

            // Step 3: Apply genre filters
            if (!string.IsNullOrWhiteSpace(genres))
            {
                var genreList = genres.Split(',').Select(g => g.Trim()).ToList();

                query = query.Where(m =>
                    genreList.Any(genre =>
                        (genre == "Fantasy" && m.Fantasy == 1) ||
                        (genre == "Action" && m.Action == 1) ||
                        (genre == "Comedy" && m.Comedies == 1) ||
                        (genre == "Children" && m.Children == 1) ||
                        (genre == "Docuseries" && m.Docuseries == 1)
                    )
                );
            }

            // Step 4: Order by title (to keep pagination stable)
            query = query.OrderBy(m => m.Title);

            // Step 5: Get total count AFTER filters
            var totalCount = await query.CountAsync();

            // Step 6: Fetch paginated data
            var moviesRaw = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var movies = moviesRaw.Select(m => new
            {
                m.ShowId,
                m.Title,
                Genres = GetGenresForMovie(m)
            });

            // Step 7: Return result with hasMore
            return Ok(new
            {
                result = movies,
                hasMore = (page * pageSize) < totalCount
            });
        }


        // Helper method to dynamically extract genres
        private static List<string> GetGenresForMovie(MoviesTitle movie)
        {
            var genres = new List<string>();

            // Check each genre column and add to the list if the value is 1
            if (movie.Action == 1) genres.Add("Action");
            if (movie.Adventure == 1) genres.Add("Adventure");
            if (movie.AnimeSeriesInternationalTvShows == 1) genres.Add("Anime Series International TV Shows");
            if (movie.BritishTvShowsDocuseriesInternationalTvShows == 1) genres.Add("British TV Shows Docuseries International TV Shows");
            if (movie.Children == 1) genres.Add("Children");
            if (movie.Comedies == 1) genres.Add("Comedies");
            if (movie.ComediesDramasInternationalMovies == 1) genres.Add("Comedies Dramas International Movies");
            if (movie.ComediesInternationalMovies == 1) genres.Add("Comedies International Movies");
            if (movie.ComediesRomanticMovies == 1) genres.Add("Comedies Romantic Movies");
            if (movie.CrimeTvShowsDocuseries == 1) genres.Add("Crime TV Shows Docuseries");
            if (movie.Documentaries == 1) genres.Add("Documentaries");
            if (movie.DocumentariesInternationalMovies == 1) genres.Add("Documentaries International Movies");
            if (movie.Docuseries == 1) genres.Add("Docuseries");
            if (movie.Dramas == 1) genres.Add("Dramas");
            if (movie.DramasInternationalMovies == 1) genres.Add("Dramas International Movies");
            if (movie.DramasRomanticMovies == 1) genres.Add("Dramas Romantic Movies");
            if (movie.FamilyMovies == 1) genres.Add("Family Movies");
            if (movie.Fantasy == 1) genres.Add("Fantasy");
            if (movie.HorrorMovies == 1) genres.Add("Horror Movies");
            if (movie.InternationalMoviesThrillers == 1) genres.Add("International Movies Thrillers");
            if (movie.InternationalTvShowsRomanticTvShowsTvDramas == 1) genres.Add("International TV Shows Romantic TV Shows TV Dramas");
            if (movie.KidsTv == 1) genres.Add("Kids' TV");
            if (movie.LanguageTvShows == 1) genres.Add("Language TV Shows");
            if (movie.Musicals == 1) genres.Add("Musicals");
            if (movie.NatureTv == 1) genres.Add("Nature TV");
            if (movie.RealityTv == 1) genres.Add("Reality TV");
            if (movie.Spirituality == 1) genres.Add("Spirituality");
            if (movie.TvAction == 1) genres.Add("TV Action");
            if (movie.TvComedies == 1) genres.Add("TV Comedies");
            if (movie.TvDramas == 1) genres.Add("TV Dramas");
            if (movie.TalkShowsTvComedies == 1) genres.Add("Talk Shows TV Comedies");
            if (movie.Thrillers == 1) genres.Add("Thrillers");

            return genres;
        }


        [Authorize(Roles = "admin,user")]
        [HttpGet("MovieToMovieRecommendations/{showId}")]
        public async Task<IActionResult> GetMovieRecommendations(string showId)
        {
            // Step 1: Validate the input `showId`
            if (string.IsNullOrEmpty(showId))
            {
                return await Task.FromResult<IActionResult>(BadRequest(new { message = "Movie showId is null or empty." }));
            }

            // Step 2: Look up movie-to-movie recommendations for the given showId
            var recs = _movieToMovieRecommendationsContext.MovieRecommendations
                .FirstOrDefault(r => r.ShowId == showId);

            if (recs == null)
            {
                return await Task.FromResult<IActionResult>(NotFound(new { message = "No movie recommendations found for this movie." }));
            }

            // Step 3: Collect all the recommended movie show IDs (rec_1 to rec_10)
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

            // Return the recommended movies
            return await Task.FromResult<IActionResult>(Ok(movies));
        }

        [Authorize(Roles = "admin,user")]
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

        [Authorize(Roles = "admin,user")]
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

        [Authorize(Roles = "admin,user")]
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

        [Authorize(Roles = "admin,user")]
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

        [Authorize(Roles = "admin,user")]
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
        
    [Authorize(Roles = "admin")]
    [HttpGet("AllMovies")]
    public IActionResult GetMovies(int pageNum, int resultsPerPage, string searchTerm = "")
    {
        // Trim and convert searchTerm to lowercase once
        searchTerm = string.IsNullOrEmpty(searchTerm) ? "" : searchTerm.Trim().ToLower();

        var query = _moviesContext.MoviesTitles.AsQueryable();

        // Apply case-insensitive search filter if searchTerm is provided
        if (!string.IsNullOrEmpty(searchTerm))
        {
            // Apply filtering by title, making sure both sides are case-insensitive and trimmed
            query = query.Where(m => m.Title.ToLower().Trim().Contains(searchTerm));
        }

        // Log the SQL query for debugging purposes (optional)
        var sqlQuery = query.ToString();
        Console.WriteLine("Generated SQL Query: " + sqlQuery);

        // Get the total count of movies based on the query
        var totalMovies = query.Count();

        // Apply pagination (skip and take) based on pageNum and resultsPerPage
        var movies = query
            .Skip((pageNum - 1) * resultsPerPage)
            .Take(resultsPerPage)
            .OrderBy(m => m.ShowId)
            .ToList();

        // Return the results as JSON
        return Ok(new
        {
            movies = movies,
            totalNumMovies = totalMovies
        });
    }

        [Authorize(Roles = "admin")]
        [HttpPost("AddMovie")]
        public async Task<IActionResult> AddMovie([FromBody] MoviesTitle newMovie)
        {
            newMovie.ShowId = await GenerateNextShowIdAsync(); // Assign new ID here
            _moviesContext.MoviesTitles.Add(newMovie);
            await _moviesContext.SaveChangesAsync();
            return Ok(newMovie);
        }

        [Authorize(Roles = "admin")]
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

        [Authorize(Roles = "admin")]
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

private async Task<string> GenerateNextShowIdAsync()
        {
            var allIds = await _moviesContext.MoviesTitles
                .Where(m => m.ShowId.StartsWith("s"))
                .Select(m => m.ShowId.Substring(1)) // get numeric part as string
                .ToListAsync(); // still just strings here

            var maxNumber = allIds
                .AsEnumerable() // switch to LINQ-to-Objects so we can use TryParse
                .Select(id => int.TryParse(id, out int number) ? number : 0)
                .Max();

            return $"s{maxNumber + 1}";
        }

        [Authorize(Roles = "admin,user")]
        [HttpGet("GetMovieDetails/{id}")]
        public IActionResult GetMovieDetails(string id)
        {
            var movie = _moviesContext.MoviesTitles.Find(id);
            if (movie == null)
            {
                return NotFound();
            }

            // Step 1: Generate Poster URL
            var baseUrl = _config["BlobStorage:BaseImageUrl"];
            var encodedTitle = Uri.EscapeDataString(movie.Title ?? "placeholder");
            var posterUrl = $"{baseUrl}/{encodedTitle}.jpg";

            // Step 2: Extract genres (place this here)
            var genreMap = new Dictionary<string, int?>
    {
        { "Action", movie.Action },
        { "Adventure", movie.Adventure },
        { "Anime Series International TV Shows", movie.AnimeSeriesInternationalTvShows },
        { "British TV Shows Docuseries International TV Shows", movie.BritishTvShowsDocuseriesInternationalTvShows },
        { "Children", movie.Children },
        { "Comedies", movie.Comedies },
        { "Comedies Dramas International Movies", movie.ComediesDramasInternationalMovies },
        { "Comedies International Movies", movie.ComediesInternationalMovies },
        { "Comedies Romantic Movies", movie.ComediesRomanticMovies },
        { "Crime TV Shows Docuseries", movie.CrimeTvShowsDocuseries },
        { "Documentaries", movie.Documentaries },
        { "Documentaries International Movies", movie.DocumentariesInternationalMovies },
        { "Docuseries", movie.Docuseries },
        { "Dramas", movie.Dramas },
        { "Dramas International Movies", movie.DramasInternationalMovies },
        { "Dramas Romantic Movies", movie.DramasRomanticMovies },
        { "Family Movies", movie.FamilyMovies },
        { "Fantasy", movie.Fantasy },
        { "Horror Movies", movie.HorrorMovies },
        { "International Movies Thrillers", movie.InternationalMoviesThrillers },
        { "International TV Shows Romantic TV Shows TV Dramas", movie.InternationalTvShowsRomanticTvShowsTvDramas },
        { "Kids' TV", movie.KidsTv },
        { "Language TV Shows", movie.LanguageTvShows },
        { "Musicals", movie.Musicals },
        { "Nature TV", movie.NatureTv },
        { "Reality TV", movie.RealityTv },
        { "Spirituality", movie.Spirituality },
        { "TV Action", movie.TvAction },
        { "TV Comedies", movie.TvComedies },
        { "TV Dramas", movie.TvDramas },
        { "Talk Shows TV Comedies", movie.TalkShowsTvComedies },
        { "Thrillers", movie.Thrillers }
    };

            var genres = genreMap
                .Where(kvp => kvp.Value == 1)
                .Select(kvp => kvp.Key)
                .ToList();

            // Step 3: Return Movie DTO
            var dto = new MovieDto
            {
                ShowId = movie.ShowId,
                Title = movie.Title,
                Type = movie.Type,
                Director = movie.Director,
                Cast = movie.Cast,
                Country = movie.Country,
                ReleaseYear = movie.ReleaseYear,
                Rating = movie.Rating,
                Duration = movie.Duration,
                Description = movie.Description,
                PosterUrl = posterUrl,
                Genres = genres
            };

            return Ok(dto);
        }

    }
}

