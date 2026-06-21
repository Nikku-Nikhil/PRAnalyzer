using System.Linq;
using Microsoft.CodeAnalysis.Host;
using Microsoft.EntityFrameworkCore;
using PRAnalyzerApi.Interfaces;
using PRAnalyzerApi.Models;
using PRAnalyzerApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Configure DbContext
builder.Services.AddDbContext<PRAnalyzerDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add controllers
builder.Services.AddControllers();

// Optional: Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register services
builder.Services.AddScoped<GitHubService>();
builder.Services.AddScoped<AnalyzerService>();
builder.Services.AddScoped<IDeveloperStatsService, DeveloperStatsService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Seed database domains
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PRAnalyzerDbContext>();
    
    var defaultDomains = new[]
    {
        new IssueDomain { Name = "Code Quality", Description = "Code quality issues, compiler errors, and coding standards" },
        new IssueDomain { Name = "Security", Description = "Security vulnerabilities and practices" },
        new IssueDomain { Name = "Style", Description = "Code formatting and style guidelines" },
        new IssueDomain { Name = "SQL", Description = "Database query and SQL performance optimization" }
    };

    bool changed = false;
    foreach (var d in defaultDomains)
    {
        if (!db.IssueDomains.Any(x => x.Name == d.Name))
        {
            db.IssueDomains.Add(d);
            changed = true;
        }
    }
    
    if (changed)
    {
        db.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS must come BEFORE MapControllers
app.UseCors("AllowFrontend");

app.UseAuthorization();
app.MapControllers();

app.Run();
