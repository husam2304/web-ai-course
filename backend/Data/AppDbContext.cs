using Microsoft.EntityFrameworkCore;

namespace CourseSubmissions.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Submission> Submissions => Set<Submission>();

    public DbSet<SubmissionFile> SubmissionFiles => Set<SubmissionFile>();

    public DbSet<Team> Teams => Set<Team>();

    public DbSet<Trainee> Trainees => Set<Trainee>();

    public DbSet<SubmissionTrainee> SubmissionTrainees => Set<SubmissionTrainee>();

    public DbSet<Evaluation> Evaluations => Set<Evaluation>();

    public DbSet<Feedback> Feedback => Set<Feedback>();

    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Submission>(e =>
        {
            e.ToTable("Submissions");
            e.Property(s => s.FullName).HasMaxLength(150).IsRequired();
            e.Property(s => s.TeamNumber).HasMaxLength(20).IsRequired();
            e.Property(s => s.AnswersJson).IsRequired();
            e.Property(s => s.Source).HasMaxLength(20).IsRequired().HasDefaultValue("form");
            e.HasIndex(s => new { s.Day, s.TeamNumber });
            e.HasQueryFilter(s => !s.IsDeleted); // trash: use IgnoreQueryFilters()
            e.HasMany(s => s.Files)
                .WithOne(f => f.Submission)
                .HasForeignKey(f => f.SubmissionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SubmissionFile>(e =>
        {
            e.ToTable("SubmissionFiles");
            e.Property(f => f.FieldName).HasMaxLength(50).IsRequired();
            e.Property(f => f.OriginalName).HasMaxLength(260).IsRequired();
            e.Property(f => f.StoredPath).HasMaxLength(400).IsRequired();
            e.Property(f => f.ContentType).HasMaxLength(150).IsRequired();
            e.HasQueryFilter(f => !f.IsDeleted && !f.Submission!.IsDeleted);
        });

        modelBuilder.Entity<Team>(e =>
        {
            e.ToTable("Teams");
            e.Property(t => t.Name).HasMaxLength(100).IsRequired();
            e.HasMany(t => t.Trainees)
                .WithOne(x => x.Team)
                .HasForeignKey(x => x.TeamId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Trainee>(e =>
        {
            e.ToTable("Trainees");
            e.Property(t => t.FullName).HasMaxLength(150).IsRequired();
            e.Property(t => t.AccessCode).HasMaxLength(10);
        });

        modelBuilder.Entity<ContactMessage>(e =>
        {
            e.ToTable("ContactMessages");
            e.Property(x => x.Name).HasMaxLength(150);
            e.Property(x => x.Phone).HasMaxLength(30);
            e.Property(x => x.TeamName).HasMaxLength(100);
            e.Property(x => x.Kind).HasMaxLength(20).IsRequired();
            e.Property(x => x.Message).HasMaxLength(3000).IsRequired();
            e.Property(x => x.Status).HasMaxLength(10).IsRequired();
            e.Property(x => x.AdminNote).HasMaxLength(1000);
        });

        modelBuilder.Entity<Feedback>(e =>
        {
            e.ToTable("Feedback");
            e.HasQueryFilter(x => !x.Submission!.IsDeleted);
            e.Property(x => x.Scope).HasMaxLength(10).IsRequired();
            e.Property(x => x.Kind).HasMaxLength(10).IsRequired();
            e.Property(x => x.Text).HasMaxLength(2000).IsRequired();
            e.Property(x => x.ResolvedBy).HasMaxLength(150);
            e.HasIndex(x => x.TeamId);
            e.HasIndex(x => x.TraineeId);
            e.HasOne(x => x.Submission).WithMany().HasForeignKey(x => x.SubmissionId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Team).WithMany().HasForeignKey(x => x.TeamId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Trainee).WithMany().HasForeignKey(x => x.TraineeId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<SubmissionTrainee>(e =>
        {
            e.ToTable("SubmissionTrainees");
            e.HasQueryFilter(x => !x.Submission!.IsDeleted);
            e.HasKey(x => new { x.SubmissionId, x.TraineeId });
            e.HasOne(x => x.Submission)
                .WithMany(s => s.Trainees)
                .HasForeignKey(x => x.SubmissionId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Trainee)
                .WithMany()
                .HasForeignKey(x => x.TraineeId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Evaluation>(e =>
        {
            e.ToTable("Evaluations");
            e.Property(x => x.Score).HasPrecision(4, 1);
            e.Property(x => x.Note).HasMaxLength(1000);
            e.HasIndex(x => new { x.TraineeId, x.Day }).IsUnique();
            e.HasOne(x => x.Trainee)
                .WithMany()
                .HasForeignKey(x => x.TraineeId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
