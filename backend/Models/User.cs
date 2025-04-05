using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace intex2.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }
        
        [Required]
        public string Username { get; set; } = null!;
        
        [Required]
        public string Password { get; set; } = null!;
        
        [Required]
        public string Email { get; set; } = null!;
        
        public string? FirstName { get; set; }
        
        public string? LastName { get; set; }
    }

     public class Login
      {
          public required string Username { get; set; }
          public required string Password { get; set; }
      }
}