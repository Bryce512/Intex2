using intex2.Models;

namespace intex2.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

public class CustomUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<AppIdentityUser, IdentityRole<int>>
{
    public CustomUserClaimsPrincipalFactory(
        UserManager<AppIdentityUser> userManager,
        RoleManager<IdentityRole<int>> roleManager,
        IOptions<IdentityOptions> optionsAccessor)
        : base(userManager, roleManager, optionsAccessor) { }

    public override async Task<ClaimsPrincipal> CreateAsync(AppIdentityUser user)
    {
        var principal = await base.CreateAsync(user);

        // Get all roles assigned to the user
        var roles = await UserManager.GetRolesAsync(user);
        
        // Remove any duplicates using distinct and convert them to claims
        var distinctRoles = roles.Distinct().Select(role => new Claim(ClaimTypes.Role, role)).ToList();
        
        // Add the role claims to the principal
        ((ClaimsIdentity)principal.Identity).AddClaims(distinctRoles);
        
        return principal;
    }
}
