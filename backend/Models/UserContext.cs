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
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
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
