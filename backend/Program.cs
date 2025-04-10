using System.Security.Claims;
using intex2.Data;
using Microsoft.EntityFrameworkCore;
using intex2.Models;
using intex2.Services;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register DbContexts
builder.Services.AddDbContext<MoviesDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("MovieConnection")));
    
builder.Services.AddDbContext<AuthDbContext>(options => 
    options.UseSqlite(builder.Configuration.GetConnectionString("AuthConnection")));

builder.Services.AddDbContext<ActionRecommendationsDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("ActionRecommendations")));

builder.Services.AddDbContext<TopRatedRecommendationsDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("TopRatedRecommendations")));

builder.Services.AddDbContext<ChildrenRecommendationsDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("ChildrenRecommendations")));

builder.Services.AddDbContext<FantasyRecommendationsDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("FantasyRecommendations")));

builder.Services.AddDbContext<ComedyRecommendationsDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("ComedyRecommendations")));

builder.Services.AddDbContext<PopularRecommendationsDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("PopularRecommendations")));

builder.Services.AddDbContext<UserRecommendationsDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("UserRecommendations")));

builder.Services.AddDbContext<MovieToMovieRecommendationsDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("MovieToMovieRecommendations")));



    builder.Services.AddAuthorization(options =>
    {
        options.AddPolicy("AdminOnly", policy => policy.RequireRole("admin"));
        options.AddPolicy("UserOrAdmin", policy => policy.RequireRole("admin", "user"));
    });
builder.Services.AddIdentity<AppIdentityUser, IdentityRole<int>>(options =>
    {
         options.Password.RequireDigit = false;
         options.Password.RequiredLength = 14;
         options.Password.RequireNonAlphanumeric = false;
         options.Password.RequireUppercase = false;
         options.Password.RequireLowercase = false;

         // Lockout settings
         options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
         options.Lockout.MaxFailedAccessAttempts = 5;
         options.Lockout.AllowedForNewUsers = true;
         
         // User settings
         options.User.RequireUniqueEmail = true;

         options.SignIn.RequireConfirmedAccount = false;  // Disable email confirmation requirement
         options.Tokens.ProviderMap.Clear();  // Disable email token generation
    })
    .AddEntityFrameworkStores<AuthDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email; // Ensure email is stored in claims
});

builder.Services.AddScoped<IUserClaimsPrincipalFactory<AppIdentityUser>, CustomUserClaimsPrincipalFactory>();


builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None; //Warning: Change BEFORE DEPLOY and in /logout
    options.Cookie.Name = ".AspNetCore.Identity.Application";
    options.LoginPath = "/login";  // Path to the login page
    options.LogoutPath = "/logout"; // Path to the logout page
    options.AccessDeniedPath = "/login";  // Optional: Path to handle access-denied scenarios
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});


builder.Services.AddCors(options =>
    options.AddPolicy(name: "AllowReactApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "https://icy-sky-018ec221e.6.azurestaticapps.net")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .WithExposedHeaders("Content-Security-Policy");

    }));

builder.Services.AddSingleton<IEmailSender<AppIdentityUser>, NoOpEmailSender<AppIdentityUser>>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
    await SeedRoles(roleManager);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

static async Task SeedRoles(RoleManager<IdentityRole<int>>roleManager)
{
    string[] roleNames = { "Admin", "User" };
    
    foreach (var roleName in roleNames)
    {
        // Check if role already exists
        var roleExists = await roleManager.RoleExistsAsync(roleName);
        if (!roleExists)
        {
            // Create the role
            var role = new IdentityRole<int>();
            await roleManager.CreateAsync(role);
            Console.WriteLine($"Created role: {roleName}");
        }
    }
}

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapIdentityApi<AppIdentityUser>();


app.MapPost("/logout", async (HttpContext context, SignInManager<AppIdentityUser> signInManager) =>
{
    await signInManager.SignOutAsync();
    
    // Ensure authentication cookie is removed
    context.Response.Cookies.Delete(".AspNetCore.Identity.Application", new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.None
    });
    context.Response.Cookies.Delete("cookie_consent_session", new CookieOptions
    {
        Path = "/",
        Secure = true,
        SameSite = SameSiteMode.None
    });


    return Results.Ok(new {
        // success = true,
        // redirect = "/login",
        message = "Logout successful",  
        timestamp = DateTime.UtcNow
});}).RequireAuthorization();


app.MapGet("/pingauth", (ClaimsPrincipal user) =>
{
    if (!user.Identity?.IsAuthenticated ?? false)
    {
        return Results.Unauthorized();
    }

    var email = user.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com"; // Ensure it's never null
    var roles = user.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();

    return Results.Json(new { email, roles }); // Check if roles are attached
}).RequireAuthorization();



app.Run();


