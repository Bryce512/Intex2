namespace intex2.Models
{
    public class MovieDto
    {
        public string ShowId { get; set; }
        public string? Type { get; set; }
        public string? Title { get; set; }
        public string? Director { get; set; }
        public string? Cast { get; set; }
        public string? Country { get; set; }
        public int? ReleaseYear { get; set; }
        public string? Rating { get; set; }
        public string? Duration { get; set; }
        public string? Description { get; set; }
        public string PosterUrl { get; set; }
        public List<string> Genres { get; set; } // 👈 Add this

    }
}
