using System.Text.Json;
using CourseSubmissions.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace CourseSubmissions.Api;

public record SubmissionEditInput(int Day, Dictionary<string, string>? Answers);
public record MergeInput(int TargetId, List<int> SourceIds, int Day, Dictionary<string, string>? Answers, List<int>? KeepFileIds);

/// <summary>
/// Trainer tools for messy submissions: edit (day, answers, files), merge duplicates, trash with restore.
/// Nothing is removed for good except from the trash.
/// </summary>
public static class AdminEditEndpoints
{
    private static string AnswersToJson(Dictionary<string, string>? answers)
    {
        var clean = new Dictionary<string, string>();
        foreach (var pair in answers ?? new Dictionary<string, string>())
        {
            var key = Uploads.Truncate((pair.Key ?? "").Trim(), 100);
            if (key.Length == 0) continue;
            clean[key] = (pair.Value ?? "").Trim();
        }
        return JsonSerializer.Serialize(clean);
    }

    public static void MapAdminEdit(this RouteGroupBuilder admin, string uploadsRoot)
    {
        // ---------- Edit: day + answers ----------
        admin.MapPut("/submissions/{id:int}", async (int id, SubmissionEditInput input, AppDbContext db) =>
        {
            if (input.Day is < 1 or > 5) return Uploads.Error("رقم اليوم غير صحيح.");
            var json = AnswersToJson(input.Answers);
            if (json.Length > Limits.MaxAnswersChars) return Uploads.Error("الإجابات أطول من المسموح.");

            var s = await db.Submissions.FirstOrDefaultAsync(x => x.Id == id);
            if (s is null) return Results.NotFound();
            s.Day = input.Day;              // moving to another day: files stay where they are on disk
            s.AnswersJson = json;
            s.UpdatedAtUtc = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        // ---------- Add files to an existing submission ----------
        admin.MapPost("/submissions/{id:int}/files", async (int id, HttpRequest request, AppDbContext db, ILoggerFactory loggerFactory) =>
        {
            if (!request.HasFormContentType) return Uploads.Error("الطلب لازم يكون form-data.");
            IFormCollection form;
            try
            {
                form = await request.ReadFormAsync();
            }
            catch (InvalidDataException)
            {
                return Uploads.Error("حجم الملفات أكبر من المسموح.", StatusCodes.Status413PayloadTooLarge);
            }

            var files = form.Files.Where(f => f.Length > 0).ToList();
            if (files.Count == 0) return Uploads.Error("اختار ملف.");
            var error = Uploads.ValidateFiles(files);
            if (error is not null) return Uploads.Error(error);

            var s = await db.Submissions.Include(x => x.Files).FirstOrDefaultAsync(x => x.Id == id);
            if (s is null) return Results.NotFound();

            var saved = new List<string>();
            try
            {
                await Uploads.SaveFilesAsync(uploadsRoot, s, files, saved);
                s.UpdatedAtUtc = DateTime.UtcNow;
                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                loggerFactory.CreateLogger("AdminEdit").LogError(ex, "Adding files failed");
                Uploads.DeleteQuietly(saved);
                return Uploads.Error("صار خطأ بالسيرفر.", StatusCodes.Status500InternalServerError);
            }
            return Results.Ok();
        });

        // ---------- Merge duplicates into one submission ----------
        // The trainer picks the final value of every field and which files to keep.
        // Kept files move to the target; links and feedback move too; the other submissions go to the trash.
        admin.MapPost("/merge", async (MergeInput input, AppDbContext db) =>
        {
            if (input.Day is < 1 or > 5) return Uploads.Error("رقم اليوم غير صحيح.");
            var sourceIds = (input.SourceIds ?? new List<int>()).Where(x => x != input.TargetId).Distinct().ToList();
            if (sourceIds.Count == 0) return Uploads.Error("اختار تسليمين على الأقل.");
            var json = AnswersToJson(input.Answers);
            if (json.Length > Limits.MaxAnswersChars) return Uploads.Error("الإجابات أطول من المسموح.");

            var allIds = sourceIds.Append(input.TargetId).ToList();
            var subs = await db.Submissions.Include(s => s.Files).Include(s => s.Trainees)
                .Where(s => allIds.Contains(s.Id)).ToListAsync();
            if (subs.Count != allIds.Count) return Uploads.Error("في تسليم مش موجود (يمكن انحذف).");

            var target = subs.Single(s => s.Id == input.TargetId);
            var sources = subs.Where(s => s.Id != input.TargetId).ToList();
            var keep = (input.KeepFileIds ?? new List<int>()).ToHashSet();
            var now = DateTime.UtcNow;

            // Files: kept ones end up on the target, the rest go to the trash.
            foreach (var f in subs.SelectMany(s => s.Files).ToList())
            {
                if (!keep.Contains(f.Id))
                {
                    f.IsDeleted = true;
                    f.DeletedAtUtc = now;
                }
                else if (f.SubmissionId != target.Id)
                {
                    f.SubmissionId = target.Id;
                }
            }

            // Links: union of everyone.
            var linked = target.Trainees.Select(t => t.TraineeId).ToHashSet();
            foreach (var st in sources.SelectMany(s => s.Trainees))
            {
                if (linked.Add(st.TraineeId))
                    target.Trainees.Add(new SubmissionTrainee { SubmissionId = target.Id, TraineeId = st.TraineeId });
            }

            // Feedback written on the duplicates stays visible on the merged one.
            var feedback = await db.Feedback.Where(f => sourceIds.Contains(f.SubmissionId)).ToListAsync();
            foreach (var f in feedback) f.SubmissionId = target.Id;

            target.Day = input.Day;
            target.AnswersJson = json;
            target.UpdatedAtUtc = now;
            foreach (var s in sources)
            {
                s.IsDeleted = true;
                s.DeletedAtUtc = now;
                s.MergedIntoId = target.Id;
            }

            await db.SaveChangesAsync();
            return Results.Ok(new { id = target.Id });
        });

        // ---------- Trash ----------
        admin.MapGet("/trash", async (AppDbContext db) =>
        {
            var subs = await db.Submissions.IgnoreQueryFilters().AsNoTracking()
                .Include(s => s.Trainees).ThenInclude(st => st.Trainee)
                .Where(s => s.IsDeleted)
                .OrderByDescending(s => s.DeletedAtUtc)
                .ToListAsync();
            var subIds = subs.Select(s => s.Id).ToList();
            var fileCounts = await db.SubmissionFiles.IgnoreQueryFilters()
                .Where(f => subIds.Contains(f.SubmissionId) && !f.IsDeleted)
                .GroupBy(f => f.SubmissionId).Select(g => new { g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Key, x => x.Count);

            var files = await db.SubmissionFiles.IgnoreQueryFilters().AsNoTracking()
                .Include(f => f.Submission)
                .Where(f => f.IsDeleted && !f.Submission!.IsDeleted)
                .OrderByDescending(f => f.DeletedAtUtc)
                .ToListAsync();

            return Results.Ok(new
            {
                submissions = subs.Select(s => new
                {
                    s.Id,
                    s.Day,
                    s.FullName,
                    s.TeamNumber,
                    s.MergedIntoId,
                    trainees = s.Trainees.Select(t => t.Trainee!.FullName),
                    files = fileCounts.TryGetValue(s.Id, out var c) ? c : 0,
                    deletedAt = s.DeletedAtUtc is null ? (DateTime?)null : Limits.ToAmman(s.DeletedAtUtc.Value),
                }),
                files = files.Select(f => new
                {
                    f.Id,
                    f.OriginalName,
                    f.SizeBytes,
                    f.SubmissionId,
                    day = f.Submission!.Day,
                    who = f.Submission.FullName,
                    deletedAt = f.DeletedAtUtc is null ? (DateTime?)null : Limits.ToAmman(f.DeletedAtUtc.Value),
                }),
            });
        });

        admin.MapPost("/trash/submissions/{id:int}/restore", async (int id, AppDbContext db) =>
        {
            var s = await db.Submissions.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Id == id && x.IsDeleted);
            if (s is null) return Results.NotFound();
            s.IsDeleted = false;
            s.DeletedAtUtc = null;
            s.MergedIntoId = null;
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        admin.MapPost("/trash/files/{id:int}/restore", async (int id, AppDbContext db) =>
        {
            var f = await db.SubmissionFiles.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Id == id && x.IsDeleted);
            if (f is null) return Results.NotFound();
            f.IsDeleted = false;
            f.DeletedAtUtc = null;
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        // Permanent delete (only from the trash): removes the rows and the files on disk.
        admin.MapDelete("/trash/submissions/{id:int}", async (int id, AppDbContext db) =>
        {
            var s = await db.Submissions.IgnoreQueryFilters().Include(x => x.Files)
                .FirstOrDefaultAsync(x => x.Id == id && x.IsDeleted);
            if (s is null) return Results.NotFound();
            var allFiles = await db.SubmissionFiles.IgnoreQueryFilters().Where(f => f.SubmissionId == id).ToListAsync();
            var paths = allFiles.Select(f => Uploads.SafeFullPath(uploadsRoot, f.StoredPath)).Where(p => p is not null).Select(p => p!).ToList();
            db.Submissions.Remove(s); // DB cascade removes files rows, links and feedback
            await db.SaveChangesAsync();
            Uploads.DeleteQuietly(paths);
            return Results.Ok();
        });

        admin.MapDelete("/trash/files/{id:int}", async (int id, AppDbContext db) =>
        {
            var f = await db.SubmissionFiles.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Id == id && x.IsDeleted);
            if (f is null) return Results.NotFound();
            var full = Uploads.SafeFullPath(uploadsRoot, f.StoredPath);
            db.SubmissionFiles.Remove(f);
            await db.SaveChangesAsync();
            if (full is not null) Uploads.DeleteQuietly(new[] { full });
            return Results.Ok();
        });
    }
}
