using Microsoft.EntityFrameworkCore;

namespace intex2.Models
{
    public class PopularRecommendationsDbContext : DbContext
    {
        public PopularRecommendationsDbContext(DbContextOptions<PopularRecommendationsDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<PopularRecommendation> PopularRecommendations { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("Data Source=popular.db");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PopularRecommendation>(entity =>
            {
                entity.ToTable("popular");

                entity.HasKey(e => e.ShowId);

                entity.Property(e => e.ShowId).HasColumnName("show_id");
                entity.Property(e => e.Title).HasColumnName("title").HasMaxLength(255); // Adjust the max length as needed
            });
        }
    }

    public class PopularRecommendation
    {
        public string ShowId { get; set; } = null!;
        public string Title { get; set; } = null!;
    }
}
