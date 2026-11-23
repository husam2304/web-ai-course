using System.Collections.Concurrent;
using System.Security.Cryptography;
using CourseSubmissions.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace CourseSubmissions.Api;

public record FeedbackInput(int SubmissionId, string Scope, int? TraineeId, string Kind, string Text);
public record FeedbackEditInput(string Kind, string Text);
public record PersonalFeedbackInput(int TraineeId, string Code);
public record ResolveInput(int? TeamId, int? TraineeId, string? Code, bool Resolved);

/// <summary>
/// Trainer feedback on submissions. Team feedback is visible to anyone who opens the team's page;
/// personal feedback needs the trainee's 4-digit code (keeps classmates out, it is not real security).
/// </summary>
public static class FeedbackEndpoints
{
    private static readonly string[] Kinds = ["good", "improve", "fix"];

    // ---------- Access codes ----------
    public static string NewCode() => RandomNumberGenerator.GetInt32(1000, 10000).ToString();

    /// <summary>Gives a code to every trainee that has none (trainees created before this feature).</summary>
    public static async Task EnsureCodesAsync(AppDbContext db)
    {
        var missing = await db.Trainees.Where(t => t.AccessCode == null || t.AccessCode == "").ToListAsync();
        if (missing.Count == 0) return;
        foreach (var t in missing) t.AccessCode = NewCode();
        await db.SaveChangesAsync();
    }

    // Brute-force guard: 8 wrong codes for one trainee → locked for 15 minutes.
    private static readonly ConcurrentDictionary<int, (int Fails, DateTime Until)> Attempts = new();

    private static async Task<Trainee?> CheckCodeAsync(AppDbContext db, int traineeId, string? code)
    {
        if (Attempts.TryGetValue(traineeId, out var a) && a.Until > DateTime.UtcNow) return null;

        var trainee = await db.Trainees.Include(t => t.Team).FirstOrDefaultAsync(t => t.Id == traineeId);
        var ok = trainee is not null && !string.IsNullOrEmpty(trainee.AccessCode)
            && string.Equals(trainee.AccessCode, (code ?? "").Trim(), StringComparison.Ordinal);
        if (ok)
        {
            Attempts.TryRemove(traineeId, out _);
            return trainee;
        }

        Attempts.AddOrUpdate(traineeId,
            _ => (1, DateTime.MinValue),
            (_, old) => old.Fails + 1 >= 8 ? (0, DateTime.UtcNow.AddMinutes(15)) : (old.Fails + 1, DateTime.MinValue));
        return null;
    }

    private static object ToPublic(Feedback f, bool wasNew) => new
    {
        f.Id,
        day = f.Submission!.Day,
        f.SubmissionId,
        f.Kind,
        f.Text,
        createdAt = Limits.ToAmman(f.CreatedAtUtc),
        resolvedAt = f.ResolvedAtUtc is null ? (DateTime?)null : Limits.ToAmman(f.ResolvedAtUtc.Value),
        f.ResolvedBy,
        isNew = wasNew,
    };

    public static object ToAdmin(Feedback f) => new
    {
        f.Id,
        f.SubmissionId,
        f.Scope,
        f.TeamId,
        f.TraineeId,
        target = f.Scope == "team" ? "الفريق" : f.Trainee?.FullName,
        f.Kind,
        f.Text,
        createdAt = Limits.ToAmman(f.CreatedAtUtc),
        seenAt = f.SeenAtUtc is null ? (DateTime?)null : Limits.ToAmman(f.SeenAtUtc.Value),
        resolvedAt = f.ResolvedAtUtc is null ? (DateTime?)null : Limits.ToAmman(f.ResolvedAtUtc.Value),
        f.ResolvedBy,
    };

    // Marks unseen items as seen and returns which ones were new before this view.
    private static async Task<List<object>> ViewAsync(AppDbContext db, List<Feedback> items)
    {
        var now = DateTime.UtcNow;
        var result = new List<object>();
        foreach (var f in items)
        {
            var wasNew = f.SeenAtUtc is null;
            if (wasNew) f.SeenAtUtc = now;
            result.Add(ToPublic(f, wasNew));
        }
        await db.SaveChangesAsync();
        return result;
    }

    // =====================================================================
    // Public (trainees)
    // =====================================================================
    public static void MapPublicFeedback(this WebApplication app)
    {
        // Team feedback (opening the team page counts as "seen").
        app.MapGet("/api/teams/{teamId:int}/feedback", async (int teamId, AppDbContext db) =>
        {
            var items = await db.Feedback.Include(f => f.Submission)
                .Where(f => f.Scope == "team" && f.TeamId == teamId)
                .OrderByDescending(f => f.Submission!.Day).ThenByDescending(f => f.CreatedAtUtc)
                .ToListAsync();
            return Results.Ok(await ViewAsync(db, items));
        })
        .RequireRateLimiting("submit");

        // Counts for the badge on the submit page (does not mark anything as seen).
        app.MapGet("/api/teams/{teamId:int}/feedback/count", async (int teamId, AppDbContext db) =>
        {
            var team = await db.Feedback.Where(f => f.Scope == "team" && f.TeamId == teamId)
                .Select(f => new { f.SeenAtUtc, f.ResolvedAtUtc }).ToListAsync();
            return Results.Ok(new
            {
                total = team.Count,
                isNew = team.Count(f => f.SeenAtUtc == null),
                open = team.Count(f => f.ResolvedAtUtc == null),
            });
        })
        .RequireRateLimiting("submit");

        // Personal feedback: needs the trainee's code.
        app.MapPost("/api/feedback/personal", async (PersonalFeedbackInput input, AppDbContext db) =>
        {
            var trainee = await CheckCodeAsync(db, input.TraineeId, input.Code);
            if (trainee is null) return Uploads.Error("الكود غلط. تأكد منه أو اسأل المدرب.", StatusCodes.Status403Forbidden);

            var items = await db.Feedback.Include(f => f.Submission)
                .Where(f => f.Scope == "trainee" && f.TraineeId == trainee.Id)
                .OrderByDescending(f => f.Submission!.Day).ThenByDescending(f => f.CreatedAtUtc)
                .ToListAsync();
            return Results.Ok(new { trainee.FullName, items = await ViewAsync(db, items) });
        })
        .RequireRateLimiting("submit");

        // «تم التعديل» (or undo). Team notes: any team member. Personal notes: the trainee with their code.
        app.MapPost("/api/feedback/{id:int}/resolve", async (int id, ResolveInput input, AppDbContext db) =>
        {
            var f = await db.Feedback.FindAsync(id);
            if (f is null) return Results.NotFound();

            string by;
            if (f.Scope == "team")
            {
                if (input.TeamId != f.TeamId) return Results.NotFound();
                by = "الفريق";
                if (input.TraineeId is not null)
                {
                    var name = await db.Trainees.Where(t => t.Id == input.TraineeId && t.TeamId == f.TeamId)
                        .Select(t => t.FullName).FirstOrDefaultAsync();
                    if (name is not null) by = name;
                }
            }
            else
            {
                if (input.TraineeId != f.TraineeId) return Results.NotFound();
                var trainee = await CheckCodeAsync(db, input.TraineeId!.Value, input.Code);
                if (trainee is null) return Uploads.Error("الكود غلط.", StatusCodes.Status403Forbidden);
                by = trainee.FullName;
            }

            f.ResolvedAtUtc = input.Resolved ? DateTime.UtcNow : null;
            f.ResolvedBy = input.Resolved ? Uploads.Truncate(by, 150) : null;
            await db.SaveChangesAsync();
            return Results.Ok();
        })
        .RequireRateLimiting("submit");
    }

    // =====================================================================
    // Admin (called from MapAdmin, so the admin-key filter applies)
    // =====================================================================
    public static void MapAdminFeedback(this RouteGroupBuilder admin)
    {
        admin.MapPost("/feedback", async (FeedbackInput input, AppDbContext db) =>
        {
            var text = (input.Text ?? "").Trim();
            if (text.Length is < 2 or > 2000) return Uploads.Error("اكتب الملاحظة (لحد 2000 حرف).");
            if (!Kinds.Contains(input.Kind)) return Uploads.Error("نوع الملاحظة غير صحيح.");

            var submission = await db.Submissions.Include(s => s.Trainees).ThenInclude(st => st.Trainee)
                .FirstOrDefaultAsync(s => s.Id == input.SubmissionId);
            if (submission is null) return Results.NotFound();
            if (submission.Trainees.Count == 0) return Uploads.Error("اربط التسليم بمتدرب أول، عشان نعرف لمين الملاحظة.");

            var f = new Feedback { SubmissionId = submission.Id, Kind = input.Kind, Text = text, CreatedAtUtc = DateTime.UtcNow };
            if (input.Scope == "team")
            {
                f.Scope = "team";
                f.TeamId = submission.Trainees[0].Trainee!.TeamId;
            }
            else if (input.Scope == "trainee" && input.TraineeId is not null
                     && submission.Trainees.Any(st => st.TraineeId == input.TraineeId))
            {
                f.Scope = "trainee";
                f.TraineeId = input.TraineeId;
            }
            else
            {
                return Uploads.Error("اختار لمين الملاحظة: للفريق أو لواحد من أصحاب التسليم.");
            }

            db.Feedback.Add(f);
            await db.SaveChangesAsync();
            return Results.Ok(new { f.Id });
        });

        admin.MapPut("/feedback/{id:int}", async (int id, FeedbackEditInput input, AppDbContext db) =>
        {
            var f = await db.Feedback.FindAsync(id);
            if (f is null) return Results.NotFound();
            var text = (input.Text ?? "").Trim();
            if (text.Length is < 2 or > 2000) return Uploads.Error("اكتب الملاحظة (لحد 2000 حرف).");
            if (!Kinds.Contains(input.Kind)) return Uploads.Error("نوع الملاحظة غير صحيح.");
            f.Kind = input.Kind;
            f.Text = text;
            f.SeenAtUtc = null; // changed → shows as new again
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        admin.MapDelete("/feedback/{id:int}", async (int id, AppDbContext db) =>
        {
            var f = await db.Feedback.FindAsync(id);
            if (f is null) return Results.NotFound();
            db.Feedback.Remove(f);
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        // Codes for printing / sending.
        admin.MapGet("/codes", async (AppDbContext db) =>
        {
            await EnsureCodesAsync(db);
            var rows = await db.Teams.AsNoTracking()
                .OrderBy(t => t.SortOrder).ThenBy(t => t.Name)
                .Select(t => new
                {
                    team = t.Name,
                    trainees = t.Trainees.Where(x => x.IsActive).OrderBy(x => x.FullName)
                        .Select(x => new { x.Id, x.FullName, code = x.AccessCode }).ToList(),
                })
                .ToListAsync();
            return Results.Ok(rows);
        });

        admin.MapPost("/trainees/{id:int}/code", async (int id, AppDbContext db) =>
        {
            var t = await db.Trainees.FindAsync(id);
            if (t is null) return Results.NotFound();
            t.AccessCode = NewCode();
            await db.SaveChangesAsync();
            Attempts.TryRemove(id, out _);
            return Results.Ok(new { code = t.AccessCode });
        });
    }
}
