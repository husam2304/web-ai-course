using System.IO.Compression;
using System.Security.Cryptography;
using System.Text;
using ClosedXML.Excel;
using CourseSubmissions.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace CourseSubmissions.Api;

public record TeamInput(string Name, int? SortOrder);
public record TraineeInput(string FullName, int TeamId, bool? IsActive);
public record BulkTraineesInput(int TeamId, string Names);
public record LinkInput(List<int> TraineeIds);
public record EvaluationInput(int TraineeId, int Day, decimal? Score, string? Note);

/// <summary>Trainer endpoints, protected by a shared key sent in the X-Admin-Key header.</summary>
public static class AdminEndpoints
{
    private const string KeyHeader = "X-Admin-Key";

    public static void MapAdmin(this WebApplication app, string uploadsRoot)
    {
        var adminKey = app.Configuration["Admin:Key"] ?? string.Empty;

        var admin = app.MapGroup("/api/admin")
            .AddEndpointFilter(async (ctx, next) =>
            {
                var sent = ctx.HttpContext.Request.Headers[KeyHeader].ToString();
                if (adminKey.Length < 12 || adminKey.StartsWith("CHANGE-ME") || !KeysMatch(sent, adminKey))
                    return Results.Json(new { error = "مفتاح الأدمن غلط." }, statusCode: StatusCodes.Status401Unauthorized);
                return await next(ctx);
            });

        admin.MapAdminFeedback();
        admin.MapAdminContact();
        admin.MapAdminEdit(uploadsRoot);

        // ================= Summary =================
        admin.MapGet("/summary", async (AppDbContext db) =>
        {
            var perDay = await db.Submissions
                .GroupBy(s => s.Day)
                .Select(g => new { day = g.Key, count = g.Count() })
                .OrderBy(x => x.day)
                .ToListAsync();
            return Results.Ok(perDay);
        });

        // ================= Teams =================
        admin.MapGet("/teams", async (AppDbContext db) =>
        {
            await FeedbackEndpoints.EnsureCodesAsync(db);
            var teams = await db.Teams.AsNoTracking()
                .OrderBy(t => t.SortOrder).ThenBy(t => t.Name)
                .Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.SortOrder,
                    trainees = t.Trainees.OrderBy(x => x.FullName)
                        .Select(x => new { x.Id, x.FullName, x.IsActive, code = x.AccessCode }).ToList(),
                })
                .ToListAsync();
            return Results.Ok(teams);
        });

        admin.MapPost("/teams", async (TeamInput input, AppDbContext db) =>
        {
            var name = Uploads.Clean(input.Name);
            if (name.Length is < 1 or > 100) return Uploads.Error("اكتب اسم الفريق.");
            var team = new Team { Name = name, SortOrder = input.SortOrder ?? (await db.Teams.CountAsync() + 1) };
            db.Teams.Add(team);
            await db.SaveChangesAsync();
            return Results.Ok(new { team.Id });
        });

        admin.MapPut("/teams/{id:int}", async (int id, TeamInput input, AppDbContext db) =>
        {
            var team = await db.Teams.FindAsync(id);
            if (team is null) return Results.NotFound();
            var name = Uploads.Clean(input.Name);
            if (name.Length is < 1 or > 100) return Uploads.Error("اكتب اسم الفريق.");
            team.Name = name;
            if (input.SortOrder is not null) team.SortOrder = input.SortOrder.Value;
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        admin.MapDelete("/teams/{id:int}", async (int id, AppDbContext db) =>
        {
            var team = await db.Teams.Include(t => t.Trainees).FirstOrDefaultAsync(t => t.Id == id);
            if (team is null) return Results.NotFound();
            if (team.Trainees.Count > 0) return Uploads.Error("انقل أو احذف المتدربين أول.");
            db.Teams.Remove(team);
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        // ================= Trainees =================
        admin.MapPost("/trainees", async (TraineeInput input, AppDbContext db) =>
        {
            var name = Uploads.Clean(input.FullName);
            if (name.Length is < 2 or > 150) return Uploads.Error("اكتب الاسم.");
            if (!await db.Teams.AnyAsync(t => t.Id == input.TeamId)) return Uploads.Error("الفريق مش موجود.");
            var trainee = new Trainee { FullName = name, TeamId = input.TeamId, IsActive = input.IsActive ?? true, AccessCode = FeedbackEndpoints.NewCode() };
            db.Trainees.Add(trainee);
            await db.SaveChangesAsync();
            return Results.Ok(new { trainee.Id });
        });

        admin.MapPost("/trainees/bulk", async (BulkTraineesInput input, AppDbContext db) =>
        {
            if (!await db.Teams.AnyAsync(t => t.Id == input.TeamId)) return Uploads.Error("الفريق مش موجود.");
            var names = (input.Names ?? "")
                .Split(['\n', '\r', ',', '،'], StringSplitOptions.RemoveEmptyEntries)
                .Select(Uploads.Clean)
                .Where(n => n.Length is >= 2 and <= 150)
                .Distinct()
                .ToList();
            foreach (var n in names)
                db.Trainees.Add(new Trainee { FullName = n, TeamId = input.TeamId, IsActive = true, AccessCode = FeedbackEndpoints.NewCode() });
            await db.SaveChangesAsync();
            return Results.Ok(new { added = names.Count });
        });

        admin.MapPut("/trainees/{id:int}", async (int id, TraineeInput input, AppDbContext db) =>
        {
            var trainee = await db.Trainees.FindAsync(id);
            if (trainee is null) return Results.NotFound();
            var name = Uploads.Clean(input.FullName);
            if (name.Length is < 2 or > 150) return Uploads.Error("اكتب الاسم.");
            if (!await db.Teams.AnyAsync(t => t.Id == input.TeamId)) return Uploads.Error("الفريق مش موجود.");
            trainee.FullName = name;
            trainee.TeamId = input.TeamId;
            if (input.IsActive is not null) trainee.IsActive = input.IsActive.Value;
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        admin.MapDelete("/trainees/{id:int}", async (int id, AppDbContext db) =>
        {
            var trainee = await db.Trainees.FindAsync(id);
            if (trainee is null) return Results.NotFound();
            // Includes submissions in the trash (they still point at the trainee).
            var hasHistory = await db.SubmissionTrainees.IgnoreQueryFilters().AnyAsync(x => x.TraineeId == id)
                || await db.Evaluations.AnyAsync(x => x.TraineeId == id)
                || await db.Feedback.IgnoreQueryFilters().AnyAsync(x => x.TraineeId == id);
            if (hasHistory)
            {
                // Keep the history: hide from the form instead of deleting.
                trainee.IsActive = false;
                await db.SaveChangesAsync();
                return Results.Ok(new { deactivated = true });
            }
            db.Trainees.Remove(trainee);
            await db.SaveChangesAsync();
            return Results.Ok(new { deleted = true });
        });

        // ================= Submissions =================
        admin.MapGet("/submissions", async (int day, AppDbContext db) =>
        {
            var rows = await LoadDay(db, day);
            var ids = rows.Select(r => r.Id).ToList();
            var feedback = (await db.Feedback.AsNoTracking().Include(f => f.Trainee)
                    .Where(f => ids.Contains(f.SubmissionId)).OrderBy(f => f.CreatedAtUtc).ToListAsync())
                .ToLookup(f => f.SubmissionId);
            return Results.Ok(rows.Select(s => new
            {
                s.Id,
                s.Day,
                s.FullName,
                s.TeamNumber,
                s.Source,
                createdAt = Limits.ToAmman(s.CreatedAtUtc),
                updatedAt = s.UpdatedAtUtc is null ? (DateTime?)null : Limits.ToAmman(s.UpdatedAtUtc.Value),
                answers = s.Day == 1 ? AnswerFormatter.Prepare(Uploads.ParseAnswers(s.AnswersJson)) : Uploads.ParseAnswers(s.AnswersJson), // Day 1 only: report pasted into «أهم شي تعلمته»
                files = s.Files.Select(f => new { f.Id, f.FieldName, f.OriginalName, f.SizeBytes }),
                trainees = s.Trainees.Select(st => new { id = st.TraineeId, fullName = st.Trainee!.FullName, teamName = st.Trainee.Team!.Name }),
                feedback = feedback[s.Id].Select(FeedbackEndpoints.ToAdmin),
            }));
        });

        // Link a submission to the right trainee(s) (fixes wrong names / team submissions).
        admin.MapPut("/submissions/{id:int}/trainees", async (int id, LinkInput input, AppDbContext db) =>
        {
            var submission = await db.Submissions.Include(s => s.Trainees).FirstOrDefaultAsync(s => s.Id == id);
            if (submission is null) return Results.NotFound();
            var ids = (input.TraineeIds ?? new List<int>()).Distinct().ToList();
            var valid = await db.Trainees.Where(t => ids.Contains(t.Id)).Select(t => t.Id).ToListAsync();
            // Diff instead of clear+re-add (avoids EF tracking the same composite key twice).
            submission.Trainees.RemoveAll(st => !valid.Contains(st.TraineeId));
            foreach (var tid in valid.Where(tid => submission.Trainees.All(st => st.TraineeId != tid)))
                submission.Trainees.Add(new SubmissionTrainee { SubmissionId = id, TraineeId = tid });
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        // Moves the submission to the trash (restorable). Permanent delete is in AdminEditEndpoints.
        admin.MapDelete("/submissions/{id:int}", async (int id, AppDbContext db) =>
        {
            var submission = await db.Submissions.FirstOrDefaultAsync(s => s.Id == id);
            if (submission is null) return Results.NotFound();
            submission.IsDeleted = true;
            submission.DeletedAtUtc = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        // Trainer uploads files for trainee(s) (e.g. sent on WhatsApp).
        admin.MapPost("/submissions", async (HttpRequest request, AppDbContext db, ILoggerFactory loggerFactory) =>
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

            if (!int.TryParse(form["day"].ToString(), out var day) || day is < 1 or > 5)
                return Uploads.Error("رقم اليوم غير صحيح.");

            var ids = form["traineeIds"].ToString()
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(x => int.TryParse(x, out var v) ? v : 0)
                .Where(v => v > 0)
                .Distinct()
                .ToList();
            var trainees = await db.Trainees.Include(t => t.Team).Where(t => ids.Contains(t.Id)).ToListAsync();
            if (trainees.Count == 0) return Uploads.Error("اختار متدرب واحد على الأقل.");

            var files = form.Files.Where(f => f.Length > 0).ToList();
            if (files.Count == 0) return Uploads.Error("اختار ملف.");
            var filesError = Uploads.ValidateFiles(files);
            if (filesError is not null) return Uploads.Error(filesError);

            var note = Uploads.Clean(form["note"].ToString());
            var answers = note.Length > 0
                ? System.Text.Json.JsonSerializer.Serialize(new Dictionary<string, string> { ["ملاحظة المدرب"] = note })
                : "{}";

            var submission = new Submission
            {
                Day = day,
                FullName = Uploads.Truncate(string.Join("، ", trainees.Select(t => t.FullName)), 150),
                TeamNumber = Uploads.Truncate(trainees[0].Team!.Name, 20),
                AnswersJson = answers,
                CreatedAtUtc = DateTime.UtcNow,
                Source = "admin",
            };
            foreach (var t in trainees)
                submission.Trainees.Add(new SubmissionTrainee { TraineeId = t.Id });

            var savedPaths = new List<string>();
            try
            {
                await Uploads.SaveFilesAsync(uploadsRoot, submission, files, savedPaths);
                db.Submissions.Add(submission);
                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                loggerFactory.CreateLogger("Admin").LogError(ex, "Admin upload failed");
                Uploads.DeleteQuietly(savedPaths);
                return Uploads.Error("صار خطأ بالسيرفر.", StatusCodes.Status500InternalServerError);
            }
            return Results.Ok(new { id = submission.Id });
        });

        // Link old submissions (typed names) to trainees by name. Returns a report to review.
        admin.MapPost("/auto-link", async (AppDbContext db) =>
        {
            var trainees = await db.Trainees.Include(t => t.Team).ToListAsync();
            var unlinked = await db.Submissions.Include(s => s.Trainees)
                .Where(s => !s.Trainees.Any())
                .OrderBy(s => s.Id)
                .ToListAsync();

            var report = new List<object>();
            foreach (var s in unlinked)
            {
                var matches = AutoLink.Match(s.FullName, s.TeamNumber, trainees);
                foreach (var t in matches)
                    s.Trainees.Add(new SubmissionTrainee { SubmissionId = s.Id, TraineeId = t.Id });
                report.Add(new
                {
                    s.Id,
                    s.Day,
                    s.FullName,
                    s.TeamNumber,
                    linked = matches.Select(t => $"{t.FullName} ({t.Team!.Name})").ToList(),
                });
            }
            await db.SaveChangesAsync();
            return Results.Ok(report);
        });

        // ================= Roster + evaluations =================
        admin.MapGet("/roster", async (int day, AppDbContext db) =>
        {
            var teams = await db.Teams.AsNoTracking().Include(t => t.Trainees)
                .OrderBy(t => t.SortOrder).ThenBy(t => t.Name).ToListAsync();
            var links = await db.SubmissionTrainees.AsNoTracking()
                .Where(x => x.Submission!.Day == day)
                .Select(x => new { x.TraineeId, x.SubmissionId })
                .ToListAsync();
            var evals = await db.Evaluations.AsNoTracking().Where(e => e.Day == day).ToListAsync();

            return Results.Ok(teams.Select(t => new
            {
                t.Id,
                t.Name,
                trainees = t.Trainees.OrderBy(x => x.FullName).Select(x => new
                {
                    x.Id,
                    x.FullName,
                    x.IsActive,
                    submissions = links.Where(l => l.TraineeId == x.Id).Select(l => l.SubmissionId).OrderBy(v => v).ToList(),
                    score = evals.FirstOrDefault(e => e.TraineeId == x.Id)?.Score,
                    note = evals.FirstOrDefault(e => e.TraineeId == x.Id)?.Note,
                }),
            }));
        });

        admin.MapPut("/evaluations", async (EvaluationInput input, AppDbContext db) =>
        {
            if (input.Day is < 1 or > 5) return Uploads.Error("رقم اليوم غير صحيح.");
            if (input.Score is < 0 or > 10) return Uploads.Error("العلامة من 0 لـ 10.");
            if (!await db.Trainees.AnyAsync(t => t.Id == input.TraineeId)) return Results.NotFound();

            var note = string.IsNullOrWhiteSpace(input.Note) ? null : Uploads.Truncate(input.Note.Trim(), 1000);
            var eval = await db.Evaluations.FirstOrDefaultAsync(e => e.TraineeId == input.TraineeId && e.Day == input.Day);
            if (eval is null)
            {
                eval = new Evaluation { TraineeId = input.TraineeId, Day = input.Day };
                db.Evaluations.Add(eval);
            }
            eval.Score = input.Score;
            eval.Note = note;
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        // ================= Files =================
        admin.MapGet("/files/{id:int}", async (int id, AppDbContext db) =>
        {
            var file = await db.SubmissionFiles.Include(f => f.Submission).FirstOrDefaultAsync(f => f.Id == id);
            if (file is null) return Results.NotFound();

            var full = Uploads.SafeFullPath(uploadsRoot, file.StoredPath);
            if (full is null || !File.Exists(full)) return Results.NotFound();

            var downloadName = $"{file.Submission!.TeamNumber}-{file.Submission.FullName}-{file.OriginalName}";
            return Results.File(full, file.ContentType, Uploads.SafeFileName(downloadName));
        });

        // Delete one file only (e.g. a random image uploaded just because the field was required). The answers stay.
        admin.MapDelete("/files/{id:int}", async (int id, AppDbContext db) =>
        {
            var file = await db.SubmissionFiles.FirstOrDefaultAsync(f => f.Id == id);
            if (file is null) return Results.NotFound();
            file.IsDeleted = true; // trash, restorable
            file.DeletedAtUtc = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        admin.MapGet("/files-zip", async (int day, AppDbContext db) =>
        {
            var rows = await LoadDay(db, day);
            var stream = new MemoryStream();
            using (var zip = new ZipArchive(stream, ZipArchiveMode.Create, leaveOpen: true))
            {
                foreach (var s in rows)
                {
                    var team = s.Trainees.Count > 0 ? s.Trainees[0].Trainee!.Team!.Name : s.TeamNumber;
                    foreach (var f in s.Files)
                    {
                        var full = Uploads.SafeFullPath(uploadsRoot, f.StoredPath);
                        if (full is null || !File.Exists(full)) continue;
                        var entryName = $"{Uploads.SafeFileName(team)}/{s.Id}-{Uploads.SafeFileName(WhoLabel(s))}-{Uploads.SafeFileName(f.OriginalName)}";
                        zip.CreateEntryFromFile(full, entryName, CompressionLevel.Fastest);
                    }
                }
            }
            stream.Position = 0;
            return Results.File(stream, "application/zip", $"files-day{day}.zip");
        });

        // ================= Excel =================
        admin.MapGet("/export", async (int? day, AppDbContext db) =>
        {
            var query = db.Submissions.AsNoTracking()
                .Include(s => s.Files)
                .Include(s => s.Trainees).ThenInclude(st => st.Trainee).ThenInclude(t => t!.Team)
                .AsQueryable();
            if (day is not null) query = query.Where(s => s.Day == day);
            var rows = await query.OrderBy(s => s.Day).ThenBy(s => s.CreatedAtUtc).ToListAsync();

            var teams = await db.Teams.AsNoTracking().Include(t => t.Trainees)
                .OrderBy(t => t.SortOrder).ThenBy(t => t.Name).ToListAsync();
            var evals = await db.Evaluations.AsNoTracking().ToListAsync();
            var links = await db.SubmissionTrainees.AsNoTracking()
                .Select(x => new { x.TraineeId, x.Submission!.Day }).ToListAsync();

            using var workbook = new XLWorkbook();

            // ----- Sheet 1: evaluation grid (one row per trainee) -----
            var grid = workbook.Worksheets.Add("التقييم");
            grid.RightToLeft = true;
            var gridHeaders = new List<string> { "الفريق", "المتدرب", "نشط؟" };
            for (var d = 1; d <= 5; d++)
            {
                gridHeaders.Add($"يوم {d}: سلّم؟");
                gridHeaders.Add($"يوم {d}: العلامة");
                gridHeaders.Add($"يوم {d}: ملاحظة");
            }
            gridHeaders.Add("المجموع");
            for (var c = 0; c < gridHeaders.Count; c++) grid.Cell(1, c + 1).Value = gridHeaders[c];

            var gr = 2;
            foreach (var t in teams)
            {
                foreach (var tr in t.Trainees.OrderBy(x => x.FullName))
                {
                    var col = 1;
                    grid.Cell(gr, col++).Value = t.Name;
                    grid.Cell(gr, col++).Value = tr.FullName;
                    grid.Cell(gr, col++).Value = tr.IsActive ? "نعم" : "لا";
                    decimal total = 0;
                    for (var d = 1; d <= 5; d++)
                    {
                        var submitted = links.Any(l => l.TraineeId == tr.Id && l.Day == d);
                        var ev = evals.FirstOrDefault(e => e.TraineeId == tr.Id && e.Day == d);
                        grid.Cell(gr, col++).Value = submitted ? "✓" : "";
                        if (ev?.Score is not null)
                        {
                            grid.Cell(gr, col).Value = ev.Score.Value;
                            total += ev.Score.Value;
                        }
                        col++;
                        grid.Cell(gr, col++).Value = ev?.Note ?? "";
                    }
                    grid.Cell(gr, col).Value = total;
                    gr++;
                }
            }
            StyleSheet(grid, gridHeaders.Count, gr - 1);

            // ----- One sheet per day: submissions -----
            var days = day is not null ? new List<int> { day.Value } : rows.Select(r => r.Day).Distinct().OrderBy(d => d).ToList();
            foreach (var d in days)
            {
                var dayRows = rows.Where(r => r.Day == d).ToList();
                var parsed = dayRows.Select(r => d == 1 ? AnswerFormatter.Prepare(Uploads.ParseAnswers(r.AnswersJson)) : Uploads.ParseAnswers(r.AnswersJson)).ToList();
                var answerKeys = new List<string>();
                foreach (var dict in parsed)
                    foreach (var k in dict.Keys)
                        if (!answerKeys.Contains(k)) answerKeys.Add(k);

                var sheet = workbook.Worksheets.Add($"تسليمات يوم {d}");
                sheet.RightToLeft = true;
                var headers = new List<string> { "رقم التسليم", "المتدرب (المربوط)", "الفريق", "الاسم المكتوب", "المصدر", "وقت التسليم" };
                headers.AddRange(answerKeys);
                headers.Add("الملفات");
                for (var c = 0; c < headers.Count; c++) sheet.Cell(1, c + 1).Value = headers[c];

                for (var i = 0; i < dayRows.Count; i++)
                {
                    var r = dayRows[i];
                    var row = i + 2;
                    var col = 1;
                    sheet.Cell(row, col++).Value = r.Id;
                    sheet.Cell(row, col++).Value = r.Trainees.Count > 0 ? string.Join("، ", r.Trainees.Select(x => x.Trainee!.FullName)) : "⚠️ غير مربوط";
                    sheet.Cell(row, col++).Value = r.Trainees.Count > 0 ? r.Trainees[0].Trainee!.Team!.Name : r.TeamNumber;
                    sheet.Cell(row, col++).Value = r.FullName;
                    sheet.Cell(row, col++).Value = r.Source == "admin" ? "المدرب" : "النموذج";
                    sheet.Cell(row, col).Value = Limits.ToAmman(r.CreatedAtUtc);
                    sheet.Cell(row, col++).Style.DateFormat.Format = "yyyy-mm-dd hh:mm";
                    foreach (var key in answerKeys)
                        sheet.Cell(row, col++).Value = parsed[i].TryGetValue(key, out var v) ? v : "";
                    sheet.Cell(row, col).Value = string.Join("\n", r.Files.Select(f => f.OriginalName));
                }
                StyleSheet(sheet, headers.Count, dayRows.Count + 1);
            }

            // ----- Feedback sheet -----
            var fbQuery = db.Feedback.AsNoTracking()
                .Include(f => f.Submission)
                .Include(f => f.Team)
                .Include(f => f.Trainee).ThenInclude(t => t!.Team)
                .AsQueryable();
            if (day is not null) fbQuery = fbQuery.Where(f => f.Submission!.Day == day);
            var fbRows = await fbQuery.OrderBy(f => f.Submission!.Day).ThenBy(f => f.CreatedAtUtc).ToListAsync();
            var fb = workbook.Worksheets.Add("الملاحظات");
            fb.RightToLeft = true;
            var fbHeaders = new[] { "اليوم", "الفريق", "لمين", "رقم التسليم", "النوع", "الملاحظة", "وقت الملاحظة", "انشافت؟", "تم التعديل؟", "مين أكّد التعديل" };
            for (var c = 0; c < fbHeaders.Length; c++) fb.Cell(1, c + 1).Value = fbHeaders[c];
            for (var i = 0; i < fbRows.Count; i++)
            {
                var fbi = fbRows[i];
                var row = i + 2;
                var col = 1;
                fb.Cell(row, col++).Value = fbi.Submission!.Day;
                fb.Cell(row, col++).Value = fbi.Scope == "team" ? fbi.Team?.Name ?? "" : fbi.Trainee?.Team?.Name ?? "";
                fb.Cell(row, col++).Value = fbi.Scope == "team" ? "الفريق كله" : fbi.Trainee?.FullName ?? "";
                fb.Cell(row, col++).Value = fbi.SubmissionId;
                var kindCell = fb.Cell(row, col++);
                kindCell.Value = fbi.Kind switch { "good" => "ممتاز", "fix" => "مطلوب تصليح", _ => "تحسين" };
                kindCell.Style.Fill.BackgroundColor = XLColor.FromHtml(fbi.Kind switch { "good" => "#D8F0E4", "fix" => "#FBE0DD", _ => "#FDEBD3" });
                fb.Cell(row, col++).Value = fbi.Text;
                fb.Cell(row, col).Value = Limits.ToAmman(fbi.CreatedAtUtc);
                fb.Cell(row, col++).Style.DateFormat.Format = "yyyy-mm-dd hh:mm";
                fb.Cell(row, col++).Value = fbi.SeenAtUtc is null ? "لا" : "نعم";
                fb.Cell(row, col++).Value = fbi.ResolvedAtUtc is null ? "لا" : "نعم";
                fb.Cell(row, col).Value = fbi.ResolvedBy ?? "";
            }
            StyleSheet(fb, fbHeaders.Length, fbRows.Count + 1);

            var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Position = 0;
            var name = day is not null ? $"course-day{day}.xlsx" : "course-all.xlsx";
            return Results.File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", name);
        });
    }

    private static void StyleSheet(IXLWorksheet sheet, int columns, int lastRow)
    {
        var header = sheet.Range(1, 1, 1, columns);
        header.Style.Font.Bold = true;
        header.Style.Font.FontColor = XLColor.White;
        header.Style.Fill.BackgroundColor = XLColor.FromHtml("#13293D");
        sheet.SheetView.FreezeRows(1);
        sheet.Columns(1, columns).AdjustToContents(1, Math.Max(1, lastRow), 8, 60);
        sheet.Rows().Style.Alignment.WrapText = true;
        sheet.Rows().Style.Alignment.Vertical = XLAlignmentVerticalValues.Top;
        if (lastRow > 1) sheet.Range(1, 1, lastRow, columns).SetAutoFilter();
    }

    private static string WhoLabel(Submission s) =>
        s.Trainees.Count > 0 ? string.Join("-", s.Trainees.Select(x => x.Trainee!.FullName)) : s.FullName;

    private static Task<List<Submission>> LoadDay(AppDbContext db, int day) =>
        db.Submissions
            .Include(s => s.Files)
            .Include(s => s.Trainees).ThenInclude(st => st.Trainee).ThenInclude(t => t!.Team)
            .AsNoTracking()
            .Where(s => s.Day == day)
            .OrderBy(s => s.CreatedAtUtc)
            .ToListAsync();

    private static bool KeysMatch(string sent, string expected) =>
        CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(sent), Encoding.UTF8.GetBytes(expected));
}

/// <summary>Matches a typed name (possibly several names in one field) to registered trainees.</summary>
public static class AutoLink
{
    private static readonly char[] Separators = [' ', '-', '_', ',', '،', '/', '\\', '+', '&'];

    private static List<string> Tokens(string value) =>
        Uploads.Normalize(value)
            .Split(Separators, StringSplitOptions.RemoveEmptyEntries)
            .Where(t => t != "و" && t != "and")
            .ToList();

    public static List<Trainee> Match(string typedName, string typedTeam, List<Trainee> trainees)
    {
        var typed = Tokens(typedName);
        if (typed.Count == 0) return new List<Trainee>();
        var typedTeamNorm = Uploads.Normalize(typedTeam);

        // Candidate = trainee whose first name appears as a whole word. Score = how many of its name words appear.
        var candidates = trainees
            .Select(t => new { Trainee = t, Words = Tokens(t.FullName) })
            .Where(x => x.Words.Count > 0 && typed.Contains(x.Words[0]))
            .Select(x => new
            {
                x.Trainee,
                First = x.Words[0],
                Score = x.Words.Count(w => typed.Contains(w)),
                TeamMatch = TeamMatches(typedTeamNorm, Uploads.Normalize(x.Trainee.Team?.Name ?? "")),
            })
            .ToList();

        var result = new List<Trainee>();
        foreach (var group in candidates.GroupBy(c => c.First))
        {
            var best = group.Max(c => c.Score);
            var top = group.Where(c => c.Score == best).ToList();
            if (top.Count > 1) top = top.Where(c => c.TeamMatch).ToList();
            if (top.Count == 1) result.Add(top[0].Trainee);
            // still ambiguous → leave for manual linking
        }
        return result;
    }

    private static bool TeamMatches(string typed, string actual) =>
        typed.Length > 0 && actual.Length > 0 && (typed == actual || actual.Contains(typed) || typed.Contains(actual));
}
