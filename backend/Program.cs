using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using intex2.Models;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register DbContexts
builder.Services.AddDbContext<BookstoreContext>(options =>
{
    options.UseSqlite(builder.Configuration["ConnectionStrings:BowlingConnect"]);
});
builder.Services.AddDbContext<UserContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("UserConnection"));
});
builder.Services.AddDbContext<MoviesDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("MovieConnection"))
    .LogTo(Console.WriteLine, LogLevel.Information));  // Log the SQL queries


builder.Services.AddIdentity<MoviesUser, IdentityRole<int>>(options =>
    {
        options.Password.RequireDigit = true;
        options.Password.RequiredLength = 6;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = true;
        options.Password.RequireLowercase = true;

        // Lockout settings
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.AllowedForNewUsers = true;
        
        // User settings
        options.User.RequireUniqueEmail = true;

        options.SignIn.RequireConfirmedAccount = false;  // Disable email confirmation requirement
        options.Tokens.ProviderMap.Clear();  // Disable email token generation
    })
    .AddEntityFrameworkStores<MoviesDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddSingleton<IEmailSender<MoviesUser>, DummyEmailSender>();

builder.Services.AddAuthorization();


builder.Services.AddCors(options =>
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
        // .AllowCredentials(); // Add this if you're using credentials
    }));


builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Login";  // Path to the login page
    options.LogoutPath = "/Logout"; // Path to the logout page
    options.AccessDeniedPath = "/AccessDenied";  // Optional: Path to handle access-denied scenarios
});

builder.Services.AddDbContext<ActionRecommendationsDbContext>(options =>
    options.UseSqlite("Data Source=action_recommendations.db"));






var app = builder.Build();
// Update the SeedRoles method to be async
static async Task SeedRolesAsync(RoleManager<IdentityRole<int>> roleManager)
{
    string[] roleNames = { "Admin", "User" };
    
    foreach (var roleName in roleNames)
    {
        // Check if role already exists
        var roleExists = await roleManager.RoleExistsAsync(roleName);
        if (!roleExists)
        {
            // Create the role
            var role = new IdentityRole<int>(roleName);
            var result = await roleManager.CreateAsync(role);
            
            if (result.Succeeded)
            {
                Console.WriteLine($"Created role: {roleName}");
            }
            else
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"Failed to create role {roleName}: {errors}");
            }
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


static async Task SeedRoles(RoleManager<IdentityRole<int>> roleManager)
{
    string[] roleNames = { "Admin", "User" };
    
    foreach (var roleName in roleNames)
    {
        // Check if role already exists
        var roleExists = await roleManager.RoleExistsAsync(roleName);
        if (!roleExists)
        {
            // Create the role
            var role = new IdentityRole<int>(roleName);
            await roleManager.CreateAsync(role);
            Console.WriteLine($"Created role: {roleName}");
        }
    }
}

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();


app.UseAuthorization();
app.MapControllers();
app.MapIdentityApi<MoviesUser>();

app.MapPost("/logout", async (SignInManager<MoviesUser> signInManager) =>
{
    await signInManager.SignOutAsync();
    return Results.Ok(new { message = "Logged out successfully." });
}).RequireAuthorization();


app.Run();

public class DummyEmailSender : IEmailSender<MoviesUser>
{
    public Task SendConfirmationLinkAsync(MoviesUser user, string email, string confirmationLink) => Task.CompletedTask;
    public Task SendPasswordResetLinkAsync(MoviesUser user, string email, string resetLink) => Task.CompletedTask;
    public Task SendPasswordResetCodeAsync(MoviesUser user, string email, string resetCode) => Task.CompletedTask;
}

