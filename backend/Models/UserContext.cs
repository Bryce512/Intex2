using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace intex2.Models;

public partial class UserContext : DbContext
{
    public UserContext()
    {
    }

    public UserContext(DbContextOptions<UserContext> options)
        : base(options)
    {
    }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlite("Data Source=/Users/Bryce/Desktop/ISCore/Intex2/backend/intex2_users.sqlite");

   protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);
    
    modelBuilder.Entity<User>(entity =>
    {
        entity.HasKey(e => e.UserId);
        
        // This is the critical part for SQLite
        entity.Property(e => e.UserId)
              .ValueGeneratedOnAdd();
        
        entity.Property(e => e.Username)
              .IsRequired()
              .HasMaxLength(50);
        
        entity.HasIndex(e => e.Username)
              .IsUnique();
    });

    OnModelCreatingPartial(modelBuilder);

}

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
