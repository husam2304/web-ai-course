using CourseSubmissions.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace CourseSubmissions.Api;

/// <summary>Endpoints used by trainees from the course website (no login).</summary>
public static class PublicEndpoints
{
    private static readonly string[] TeamTextKeys = [AnswerFormatter.ReportKey, "خطة الفريق", "شغل إضافي"];

    public static void MapPublic(this WebApplication app, string uploadsRoot)
    {
        // ---------- Teams + active trainees (for the dropdowns) ----------
        app.MapGet("/api/teams", async (AppDbContext db) =>
        {
            var teams = await db.Teams.AsNoTracking()
                .OrderBy(t => t.SortOrder).ThenBy(t => t.Name)
                .Select(t => new
                {
                    t.Id,
                    t.Name,
                    trainees = t.Trainees.Where(x => x.IsActive).OrderBy(x => x.FullName)
                        .Select(x => new { x.Id, x.FullName }).ToList(),
                })
                .ToListAsync();
            return Results.Ok(teams);
        });

        // ---------- Submit ----------
        app.MapPost("/api/submissions", async (HttpRequest request, AppDbContext db, ILoggerFactory loggerFactory) =>
        {
            if (!request.HasFormContentType)
                return Uploads.Error("الطلب لازم يكون form-data.");

            IFormCollection form;
            try
            {
                form = await request.ReadFormAsync();
            }
            catch (InvalidDataException)
            {
                return Uploads.Error("حجم الملفات أكبر من المسموح.", StatusCodes.Status413PayloadTooLarge);
            }

            // Honeypot: real users never fill this hidden field.
            if (!string.IsNullOrEmpty(form["website"].ToString()))
                return Results.Ok(new { id = 0 });

            if (!int.TryParse(form["day"].ToString(), out var day) || day is < 1 or > 5)
                return Uploads.Error("رقم اليوم غير صحيح.");

            // New form: trainee chosen from the dropdown. Old form: typed name + team.
            Trainee? trainee = null;
            string fullName;
            string teamLabel;
            if (int.TryParse(form["traineeId"].ToString(), out var traineeId))
            {
                trainee = await db.Trainees.Include(t => t.Team)
                    .FirstOrDefaultAsync(t => t.Id == traineeId && t.IsActive);
                if (trainee is null)
                    return Uploads.Error("اختار اسمك من القائمة.");
                fullName = trainee.FullName;
                teamLabel = trainee.Team!.Name;
            }
            else
            {
                fullName = Uploads.Clean(form["fullName"].ToString());
                teamLabel = Uploads.Clean(form["teamNumber"].ToString());
                if (fullName.Length is < 2 or > 150) return Uploads.Error("اختار اسمك من القائمة.");
                if (teamLabel.Length is < 1) return Uploads.Error("اختار فريقك.");
            }

            var answersJson = form["answers"].ToString();
            if (string.IsNullOrWhiteSpace(answersJson)) answersJson = "{}";
            var answersError = Uploads.ValidateAnswers(answersJson);
            if (answersError is not null) return Uploads.Error(answersError);

            var files = form.Files.Where(f => f.Length > 0).ToList();
            var filesError = Uploads.ValidateFiles(files);
            if (filesError is not null) return Uploads.Error(filesError);

            var submission = new Submission
            {
                Day = day,
                FullName = Uploads.Truncate(fullName, 150),
                TeamNumber = Uploads.Truncate(teamLabel, 20),
                AnswersJson = answersJson,
                CreatedAtUtc = DateTime.UtcNow,
                Source = "form",
            };
            if (trainee is not null)
                submission.Trainees.Add(new SubmissionTrainee { TraineeId = trainee.Id });

            var savedPaths = new List<string>();
            try
            {
                await Uploads.SaveFilesAsync(uploadsRoot, submission, files, savedPaths);
                db.Submissions.Add(submission);
                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                loggerFactory.CreateLogger("Submissions").LogError(ex, "Saving submission failed");
                Uploads.DeleteQuietly(savedPaths);
                return Uploads.Error("صار خطأ بالسيرفر، جرّب كمان مرة.", StatusCodes.Status500InternalServerError);
            }

            return Results.Ok(new { id = submission.Id });
        })
        .RequireRateLimiting("submit");

        // ---------- Files of a team (newest first) ----------
        app.MapGet("/api/teams/{teamId:int}/files", async (int teamId, AppDbContext db) =>
        {
            var submissions = await db.Submissions.AsNoTracking()
                .Include(s => s.Files)
                .Include(s => s.Trainees).ThenInclude(st => st.Trainee)
                .Where(s => s.Trainees.Any(st => st.Trainee!.TeamId == teamId))
                .ToListAsync();

            var files = submissions
                .SelectMany(s => s.Files.Select(f => new
                {
                    f.Id,
                    f.OriginalName,
                    f.SizeBytes,
                    s.Day,
                    createdAt = Limits.ToAmman(s.CreatedAtUtc),
                    uploadedBy = s.Source == "admin"
                        ? "المدرب"
                        : string.Join("، ", s.Trainees.Select(st => st.Trainee!.FullName)),
                }))
                .OrderByDescending(f => f.Day).ThenByDescending(f => f.createdAt)
                .ToList();

            return Results.Ok(files);
        })
        .RequireRateLimiting("submit");

        // ---------- Team texts (audience & goals, team plan, extra work), newest first ----------
        // Only the team-level text answers are shared; personal answers (understanding question etc.) stay private.
        app.MapGet("/api/teams/{teamId:int}/texts", async (int teamId, AppDbContext db) =>
        {
            var submissions = await db.Submissions.AsNoTracking()
                .Include(s => s.Trainees).ThenInclude(st => st.Trainee)
                .Where(s => s.Trainees.Any(st => st.Trainee!.TeamId == teamId))
                .ToListAsync();

            var texts = new List<object>();
            foreach (var s in submissions.OrderByDescending(x => x.Day).ThenByDescending(x => x.CreatedAtUtc))
            {
                var answers = Uploads.ParseAnswers(s.AnswersJson);
                if (s.Day == 1) answers = AnswerFormatter.Prepare(answers);
                foreach (var key in TeamTextKeys)
                {
                    if (!answers.TryGetValue(key, out var value) || string.IsNullOrWhiteSpace(value)) continue;
                    texts.Add(new
                    {
                        s.Day,
                        title = key,
                        text = value,
                        createdAt = Limits.ToAmman(s.CreatedAtUtc),
                        uploadedBy = s.Source == "admin"
                            ? "المدرب"
                            : string.Join("، ", s.Trainees.Select(st => st.Trainee!.FullName)),
                    });
                }
            }
            return Results.Ok(texts);
        })
        .RequireRateLimiting("submit");

        // ---------- Download a team file ----------
        app.MapGet("/api/teams/{teamId:int}/files/{fileId:int}", async (int teamId, int fileId, AppDbContext db) =>
        {
            var file = await db.SubmissionFiles.AsNoTracking()
                .FirstOrDefaultAsync(f => f.Id == fileId
                    && f.Submission!.Trainees.Any(st => st.Trainee!.TeamId == teamId));
            if (file is null) return Results.NotFound();

            var full = Uploads.SafeFullPath(uploadsRoot, file.StoredPath);
            if (full is null || !File.Exists(full)) return Results.NotFound();

            return Results.File(full, file.ContentType, file.OriginalName);
        })
        .RequireRateLimiting("submit");

        app.MapPublicFeedback();
        app.MapPublicContact();
    }
}
