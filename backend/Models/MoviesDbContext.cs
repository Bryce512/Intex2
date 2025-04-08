using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace intex2.Models;

public partial class MoviesDbContext : IdentityDbContext<MoviesUser, IdentityRole<int>, int>
{
    public MoviesDbContext()
    {
    }

    public MoviesDbContext(DbContextOptions<MoviesDbContext> options)
        : base(options)
    {
    }

    // Your custom DbSets
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
    // Call the base implementation first to set up Identity tables
    base.OnModelCreating(modelBuilder);

    // Fix primary key configurations where needed
    modelBuilder.Entity<IdentityUserToken<int>>()
        .HasKey(e => new { e.UserId, e.LoginProvider, e.Name });
    
    modelBuilder.Entity<IdentityUserLogin<int>>()
        .HasKey(e => new { e.LoginProvider, e.ProviderKey });

    // Configure your custom tables (non-Identity tables)
    modelBuilder.Entity<EfmigrationHistory>(entity =>
    {
        entity.HasKey(e => e.MigrationId);
        entity.ToTable("__EFMigrationHistory");
    });

    modelBuilder.Entity<MoviesRating>(entity =>
    {
        entity.ToTable("movies_ratings");
        entity.HasKey(e => new {e.ShowId, e.UserId});
        entity.Property(e => e.Rating).HasColumnName("rating");
        entity.Property(e => e.ShowId).HasColumnName("show_id");
        entity.Property(e => e.UserId).HasColumnName("user_id");
    });

    modelBuilder.Entity<MoviesTitle>(entity =>
    {
        entity.ToTable("movies_titles");
        entity.HasKey(e => e.ShowId);
        // Rest of your configuration...
    });

    // Configure MoviesUser to use the default AspNetUsers table

    modelBuilder.Entity<MoviesUser>(entity =>
    {
        entity.ToTable("movies_users");
        
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Id).HasColumnName("user_id");
        
        // Custom properties
        entity.Property(e => e.Name).HasColumnName("name");
        entity.Property(e => e.Gender).HasColumnName("gender");
        entity.Property(e => e.City).HasColumnName("city");
        entity.Property(e => e.State).HasColumnName("state");
        entity.Property(e => e.Zip).HasColumnName("zip");
        entity.Property(e => e.Age).HasColumnName("age");
        
        // Streaming services - match exact column names from your DB
        entity.Property(e => e.Netflix).HasColumnName("Netflix");
        entity.Property(e => e.AmazonPrime).HasColumnName("Amazon Prime");
        entity.Property(e => e.Disney).HasColumnName("Disney+");
        entity.Property(e => e.Paramount).HasColumnName("Paramount+");
        entity.Property(e => e.Max).HasColumnName("Max");
        entity.Property(e => e.Hulu).HasColumnName("Hulu");
        entity.Property(e => e.AppleTv).HasColumnName("Apple TV+");
        entity.Property(e => e.Peacock).HasColumnName("Peacock");
        
        // Identity properties
        entity.Property(e => e.UserName).HasColumnName("username");
        entity.Property(e => e.NormalizedUserName).HasColumnName("normalized_username");
        entity.Property(e => e.Email).HasColumnName("email");
        entity.Property(e => e.NormalizedEmail).HasColumnName("normalized_email");
        entity.Property(e => e.EmailConfirmed).HasColumnName("email_confirmed");
        entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
        entity.Property(e => e.SecurityStamp).HasColumnName("security_stamp");
        entity.Property(e => e.ConcurrencyStamp).HasColumnName("concurrency_stamp");
        entity.Property(e => e.PhoneNumber).HasColumnName("phone_number");
        entity.Property(e => e.PhoneNumberConfirmed).HasColumnName("phone_number_confirmed");
        entity.Property(e => e.TwoFactorEnabled).HasColumnName("two_factor_enabled");
        entity.Property(e => e.LockoutEnd).HasColumnName("lockout_end");
        entity.Property(e => e.LockoutEnabled).HasColumnName("lockout_enabled");
        entity.Property(e => e.AccessFailedCount).HasColumnName("access_failed_count");
        
        // Indexes for Identity
        entity.HasIndex(e => e.NormalizedEmail, "EmailIndex");
        entity.HasIndex(e => e.NormalizedUserName, "UserNameIndex").IsUnique();
    });

    
    OnModelCreatingPartial(modelBuilder);
}
    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}