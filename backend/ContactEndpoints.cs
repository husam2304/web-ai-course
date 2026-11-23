using System.Text.RegularExpressions;
using CourseSubmissions.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace CourseSubmissions.Api;

public record ContactInput(string? Name, string? Phone, string? TeamName, string? Kind, string? Message, bool Anonymous, string? Website);
public record ContactUpdateInput(string? Status, string? AdminNote);

/// <summary>Contact page messages: sent from the course website, read in the admin page.</summary>
public static class ContactEndpoints
{
    private static readonly string[] Kinds = ["question", "absence", "feedback", "other"];

    public static void MapPublicContact(this WebApplication app)
    {
        app.MapPost("/api/contact", async (ContactInput input, AppDbContext db) =>
        {
            // Honeypot: bots fill every field. Pretend it worked.
            if (!string.IsNullOrWhiteSpace(input.Website)) return Results.Ok(new { id = 0 });

            var message = (input.Message ?? "").Trim();
            if (message.Length is < 5 or > 3000) return Uploads.Error("اكتب رسالتك (من 5 لـ 3000 حرف).");
            var kind = Kinds.Contains(input.Kind) ? input.Kind! : "other";

            var msg = new ContactMessage
            {
                Kind = kind,
                Message = message,
                IsAnonymous = input.Anonymous,
                CreatedAtUtc = DateTime.UtcNow,
                Status = "new",
            };

            if (!input.Anonymous)
            {
                var name = Uploads.Clean(input.Name ?? "");
                if (name.Length is < 2 or > 150) return Uploads.Error("اكتب اسمك، أو اختار «بدون اسم».");
                msg.Name = name;

                var phone = Regex.Replace(input.Phone ?? "", @"[\s\-()]", "");
                if (phone.Length > 0)
                {
                    if (!Regex.IsMatch(phone, @"^\+?\d{7,15}$")) return Uploads.Error("رقم الهاتف غير صحيح.");
                    msg.Phone = phone;
                }

                var team = Uploads.Clean(input.TeamName ?? "");
                if (team.Length > 0) msg.TeamName = Uploads.Truncate(team, 100);
            }

            db.ContactMessages.Add(msg);
            await db.SaveChangesAsync();
            return Results.Ok(new { id = msg.Id });
        })
        .RequireRateLimiting("submit");
    }

    public static void MapAdminContact(this RouteGroupBuilder admin)
    {
        admin.MapGet("/messages", async (AppDbContext db) =>
        {
            var list = await db.ContactMessages.AsNoTracking().OrderByDescending(m => m.CreatedAtUtc).ToListAsync();
            return Results.Ok(list.Select(m => new
            {
                m.Id,
                m.Name,
                m.Phone,
                m.TeamName,
                m.Kind,
                m.Message,
                m.IsAnonymous,
                createdAt = Limits.ToAmman(m.CreatedAtUtc),
                m.Status,
                m.AdminNote,
            }));
        });

        admin.MapPut("/messages/{id:int}", async (int id, ContactUpdateInput input, AppDbContext db) =>
        {
            var m = await db.ContactMessages.FindAsync(id);
            if (m is null) return Results.NotFound();
            if (input.Status is "new" or "replied") m.Status = input.Status;
            if (input.AdminNote is not null)
                m.AdminNote = string.IsNullOrWhiteSpace(input.AdminNote) ? null : Uploads.Truncate(input.AdminNote.Trim(), 1000);
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        admin.MapDelete("/messages/{id:int}", async (int id, AppDbContext db) =>
        {
            var m = await db.ContactMessages.FindAsync(id);
            if (m is null) return Results.NotFound();
            db.ContactMessages.Remove(m);
            await db.SaveChangesAsync();
            return Results.Ok();
        });
    }
}
