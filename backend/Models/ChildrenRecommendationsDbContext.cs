using Microsoft.EntityFrameworkCore;

namespace intex2.Models
{
    public class ChildrenRecommendationsDbContext : DbContext
    {
        public ChildrenRecommendationsDbContext(DbContextOptions<ChildrenRecommendationsDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Recommendation> Recommendations { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("Data Source=children_recommendations.db");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Recommendation>(entity =>
            {
                entity.ToTable("recommendations");

                entity.HasKey(e => e.UserId);

                entity.Property(e => e.UserId).HasColumnName("user_id");

                for (int i = 1; i <= 10; i++)
                {
                    entity.Property<string?>($"Rec{i}")
                          .HasColumnName($"rec_{i}")
                          .HasMaxLength(10);
                }
            });
        }
    }
}
