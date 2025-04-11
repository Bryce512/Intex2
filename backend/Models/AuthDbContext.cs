using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace intex2.Models;

public class AuthDbContext : IdentityDbContext<AppIdentityUser, IdentityRole<int>, int>
{
    public AuthDbContext(DbContextOptions<AuthDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    
        // Explicitly specify the table names for Identity entities
        builder.Entity<AppIdentityUser>().ToTable("AspNetUsers");  // Mapping to AspNetUsers table
        builder.Entity<IdentityRole<int>>().ToTable("AspNetRoles");  // Mapping to AspNetRoles table
        builder.Entity<IdentityUserRole<int>>().ToTable("AspNetUserRoles"); // Mapping to AspNetUserRoles table
        builder.Entity<IdentityUserClaim<int>>().ToTable("AspNetUserClaims"); // Mapping to AspNetUserClaims table
        builder.Entity<IdentityUserLogin<int>>().ToTable("AspNetUserLogins"); // Mapping to AspNetUserLogins table
        builder.Entity<IdentityRoleClaim<int>>().ToTable("AspNetRoleClaims"); // Mapping to AspNetRoleClaims table
        builder.Entity<IdentityUserToken<int>>().ToTable("AspNetUserTokens"); // Mapping to AspNetUserTokens table
    }
}
