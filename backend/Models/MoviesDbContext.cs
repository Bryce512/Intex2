using System;
using Microsoft.EntityFrameworkCore;

namespace intex2.Models
{
    public partial class MoviesDbContext : DbContext
    {
        public MoviesDbContext(DbContextOptions<MoviesDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<EfmigrationHistory> EfmigrationHistories { get; set; } = null!;
        public virtual DbSet<MoviesRating> MoviesRatings { get; set; } = null!;
        public virtual DbSet<MoviesTitle> MoviesTitles { get; set; } = null!;
        public virtual DbSet<MoviesUser> MoviesUsers { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("Data Source=Movies.db");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MoviesRating>(entity =>
            {
                entity.ToTable("movies_ratings");
                entity.HasKey(e => new { e.ShowId, e.UserId });

                entity.Property(e => e.Rating).HasColumnName("rating");
                entity.Property(e => e.ShowId).HasColumnName("show_id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
            });

            modelBuilder.Entity<MoviesTitle>(entity =>
            {
                entity.ToTable("movies_titles");
                entity.HasKey(e => e.ShowId);
                // Add additional configuration as needed
            });

            modelBuilder.Entity<MoviesUser>(entity =>
            {
                entity.ToTable("movies_users");
                entity.HasKey(e => e.UserId);

                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Gender).HasColumnName("gender");
                entity.Property(e => e.City).HasColumnName("city");
                entity.Property(e => e.State).HasColumnName("state");
                entity.Property(e => e.Zip).HasColumnName("zip");
                entity.Property(e => e.Age).HasColumnName("age");

                // Streaming services
                entity.Property(e => e.Netflix).HasColumnName("Netflix");
                entity.Property(e => e.AmazonPrime).HasColumnName("Amazon Prime");
                entity.Property(e => e.Disney).HasColumnName("Disney+");
                entity.Property(e => e.Paramount).HasColumnName("Paramount+");
                entity.Property(e => e.Max).HasColumnName("Max");
                entity.Property(e => e.Hulu).HasColumnName("Hulu");
                entity.Property(e => e.AppleTv).HasColumnName("Apple TV+");
                entity.Property(e => e.Peacock).HasColumnName("Peacock");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
