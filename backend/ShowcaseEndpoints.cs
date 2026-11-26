using System.Text;
using CourseSubmissions.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace CourseSubmissions.Api;

public record ProjectUrlInput(string? Url);
public record CardInput(string? Html, bool? IsHidden);

/// <summary>
/// Day 5 projects page: each team's published link + the team card the trainer pasted.
/// Cards are trainee HTML, so they are served with a CSP sandbox (no access to this origin) and framed in a sandboxed iframe.
/// </summary>
public static class ShowcaseEndpoints
{
    public const int MaxCardChars = 2_000_000; // ~2 MB of HTML (inline images included)

    public static void MapPublicShowcase(this WebApplication app)
    {
        app.MapGet("/api/showcase", async (AppDbContext db) =>
        {
            var cards = await db.TeamCards.AsNoTracking()
                .Where(c => !c.IsHidden)
                .Select(c => new { c.TeamId, c.UpdatedAtUtc })
                .ToListAsync();
            var teams = await db.Teams.AsNoTracking()
                .OrderBy(t => t.SortOrder).ThenBy(t => t.Name)
                .Select(t => new { t.Id, t.Name, t.ProjectUrl })
                .ToListAsync();
            return Results.Ok(teams.Select(t =>
            {
                var c = cards.FirstOrDefault(k => k.TeamId == t.Id);
                return new { t.Id, t.Name, t.ProjectUrl, hasCard = c is not null, v = c?.UpdatedAtUtc.Ticks ?? 0 };
            }));
        });

        app.MapGet("/api/showcase/cards/{teamId:int}", async (int teamId, HttpContext http, AppDbContext db) =>
        {
            var card = await db.TeamCards.AsNoTracking().FirstOrDefaultAsync(c => c.TeamId == teamId && !c.IsHidden);
            if (card is null) return Results.NotFound();
            SetSandboxHeaders(http);
            return Results.Content(card.Html, "text/html; charset=utf-8", Encoding.UTF8);
        });
    }

    public static void MapAdminShowcase(this RouteGroupBuilder admin)
    {
        admin.MapGet("/showcase", async (AppDbContext db) =>
        {
            var cards = await db.TeamCards.AsNoTracking()
                .Select(c => new { c.TeamId, c.IsHidden, size = c.Html.Length })
                .ToListAsync();
            var teams = await db.Teams.AsNoTracking()
                .OrderBy(t => t.SortOrder).ThenBy(t => t.Name)
                .Select(t => new { t.Id, t.Name, t.ProjectUrl })
                .ToListAsync();
            return Results.Ok(teams.Select(t =>
            {
                var c = cards.FirstOrDefault(k => k.TeamId == t.Id);
                return new { t.Id, t.Name, t.ProjectUrl, hasCard = c is not null, isHidden = c?.IsHidden ?? false, size = c?.size ?? 0 };
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

        admin.MapGet("/cards/{teamId:int}", async (int teamId, AppDbContext db) =>
        {
            var card = await db.TeamCards.AsNoTracking().FirstOrDefaultAsync(c => c.TeamId == teamId);
            return card is null ? Results.NotFound() : Results.Ok(new { card.Html, card.IsHidden });
        });

        admin.MapPut("/cards/{teamId:int}", async (int teamId, CardInput input, AppDbContext db) =>
        {
            if (!await db.Teams.AnyAsync(t => t.Id == teamId)) return Results.NotFound();
            var card = await db.TeamCards.FindAsync(teamId);
            if (input.Html is not null)
            {
                if (string.IsNullOrWhiteSpace(input.Html)) return Uploads.Error("الصق كود البطاقة.");
                if (input.Html.Length > MaxCardChars) return Uploads.Error("كود البطاقة أكبر من 2MB.");
            }
            if (card is null)
            {
                if (input.Html is null) return Uploads.Error("الصق كود البطاقة.");
                card = new TeamCard { TeamId = teamId };
                db.TeamCards.Add(card);
            }
            if (input.Html is not null) card.Html = input.Html;
            if (input.IsHidden is not null) card.IsHidden = input.IsHidden.Value;
            card.UpdatedAtUtc = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        admin.MapDelete("/cards/{teamId:int}", async (int teamId, AppDbContext db) =>
        {
            var card = await db.TeamCards.FindAsync(teamId);
            if (card is null) return Results.NotFound();
            db.TeamCards.Remove(card);
            await db.SaveChangesAsync();
            return Results.Ok();
        });
    }

    /// <summary>Team HTML runs in an opaque origin: scripts allowed, no access to this API's origin, links open in new tabs.</summary>
    private static void SetSandboxHeaders(HttpContext http)
    {
        http.Response.Headers["Content-Security-Policy"] = "sandbox allow-scripts allow-popups allow-popups-to-escape-sandbox";
        http.Response.Headers["X-Content-Type-Options"] = "nosniff";
        http.Response.Headers["Cache-Control"] = "public, max-age=300";
    }
}
