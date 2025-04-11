using Microsoft.EntityFrameworkCore;

namespace intex2.Models
{
    public class TopRatedRecommendationsDbContext : DbContext
    {
        public TopRatedRecommendationsDbContext(DbContextOptions<TopRatedRecommendationsDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<TopRatedRecommendation> TopRatedRecommendations { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("Data Source=top_rated.db");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TopRatedRecommendation>(entity =>
            {
                entity.ToTable("top_rated");

                entity.HasKey(e => e.ShowId);

                entity.Property(e => e.ShowId).HasColumnName("show_id");
                entity.Property(e => e.Title).HasColumnName("title").HasMaxLength(255); // Adjust the max length as needed
            });
        }
    }

    public class TopRatedRecommendation
    {
        public string ShowId { get; set; } = null!;
        public string Title { get; set; } = null!;
    }
}