using System.Text.Json;
using System.Text.RegularExpressions;
using CourseSubmissions.Api.Data;

namespace CourseSubmissions.Api;

public static class Limits
{
    public const int MaxFiles = 3;
    public const int MaxFileMb = 50;                                           // Day 3+: whole-site zips
    public const long MaxFileBytes = MaxFileMb * 1024L * 1024;
    public const long MaxRequestBytes = MaxFiles * MaxFileBytes + 5L * 1024 * 1024; // files + form fields
    public const int MaxAnswersChars = 60_000; // plans pasted from the AI can be long

    public static readonly string[] AllowedExtensions = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".webp", ".zip"];

    // Jordan has been on UTC+3 all year since 2022.
    public static DateTime ToAmman(DateTime utc) => utc.AddHours(3);
}

public static class Uploads
{
    public static IResult Error(string message, int status = StatusCodes.Status400BadRequest) =>
        Results.Json(new { error = message }, statusCode: status);

    public static string Clean(string? value) =>
        Regex.Replace(value ?? string.Empty, @"\s+", " ").Trim();

    public static string Truncate(string value, int max) =>
        value.Length <= max ? value : value[..max];

    /// <summary>Keeps letters (Arabic included), digits and dashes, for safe folder/file names.</summary>
    public static string SafeSegment(string value)
    {
        var cleaned = Regex.Replace(value, @"[^\p{L}\p{Nd}]+", "-").Trim('-');
        if (cleaned.Length == 0) cleaned = "x";
        return cleaned.Length <= 40 ? cleaned : cleaned[..40];
    }

    /// <summary>Arabic-tolerant comparison key: أ/إ/آ→ا, ة→ه, ى→ي, single spaces, lower case.</summary>
    public static string Normalize(string value) =>
        string.Join(' ', value.ToLowerInvariant()
            .Replace('أ', 'ا').Replace('إ', 'ا').Replace('آ', 'ا').Replace('ة', 'ه').Replace('ى', 'ي')
            .Split(' ', StringSplitOptions.RemoveEmptyEntries));

    /// <summary>Returns an error message, or null when the answers JSON is a valid object.</summary>
    public static string? ValidateAnswers(string answersJson)
    {
        if (answersJson.Length > Limits.MaxAnswersChars) return "الإجابات طويلة كتير.";
        try
        {
            using var doc = JsonDocument.Parse(answersJson);
            return doc.RootElement.ValueKind == JsonValueKind.Object ? null : "صيغة الإجابات غير صحيحة.";
        }
        catch (JsonException)
        {
            return "صيغة الإجابات غير صحيحة.";
        }
    }

    /// <summary>Returns an error message, or null when all files are acceptable.</summary>
    public static string? ValidateFiles(IReadOnlyList<IFormFile> files)
    {
        if (files.Count > Limits.MaxFiles) return $"الحد الأقصى {Limits.MaxFiles} ملفات.";
        foreach (var f in files)
        {
            var ext = Path.GetExtension(f.FileName).ToLowerInvariant();
            if (!Limits.AllowedExtensions.Contains(ext))
                return $"نوع الملف {f.FileName} غير مسموح. المسموح: PDF، Word، صور، ZIP.";
            if (f.Length > Limits.MaxFileBytes)
                return $"الملف {f.FileName} أكبر من {Limits.MaxFileMb}MB.";
        }
        return null;
    }

    /// <summary>Writes the files to disk and adds their records to the submission. Paths written are added to savedPaths for cleanup on failure.</summary>
    public static async Task SaveFilesAsync(string uploadsRoot, Submission submission, IReadOnlyList<IFormFile> files, List<string> savedPaths)
    {
        var folder = Path.Combine($"day{submission.Day}", $"team-{SafeSegment(submission.TeamNumber)}");
        Directory.CreateDirectory(Path.Combine(uploadsRoot, folder));

        foreach (var f in files)
        {
            var ext = Path.GetExtension(f.FileName).ToLowerInvariant();
            var storedName = $"{DateTime.UtcNow:yyyyMMdd-HHmmss}-{SafeSegment(submission.FullName)}-{Guid.NewGuid().ToString("N")[..8]}{ext}";
            var relative = Path.Combine(folder, storedName);
            var full = Path.Combine(uploadsRoot, relative);

            await using (var stream = File.Create(full))
            {
                await f.CopyToAsync(stream);
            }
            savedPaths.Add(full);

            submission.Files.Add(new SubmissionFile
            {
                FieldName = Truncate(f.Name, 50),
                OriginalName = Truncate(Path.GetFileName(f.FileName), 260),
                StoredPath = relative.Replace('\\', '/'),
                ContentType = Truncate(string.IsNullOrEmpty(f.ContentType) ? "application/octet-stream" : f.ContentType, 150),
                SizeBytes = f.Length,
            });
        }
    }

    public static void DeleteQuietly(IEnumerable<string> paths)
    {
        foreach (var p in paths)
        {
            try { File.Delete(p); } catch { /* ignore */ }
        }
    }

    /// <summary>Prevents "../" tricks: the resolved path must stay inside the uploads folder.</summary>
    public static string? SafeFullPath(string root, string relative)
    {
        var rootFull = Path.GetFullPath(root);
        var full = Path.GetFullPath(Path.Combine(rootFull, relative));
        return full.StartsWith(rootFull, StringComparison.OrdinalIgnoreCase) ? full : null;
    }

    public static string SafeFileName(string value)
    {
        var invalid = Path.GetInvalidFileNameChars().Concat(new[] { '/', '\\' }).ToHashSet();
        var cleaned = new string(value.Select(ch => invalid.Contains(ch) ? '-' : ch).ToArray()).Trim();
        return cleaned.Length == 0 ? "x" : cleaned;
    }

    public static Dictionary<string, string> ParseAnswers(string json)
    {
        var result = new Dictionary<string, string>();
        try
        {
            using var doc = JsonDocument.Parse(json);
            foreach (var p in doc.RootElement.EnumerateObject())
                result[p.Name] = p.Value.ValueKind == JsonValueKind.String ? p.Value.GetString() ?? "" : p.Value.ToString();
        }
        catch (JsonException) { /* keep empty */ }
        return result;
    }
}
