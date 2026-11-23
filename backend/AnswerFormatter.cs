using System.Text.RegularExpressions;

namespace CourseSubmissions.Api;

/// <summary>
/// Day 1: trainees pasted the AI report (audience &amp; goals) into the one-line «أهم شي تعلمته» field,
/// after a separator (--- // \\ ,, --). The one-line input also turned the report's new lines into double spaces.
/// This splits the field into two answers and rebuilds the report's lines. Read-only: the stored data is not changed.
/// </summary>
public static class AnswerFormatter
{
    public const string LearnedKey = "أهم شي تعلمته";
    public const string ReportKey = "الجمهور والأهداف";

    private static readonly string[] Separators = ["---", "//", "\\\\", "\\", ",,", "--"];
    private static readonly Regex ReportStart = new(@"(#+\s*)?\**\s*(1\)|1\.\s|الفئة المستهدفة)", RegexOptions.Compiled);

    public static Dictionary<string, string> Prepare(Dictionary<string, string> answers)
    {
        if (!answers.TryGetValue(LearnedKey, out var raw) || answers.ContainsKey(ReportKey)) return answers;

        var (learned, report) = Split(raw ?? string.Empty);
        if (report.Length == 0 && learned == raw) return answers;

        // Keep the original order, put the report right after «أهم شي تعلمته».
        var result = new Dictionary<string, string>();
        foreach (var pair in answers)
        {
            if (pair.Key == LearnedKey)
            {
                result[LearnedKey] = learned;
                result[ReportKey] = Format(report);
            }
            else
            {
                result[pair.Key] = pair.Value;
            }
        }
        return result;
    }

    public static (string Learned, string Report) Split(string text)
    {
        var t = text.Trim();
        int? cutStart = null, cutEnd = null;

        foreach (var sep in Separators)
        {
            var i = t.IndexOf(sep, StringComparison.Ordinal);
            if (i >= 0 && (cutStart is null || i < cutStart))
            {
                cutStart = i;
                cutEnd = i + sep.Length;
            }
        }

        // No separator, but the text starts (almost) with the report itself.
        var m = ReportStart.Match(t);
        if (m.Success && m.Index <= 150 && (cutStart is null || m.Index < cutStart))
        {
            cutStart = m.Index;
            cutEnd = m.Index;
        }

        if (cutStart is null) return (t, string.Empty);

        var learned = t[..cutStart.Value].Trim(' ', '-', '/', '\\', ',');
        var report = t[cutEnd!.Value..].Trim();
        if (!Regex.IsMatch(report, @"\w")) report = string.Empty;
        return (learned, report);
    }

    public static string Format(string report)
    {
        if (string.IsNullOrWhiteSpace(report)) return string.Empty;
        var r = report;

        r = Regex.Replace(r, @"!?\[([^\]]*)\]\((https?://[^)]*)\)", "$1");                 // [text](url) -> text
        r = Regex.Replace(r, @"https?://\S+", "");
        r = r.Replace("**", "");
        r = Regex.Replace(r, @" {2,}", "\n");                                                // pasted new lines
        r = Regex.Replace(r, @"\s*-{3,}\s*", "\n");
        r = Regex.Replace(r, @"\s*#{1,6}\s*", "\n\n");                                       // markdown headings
        r = Regex.Replace(r, @"\s+(?=[1-9]\)\s)", "\n\n");                                   // 1) 2) 3)
        r = Regex.Replace(r, @"(?<=\S)\s+(?=[1-9]\.\s)", "\n");                              // 1. 2. 3.
        r = Regex.Replace(r, @"\s+\*\s+", "\n• ");
        r = Regex.Replace(r, @"^\*\s+", "• ");
        r = Regex.Replace(r, @"(?<!•)\s+(?=(الفئة المستهدفة|سبب الزيارة|سبب زيارة الموقع|لماذا تزور الموقع)\s*:)", "\n");
        r = Regex.Replace(r,
            @"^([1-9]\)\s*(الفئة المستهدفة وليش بتزور الموقع|أهداف الموقع|الإجراء الرئيسي اللي بدنا الزائر يعمله)(\s*\([^)\n]*\))?)[ \t]+(?=\S)",
            "$1\n", RegexOptions.Multiline);                                                 // section title on its own line
        r = Regex.Replace(r, @"(?<=[^\d\s]\.)[ \t]+(?=[^.:\n]{3,60}:\s)", "\n");             // "goal: ..." one per line
        r = Regex.Replace(r, @"\n•\s*\n", "\n");

        // Drop short AI chit-chat before section 1).
        var first = Regex.Match(r, @"^[1-9]\)", RegexOptions.Multiline);
        if (first.Success && first.Index > 0 && first.Index < 500) r = r[first.Index..];

        var lines = r.Split('\n').Select(l => l.TrimEnd()).Where(l => l.Trim().Length == 0 || Regex.IsMatch(l, @"\w"));
        r = string.Join("\n", lines);
        r = Regex.Replace(r, @"\n{3,}", "\n\n");
        return r.Trim();
    }
}
