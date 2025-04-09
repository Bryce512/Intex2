using Microsoft.EntityFrameworkCore;

namespace intex2.Models
{
    public class MovieToMovieRecommendationsDbContext : DbContext
    {
        public MovieToMovieRecommendationsDbContext(DbContextOptions<MovieToMovieRecommendationsDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<MovieRecommendation> MovieRecommendations { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("Data Source=movie_to_movie_hybrid_recommendations.db");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MovieRecommendation>(entity =>
            {
                entity.ToTable("movie_to_movie_hybrid_recommendations");

                // Defining ShowId as the primary key
                entity.HasKey(e => e.ShowId);

                // Column mappings for ShowId
                entity.Property(e => e.ShowId).HasColumnName("show_id");

                // Mapping for rec_1, rec_2, ..., rec_10
                for (int i = 1; i <= 10; i++)
                {
                    entity.Property<string?>($"Rec{i}")
                          .HasColumnName($"rec_{i}")
                          .HasMaxLength(10);  // You can adjust max length as needed
                }
            });
        }
    }

    public class MovieRecommendation
    {
        public string ShowId { get; set; }  // Unique ID for the show
        public string? Rec1 { get; set; }   // Recommendation 1
        public string? Rec2 { get; set; }   // Recommendation 2
        public string? Rec3 { get; set; }   // Recommendation 3
        public string? Rec4 { get; set; }   // Recommendation 4
        public string? Rec5 { get; set; }   // Recommendation 5
        public string? Rec6 { get; set; }   // Recommendation 6
        public string? Rec7 { get; set; }   // Recommendation 7
        public string? Rec8 { get; set; }   // Recommendation 8
        public string? Rec9 { get; set; }   // Recommendation 9
        public string? Rec10 { get; set; }  // Recommendation 10
    }
}
