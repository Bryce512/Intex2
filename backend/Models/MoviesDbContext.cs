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

        //public virtual DbSet<EfmigrationHistory> EfmigrationHistories { get; set; } = null!;
        
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

                entity.Property(e => e.ShowId).HasColumnName("show_id");
                entity.Property(e => e.Type).HasColumnName("type");
                entity.Property(e => e.Title).HasColumnName("title");
                entity.Property(e => e.Director).HasColumnName("director");
                entity.Property(e => e.Cast).HasColumnName("cast");
                entity.Property(e => e.Country).HasColumnName("country");
                entity.Property(e => e.ReleaseYear).HasColumnName("release_year");
                entity.Property(e => e.Rating).HasColumnName("rating");
                entity.Property(e => e.Duration).HasColumnName("duration");
                entity.Property(e => e.Description).HasColumnName("description");

                entity.Property(e => e.Action).HasColumnName("Action");
                entity.Property(e => e.Adventure).HasColumnName("Adventure");
                entity.Property(e => e.AnimeSeriesInternationalTvShows).HasColumnName("Anime Series International TV Shows");
                entity.Property(e => e.BritishTvShowsDocuseriesInternationalTvShows).HasColumnName("British TV Shows Docuseries International TV Shows");
                entity.Property(e => e.Children).HasColumnName("Children");
                entity.Property(e => e.Comedies).HasColumnName("Comedies");
                entity.Property(e => e.ComediesDramasInternationalMovies).HasColumnName("Comedies Dramas International Movies");
                entity.Property(e => e.ComediesInternationalMovies).HasColumnName("Comedies International Movies");
                entity.Property(e => e.ComediesRomanticMovies).HasColumnName("Comedies Romantic Movies");
                entity.Property(e => e.CrimeTvShowsDocuseries).HasColumnName("Crime TV Shows Docuseries");
                entity.Property(e => e.Documentaries).HasColumnName("Documentaries");
                entity.Property(e => e.DocumentariesInternationalMovies).HasColumnName("Documentaries International Movies");
                entity.Property(e => e.Docuseries).HasColumnName("Docuseries");
                entity.Property(e => e.Dramas).HasColumnName("Dramas");
                entity.Property(e => e.DramasInternationalMovies).HasColumnName("Dramas International Movies");
                entity.Property(e => e.DramasRomanticMovies).HasColumnName("Dramas Romantic Movies");
                entity.Property(e => e.FamilyMovies).HasColumnName("Family Movies");
                entity.Property(e => e.Fantasy).HasColumnName("Fantasy");
                entity.Property(e => e.HorrorMovies).HasColumnName("Horror Movies");
                entity.Property(e => e.InternationalMoviesThrillers).HasColumnName("International Movies Thrillers");
                entity.Property(e => e.InternationalTvShowsRomanticTvShowsTvDramas).HasColumnName("International TV Shows Romantic TV Shows TV Dramas");
                entity.Property(e => e.KidsTv).HasColumnName("Kids' TV");
                entity.Property(e => e.LanguageTvShows).HasColumnName("Language TV Shows");
                entity.Property(e => e.Musicals).HasColumnName("Musicals");
                entity.Property(e => e.NatureTv).HasColumnName("Nature TV");
                entity.Property(e => e.RealityTv).HasColumnName("Reality TV");
                entity.Property(e => e.Spirituality).HasColumnName("Spirituality");
                entity.Property(e => e.TvAction).HasColumnName("TV Action");
                entity.Property(e => e.TvComedies).HasColumnName("TV Comedies");
                entity.Property(e => e.TvDramas).HasColumnName("TV Dramas");
                entity.Property(e => e.TalkShowsTvComedies).HasColumnName("Talk Shows TV Comedies");
                entity.Property(e => e.Thrillers).HasColumnName("Thrillers");
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
