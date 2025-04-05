using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using intex2.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<BookstoreContext>(options =>
{
    options.UseSqlite(builder.Configuration["ConnectionStrings:BowlingConnect"]);
});
builder.Services.AddDbContext<UserContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("UserConnection"));
});

builder.Services.AddCors(options =>
    options.AddPolicy("AllowReactApp",
    policy =>  {
        policy.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader();
    }));

// // Add this after registering your services but before building the app
// using (var scope = builder.Services.BuildServiceProvider().CreateScope())
// {
//     var services = scope.ServiceProvider;
//     try
//     {
//         var context = services.GetRequiredService<UserContext>();
        
//         // Force recreate database
//         context.Database.EnsureDeleted();
//         context.Database.EnsureCreated();
        
//         Console.WriteLine("Database recreated successfully.");
//     }
//     catch (Exception ex)
//     {
//         Console.WriteLine($"Error recreating database: {ex.Message}");
//     }
// }

var app = builder.Build();

builder.Services.AddCors();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();