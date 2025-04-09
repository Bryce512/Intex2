using intex2.Models;
using Intex2.Models;

namespace intex2.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;

[Route("[controller]")]
[ApiController]
// [Authorize(Roles = "admin")]
public class RoleController : Controller
{
    private readonly RoleManager<IdentityRole<int>> _roleManager;
    private readonly UserManager<AppIdentityUser> _userManager;

    public RoleController(RoleManager<IdentityRole<int>> roleManager, UserManager<AppIdentityUser> userManager)
    {
        _roleManager = roleManager;
        _userManager = userManager;
    }
    
    [HttpPost("AddRole")]
    public async Task<IActionResult> AddRole(string roleName)
    {
        if (string.IsNullOrWhiteSpace(roleName))
        {
            return BadRequest("Role name cannot be empty.");
        }

        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (roleExists)
        {
            return Conflict("Role already exists.");
        }

        var result = await _roleManager.CreateAsync(new IdentityRole<int>(roleName));
        if (result.Succeeded)
        {
            return Ok($"Role '{roleName}' created successfully.");
        }

        return StatusCode(500, "An error occurred while creating the role.");
    }

    [HttpPost("AssignRoleToUser")]
    public async Task<IActionResult> AssignRoleToUser(string userEmail, string roleName)
    {
        if (string.IsNullOrWhiteSpace(userEmail) || string.IsNullOrWhiteSpace(roleName))
        {
            return BadRequest("User email and role name are required.");
        }

        var user = await _userManager.FindByEmailAsync(userEmail);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (!roleExists)
        {
            return NotFound("Role does not exist.");
        }

        var result = await _userManager.AddToRoleAsync(user, roleName);
        if (result.Succeeded)
        {
            return Ok($"Role '{roleName}' assigned to user '{userEmail}'.");
        }

        return StatusCode(500, "An error occurred while assigning the role.");
    }
    
    [HttpPost("set-or-reset-password")]
    public async Task<IActionResult> SetOrResetPassword([FromBody] Login model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
            return NotFound("User not found");

        IdentityResult result;

        if (await _userManager.HasPasswordAsync(user))
        {
            // Remove current password (if known) – this is a workaround
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            result = await _userManager.ResetPasswordAsync(user, token, model.Password);
        }
        else
        {
            result = await _userManager.AddPasswordAsync(user, model.Password);
        }

        if (result.Succeeded)
            return Ok("Password has been set/reset.");

        return BadRequest(result.Errors.Select(e => e.Description));
    }
}