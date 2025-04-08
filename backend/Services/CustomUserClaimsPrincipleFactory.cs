using intex2.Models;

namespace intex2.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

public class CustomUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<AppIdentityUser>
{
    public CustomUserClaimsPrincipalFactory(
        UserManager<AppIdentityUser> userManager, 
        IOptions<IdentityOptions> optionsAccessor)
        : base(userManager, optionsAccessor) { }

    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(AppIdentityUser user)
    {
        var identity = await base.GenerateClaimsAsync(user);
        identity.AddClaim(new Claim(ClaimTypes.Email, user.Email ?? "")); // Ensure email claim is always present
        return identity;
    }
}