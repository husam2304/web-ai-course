using System.Threading.RateLimiting;
using CourseSubmissions.Api;
using CourseSubmissions.Api.Data;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ---------- Limits ----------
builder.Services.Configure<FormOptions>(o => o.MultipartBodyLengthLimit = Limits.MaxRequestBytes);
builder.Services.Configure<IISServerOptions>(o => o.MaxRequestBodySize = Limits.MaxRequestBytes);
builder.WebHost.ConfigureKestrel(o => o.Limits.MaxRequestBodySize = Limits.MaxRequestBytes);

// ---------- Database ----------
builder.Services.AddDbContext<AppDbContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// ---------- CORS: only the course website ----------
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(o => o.AddPolicy("site", p => p
    .WithOrigins(allowedOrigins)
    .WithMethods("GET", "POST", "PUT", "DELETE")
    .AllowAnyHeader()
    .WithExposedHeaders("Content-Disposition")));

// ---------- Rate limit: per IP (a whole classroom may share one IP, so it is generous) ----------
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    o.AddPolicy("submit", http => RateLimitPartition.GetFixedWindowLimiter(
        http.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 60, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 }));
});

var app = builder.Build();

// Create tables on a fresh database, then add anything newer to an existing one.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    await SchemaUpgrade.RunAsync(db);
}

var uploadsRoot = builder.Configuration["Uploads:Path"];
if (string.IsNullOrWhiteSpace(uploadsRoot))
{
    // App_Data is never served as static content by IIS.
    uploadsRoot = Path.Combine(app.Environment.ContentRootPath, "App_Data", "uploads");
}
Directory.CreateDirectory(uploadsRoot);

app.UseCors("site");
app.UseRateLimiter();

app.MapGet("/", () => Results.Ok(new { status = "ok", service = "course-submissions" }));

// Trainees: teams list, submit form, team files
app.MapPublic(uploadsRoot);

// Trainer: protected by Admin:Key
app.MapAdmin(uploadsRoot);

app.Run();
