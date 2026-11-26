using System.Text;
using CourseSubmissions.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace CourseSubmissions.Api;

public record ProjectUrlInput(string? Url);
public record CardInput(string? Html, bool? IsHidden);

/// <summary>
/// Day 5 projects page: each team's published link + the Day 1 profile cards the trainer chose to show.
/// Cards are trainee HTML, so they are served with a CSP sandbox (no access to this origin) and framed in a sandboxed iframe.
/// </summary>
public static class ShowcaseEndpoints
{
    public const int MaxCardChars = 2_000_000; // ~2 MB of HTML (inline images included)

    public static void MapPublicShowcase(this WebApplication app)
    {
        app.MapGet("/api/showcase", async (AppDbContext db) =>
        {
            var cards = await db.TraineeCards.AsNoTracking()
                .Where(c => !c.IsHidden && c.Trainee!.IsActive)
                .Select(c => new { c.TraineeId, c.Trainee!.FullName, c.Trainee.TeamId, c.UpdatedAtUtc })
                .ToListAsync();
            var teams = await db.Teams.AsNoTracking()
                .OrderBy(t => t.SortOrder).ThenBy(t => t.Name)
                .Select(t => new { t.Id, t.Name, t.ProjectUrl })
                .ToListAsync();
            return Results.Ok(teams.Select(t => new
            {
                t.Id,
                t.Name,
                t.ProjectUrl,
                cards = cards.Where(c => c.TeamId == t.Id).OrderBy(c => c.FullName)
                    .Select(c => new { traineeId = c.TraineeId, name = c.FullName, v = c.UpdatedAtUtc.Ticks }),
            }));
        });

        app.MapGet("/api/showcase/cards/{traineeId:int}", async (int traineeId, HttpContext http, AppDbContext db) =>
        {
            var card = await db.TraineeCards.AsNoTracking()
                .FirstOrDefaultAsync(c => c.TraineeId == traineeId && !c.IsHidden && c.Trainee!.IsActive);
            if (card is null) return Results.NotFound();
            SetSandboxHeaders(http);
            return Results.Content(card.Html, "text/html; charset=utf-8", Encoding.UTF8);
        });
    }

    public static void MapAdminShowcase(this RouteGroupBuilder admin)
    {
        admin.MapGet("/showcase", async (AppDbContext db) =>
        {
            var cards = await db.TraineeCards.AsNoTracking()
                .Select(c => new { c.TraineeId, c.IsHidden, c.UpdatedAtUtc, size = c.Html.Length })
                .ToListAsync();
            var teams = await db.Teams.AsNoTracking()
                .OrderBy(t => t.SortOrder).ThenBy(t => t.Name)
                .Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.ProjectUrl,
                    trainees = t.Trainees.Where(x => x.IsActive).OrderBy(x => x.FullName).Select(x => new { x.Id, x.FullName }).ToList(),
                })
                .ToListAsync();
            return Results.Ok(teams.Select(t => new
            {
                t.Id,
                t.Name,
                t.ProjectUrl,
                trainees = t.trainees.Select(x =>
                {
                    var c = cards.FirstOrDefault(k => k.TraineeId == x.Id);
                    return new { x.Id, x.FullName, hasCard = c is not null, isHidden = c?.IsHidden ?? false, size = c?.size ?? 0 };
                }),
            }));
        });

        admin.MapPut("/teams/{id:int}/project", async (int id, ProjectUrlInput input, AppDbContext db) =>
        {
            var team = await db.Teams.FindAsync(id);
            if (team is null) return Results.NotFound();
            var url = (input.Url ?? "").Trim();
            if (url.Length == 0) team.ProjectUrl = null;
            else
            {
                if (url.Length > 300 || !Uri.TryCreate(url, UriKind.Absolute, out var u) || (u.Scheme != "https" && u.Scheme != "http"))
                    return Uploads.Error("الرابط لازم يبلش بـ https://");
                team.ProjectUrl = url;
            }
            await db.SaveChangesAsync();
            return Results.Ok(new { team.ProjectUrl });
        });

        admin.MapGet("/cards/{traineeId:int}", async (int traineeId, AppDbContext db) =>
        {
            var card = await db.TraineeCards.AsNoTracking().FirstOrDefaultAsync(c => c.TraineeId == traineeId);
            return card is null ? Results.NotFound() : Results.Ok(new { card.Html, card.IsHidden });
        });

        admin.MapPut("/cards/{traineeId:int}", async (int traineeId, CardInput input, AppDbContext db) =>
        {
            if (!await db.Trainees.AnyAsync(t => t.Id == traineeId)) return Results.NotFound();
            var card = await db.TraineeCards.FindAsync(traineeId);
            if (input.Html is not null)
            {
                if (string.IsNullOrWhiteSpace(input.Html)) return Uploads.Error("الصق كود البطاقة.");
                if (input.Html.Length > MaxCardChars) return Uploads.Error("كود البطاقة أكبر من 2MB.");
            }
            if (card is null)
            {
                if (input.Html is null) return Uploads.Error("الصق كود البطاقة.");
                card = new TraineeCard { TraineeId = traineeId };
                db.TraineeCards.Add(card);
            }
            if (input.Html is not null) card.Html = input.Html;
            if (input.IsHidden is not null) card.IsHidden = input.IsHidden.Value;
            card.UpdatedAtUtc = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        admin.MapDelete("/cards/{traineeId:int}", async (int traineeId, AppDbContext db) =>
        {
            var card = await db.TraineeCards.FindAsync(traineeId);
            if (card is null) return Results.NotFound();
            db.TraineeCards.Remove(card);
            await db.SaveChangesAsync();
            return Results.Ok();
        });
    }

    /// <summary>Trainee HTML runs in an opaque origin: scripts allowed, no cookies/storage of this API, links open in new tabs.</summary>
    private static void SetSandboxHeaders(HttpContext http)
    {
        http.Response.Headers["Content-Security-Policy"] = "sandbox allow-scripts allow-popups allow-popups-to-escape-sandbox";
        http.Response.Headers["X-Content-Type-Options"] = "nosniff";
        http.Response.Headers["Cache-Control"] = "public, max-age=300";
    }
}
