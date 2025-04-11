using intex2.Models;
using Microsoft.AspNetCore.Identity;

public class RoleSeeder
{
    public static void SeedRoles(RoleManager<IdentityRole<int>> roleManager)
    {
        // Add roles if they do not exist
        string[] roleNames = { "Admin", "User" };

        foreach (var roleName in roleNames)
        {
            var roleExist = roleManager.RoleExistsAsync(roleName).Result;
            if (!roleExist)
            {
                var role = new IdentityRole<int> { Name = roleName, NormalizedName = roleName.ToUpper() }; // Ensure NormalizedName is set
                var result = roleManager.CreateAsync(role).Result;
            }
        }
    }
}
