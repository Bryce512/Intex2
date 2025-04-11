using System.ComponentModel.DataAnnotations;

namespace intex2.Models
{
    public class RegisterUser
    {
        [Required]
        public string Username { get; set; } = null!;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;
        
        [Required]
        public string Name { get; set; } = null!;
        
        [Required]
        [StringLength(100, MinimumLength = 6)]
        public required string Password { get; set; } = null!;
    }
}