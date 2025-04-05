using Microsoft.AspNetCore.Mvc;
using intex2.Models;  // Use the namespace where your scaffolded models are
using System.Linq;

namespace intex2.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private UserContext _context;

        public UserController(UserContext context)
        {
            _context = context;
        }

        [HttpGet ("/GetAllUsers")]
        public IActionResult GetUsers()
        {
            var users = _context.Users.ToList();  // Assuming your table is named "Users"
            return Ok(users);
        }


        [HttpGet ("/GetUser/{Username}")]
        public IActionResult GetUser(string Username)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == Username);  
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost("/AddUser")]
        public IActionResult AddUser([FromBody] User newUser)
        {
            if (newUser == null)
            {
                return BadRequest();
            }

            // Check if username already exists
            if (_context.Users.Any(u => u.Username == newUser.Username))
            {
                return Conflict(new { message = "Username already exists" });
            }

            // Hash the password before storing
            newUser.Password = CreatePasswordHash(newUser.Password);

            _context.Users.Add(newUser);
            _context.SaveChanges();
            
            // Don't return the password in the response
            var userResponse = new
            {
                newUser.UserId,
                newUser.Username,
                newUser.FirstName,
                newUser.LastName,
                newUser.Email
            };
            
            return CreatedAtAction(nameof(GetUser), new { Username = newUser.Username }, userResponse);
        }

        // Update user details
        [HttpPut("/updateUser/{Username}")]
        public IActionResult UpdateUser(string Username, [FromBody] User updatedUser)
        {
            if (Username != updatedUser.Username)
            {
                return BadRequest();
            }

            var user = _context.Users.FirstOrDefault(u => u.Username == Username);
            if (user == null)
            {
                return NotFound();
            }

            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.Email = updatedUser.Email;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("/deleteUser/{Username}")]
        public IActionResult DeleteUser(string Username)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == Username);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            _context.SaveChanges();
            return NoContent();
        }

      [HttpPost("login")]
      public IActionResult Login([FromBody] LoginModel model)
      {
          // Find user by Username
          var user = _context.Users.FirstOrDefault(u => u.Username == model.Username);
          
          if (user == null)
          {
              return NotFound(new { message = "User not found" });
          }
          
          // Verify the password
          bool isPasswordValid = VerifyPassword(model.password, user.Password);
          
          if (!isPasswordValid)
          {
              return Unauthorized(new { message = "Invalid password" });
          }
          
          // User authenticated successfully
          return Ok(new { 
              message = "Login successful", 
              user = new {
                  id = user.UserId,
                  Username = user.Username,
                  firstName = user.FirstName,
                  lastName = user.LastName
              }
          });
      }
      // Helper method to verify password
      private bool VerifyPassword(string inputPassword, string storedPassword)
      {
          // The stored password should be in format: "salt$hash"
          var parts = storedPassword.Split('$');
          if (parts.Length != 2)
          {
              return false;
          }
          
          string salt = parts[0];
          string storedHash = parts[1];
          
          // Generate hash of the input password with the same salt
          string computedHash = HashPassword(inputPassword, salt);
          
          // Compare the computed hash with the stored hash
          return computedHash == storedHash;
      }

      // Helper method to hash a password with a given salt
      private string HashPassword(string password, string salt)
      {
          // Use a secure hashing algorithm like SHA256
          using (var sha256 = System.Security.Cryptography.SHA256.Create())
          {
              byte[] hashedBytes = sha256.ComputeHash(
                  System.Text.Encoding.UTF8.GetBytes(salt + password)
              );
              
              // Convert to base64 string
              return Convert.ToBase64String(hashedBytes);
          }
      }

      // Helper method to generate a new salt
      private string GenerateSalt()
      {
          byte[] saltBytes = new byte[16];
          using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
          {
              rng.GetBytes(saltBytes);
          }
          return Convert.ToBase64String(saltBytes);
      }

      // When registering a user, use this pattern to store the password:
      private string CreatePasswordHash(string password)
      {
          string salt = GenerateSalt();
          string hash = HashPassword(password, salt);
          return $"{salt}${hash}";
      }

      public class LoginModel
      {
          public string Username { get; set; }
          public string password { get; set; }
      }

    }
}