namespace CourseSubmissions.Api.Data;

public class Submission
{
    public int Id { get; set; }

    /// <summary>Course day (1-5).</summary>
    public int Day { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string TeamNumber { get; set; } = string.Empty;

    /// <summary>The day's answers as JSON. Questions are defined by the frontend, so each day can differ without schema changes.</summary>
    public string AnswersJson { get; set; } = "{}";

    public DateTime CreatedAtUtc { get; set; }

    /// <summary>"form" = sent by a trainee, "admin" = uploaded by the trainer.</summary>
    public string Source { get; set; } = "form";

    public List<SubmissionFile> Files { get; set; } = new();

    public List<SubmissionTrainee> Trainees { get; set; } = new();

    /// <summary>Last edit by the trainer (null = never edited).</summary>
    public DateTime? UpdatedAtUtc { get; set; }

    /// <summary>Soft delete: hidden everywhere, restorable from the admin trash.</summary>
    public bool IsDeleted { get; set; }

    public DateTime? DeletedAtUtc { get; set; }

    /// <summary>Set when this submission was merged into another one.</summary>
    public int? MergedIntoId { get; set; }
}

public class SubmissionFile
{
    public int Id { get; set; }

    public int SubmissionId { get; set; }

    public Submission? Submission { get; set; }

    /// <summary>The form field the file came from (e.g. "requirementsDoc").</summary>
    public string FieldName { get; set; } = string.Empty;

    public string OriginalName { get; set; } = string.Empty;

    /// <summary>Path relative to the uploads root, e.g. day1/team-3/20261123-101500-ab12cd.pdf</summary>
    public string StoredPath { get; set; } = string.Empty;

    public string ContentType { get; set; } = string.Empty;

    public long SizeBytes { get; set; }

    /// <summary>Soft delete: hidden everywhere, restorable from the admin trash.</summary>
    public bool IsDeleted { get; set; }

    public DateTime? DeletedAtUtc { get; set; }
}

public class Team
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    /// <summary>The team's published site (Netlify), filled by the trainer on Day 5. Null = «قريباً».</summary>
    public string? ProjectUrl { get; set; }

    public List<Trainee> Trainees { get; set; } = new();
}

public class Trainee
{
    public int Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public int TeamId { get; set; }

    public Team? Team { get; set; }

    /// <summary>Inactive trainees are hidden from the submit form but keep their history.</summary>
    public bool IsActive { get; set; } = true;

    /// <summary>Short code (4 digits) the trainee uses to see their personal feedback. Not a password: just keeps classmates out.</summary>
    public string? AccessCode { get; set; }
}

/// <summary>Links a submission to one or more trainees (old Day 1 submissions were sent once for a whole team).</summary>
public class SubmissionTrainee
{
    public int SubmissionId { get; set; }

    public Submission? Submission { get; set; }

    public int TraineeId { get; set; }

    public Trainee? Trainee { get; set; }
}

/// <summary>Daily evaluation of a trainee (score out of 10 + note).</summary>
public class Evaluation
{
    public int Id { get; set; }

    public int TraineeId { get; set; }

    public Trainee? Trainee { get; set; }

    public int Day { get; set; }

    public decimal? Score { get; set; }

    public string? Note { get; set; }
}

/// <summary>Trainer feedback on a submission, for the whole team or for one trainee.</summary>
public class Feedback
{
    public int Id { get; set; }

    public int SubmissionId { get; set; }

    public Submission? Submission { get; set; }

    /// <summary>"team" or "trainee".</summary>
    public string Scope { get; set; } = "team";

    /// <summary>Set when Scope = "team".</summary>
    public int? TeamId { get; set; }

    public Team? Team { get; set; }

    /// <summary>Set when Scope = "trainee".</summary>
    public int? TraineeId { get; set; }

    public Trainee? Trainee { get; set; }

    /// <summary>"good" (ممتاز), "improve" (تحسين) or "fix" (مطلوب تصليح).</summary>
    public string Kind { get; set; } = "improve";

    public string Text { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; }

    /// <summary>First time the team/trainee opened it.</summary>
    public DateTime? SeenAtUtc { get; set; }

    /// <summary>When the trainee/team pressed «تم التعديل».</summary>
    public DateTime? ResolvedAtUtc { get; set; }

    public string? ResolvedBy { get; set; }
}

/// <summary>A message from the course website's contact page.</summary>
public class ContactMessage
{
    public int Id { get; set; }

    /// <summary>null when sent anonymously.</summary>
    public string? Name { get; set; }

    public string? Phone { get; set; }

    public string? TeamName { get; set; }

    /// <summary>"question", "absence", "feedback" or "other".</summary>
    public string Kind { get; set; } = "other";

    public string Message { get; set; } = string.Empty;

    public bool IsAnonymous { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    /// <summary>"new" or "replied".</summary>
    public string Status { get; set; } = "new";

    /// <summary>Trainer's private note.</summary>
    public string? AdminNote { get; set; }
}

/// <summary>A card on the resources page («ملفات الدورة») that the trainer has opened. No row = still locked.</summary>
public class ContentUnlock
{
    public string Key { get; set; } = string.Empty;

    public DateTime UnlockedAtUtc { get; set; }
}

/// <summary>A trainee's Day 1 profile card, pasted by the trainer as HTML and shown as-is on the projects page.</summary>
public class TraineeCard
{
    public int TraineeId { get; set; }

    public Trainee? Trainee { get; set; }

    public string Html { get; set; } = string.Empty;

    /// <summary>Hidden cards stay saved but are not shown on the public site.</summary>
    public bool IsHidden { get; set; }

    public DateTime UpdatedAtUtc { get; set; }
}
