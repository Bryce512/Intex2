using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace intex2.Models
{
    public class MoviesUser
    {
        // Remove duplicate Id property - already defined in IdentityUser<int>
        // [Key] attribute isn't needed as it's defined in the base class
        
        // Custom properties
        [Key]
        [Required]
        [ForeignKey(nameof(AppIdentityUser))] 
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        
        // Updated to match schema (INTEGER in SQLite)
        public int Zip { get; set; }
        public int Age { get; set; }
        
        // All streaming services from the schema
        public bool Netflix { get; set; }
        public bool AmazonPrime { get; set; }
        public bool Disney { get; set; }
        public bool Paramount { get; set; }
        public bool Max { get; set; }
        public bool Hulu { get; set; }
        public bool AppleTv { get; set; }
        public bool Peacock { get; set; }
        
    }
}