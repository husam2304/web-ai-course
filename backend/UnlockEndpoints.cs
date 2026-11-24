using System.Text.RegularExpressions;
using CourseSubmissions.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace CourseSubmissions.Api;

public record UnlockInput(bool Unlocked);

/// <summary>
/// «ملفات الدورة» cards that stay hidden until the trainer opens them from the admin page.
/// Keys come from data-lock="..." in resources.html (e.g. d3-p1). The page only hides them: this is not security.
/// </summary>
public static class UnlockEndpoints
{
    private static readonly Regex KeyPattern = new("^[a-z0-9-]{1,64}$", RegexOptions.Compiled);

    // No rate limit: every open resources page polls this, and the whole classroom shares one IP.
    public static void MapPublicUnlocks(this WebApplication app)
    {
        app.MapGet("/api/unlocks", async (AppDbContext db) =>
            Results.Ok(await db.ContentUnlocks.AsNoTracking().Select(u => u.Key).ToListAsync()));
    }

    public static void MapAdminUnlocks(this RouteGroupBuilder admin)
    {
        admin.MapGet("/unlocks", async (AppDbContext db) =>
            Results.Ok(await db.ContentUnlocks.AsNoTracking().Select(u => u.Key).ToListAsync()));

        admin.MapPut("/unlocks/{key}", async (string key, UnlockInput input, AppDbContext db) =>
        {
            if (!KeyPattern.IsMatch(key)) return Uploads.Error("اسم البطاقة غير صحيح.");
            var row = await db.ContentUnlocks.FindAsync(key);
            if (input.Unlocked && row is null)
                db.ContentUnlocks.Add(new ContentUnlock { Key = key, UnlockedAtUtc = DateTime.UtcNow });
            else if (!input.Unlocked && row is not null)
                db.ContentUnlocks.Remove(row);
            await db.SaveChangesAsync();
            return Results.Ok(new { key, unlocked = input.Unlocked });
        });
    }
}
