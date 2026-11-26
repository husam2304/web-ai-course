using Microsoft.EntityFrameworkCore;

namespace CourseSubmissions.Api.Data;

/// <summary>
/// EnsureCreated() only builds a database from scratch. The live database already has the
/// Day 1 tables, so the new tables/columns are added here with idempotent SQL (safe to run on every start).
/// </summary>
public static class SchemaUpgrade
{
    private const string Sql = """
        IF COL_LENGTH('Submissions', 'Source') IS NULL
            ALTER TABLE Submissions ADD Source nvarchar(20) NOT NULL CONSTRAINT DF_Submissions_Source DEFAULT 'form';

        IF OBJECT_ID('Teams') IS NULL
            CREATE TABLE Teams (
                Id int IDENTITY(1,1) NOT NULL CONSTRAINT PK_Teams PRIMARY KEY,
                Name nvarchar(100) NOT NULL,
                SortOrder int NOT NULL
            );

        IF OBJECT_ID('Trainees') IS NULL
            CREATE TABLE Trainees (
                Id int IDENTITY(1,1) NOT NULL CONSTRAINT PK_Trainees PRIMARY KEY,
                FullName nvarchar(150) NOT NULL,
                TeamId int NOT NULL CONSTRAINT FK_Trainees_Teams_TeamId REFERENCES Teams(Id),
                IsActive bit NOT NULL
            );

        IF OBJECT_ID('SubmissionTrainees') IS NULL
            CREATE TABLE SubmissionTrainees (
                SubmissionId int NOT NULL CONSTRAINT FK_SubmissionTrainees_Submissions_SubmissionId REFERENCES Submissions(Id) ON DELETE CASCADE,
                TraineeId int NOT NULL CONSTRAINT FK_SubmissionTrainees_Trainees_TraineeId REFERENCES Trainees(Id),
                CONSTRAINT PK_SubmissionTrainees PRIMARY KEY (SubmissionId, TraineeId)
            );

        IF OBJECT_ID('Evaluations') IS NULL
            CREATE TABLE Evaluations (
                Id int IDENTITY(1,1) NOT NULL CONSTRAINT PK_Evaluations PRIMARY KEY,
                TraineeId int NOT NULL CONSTRAINT FK_Evaluations_Trainees_TraineeId REFERENCES Trainees(Id) ON DELETE CASCADE,
                Day int NOT NULL,
                Score decimal(4,1) NULL,
                Note nvarchar(1000) NULL,
                CONSTRAINT UQ_Evaluations_TraineeId_Day UNIQUE (TraineeId, Day)
            );

        IF COL_LENGTH('Trainees', 'AccessCode') IS NULL
            ALTER TABLE Trainees ADD AccessCode nvarchar(10) NULL;

        IF OBJECT_ID('Feedback') IS NULL
            CREATE TABLE Feedback (
                Id int IDENTITY(1,1) NOT NULL CONSTRAINT PK_Feedback PRIMARY KEY,
                SubmissionId int NOT NULL CONSTRAINT FK_Feedback_Submissions_SubmissionId REFERENCES Submissions(Id) ON DELETE CASCADE,
                Scope nvarchar(10) NOT NULL,
                TeamId int NULL CONSTRAINT FK_Feedback_Teams_TeamId REFERENCES Teams(Id),
                TraineeId int NULL CONSTRAINT FK_Feedback_Trainees_TraineeId REFERENCES Trainees(Id),
                Kind nvarchar(10) NOT NULL,
                Text nvarchar(2000) NOT NULL,
                CreatedAtUtc datetime2 NOT NULL,
                SeenAtUtc datetime2 NULL,
                ResolvedAtUtc datetime2 NULL,
                ResolvedBy nvarchar(150) NULL
            );

        IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Feedback_TeamId')
            CREATE INDEX IX_Feedback_TeamId ON Feedback(TeamId);

        IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Feedback_TraineeId')
            CREATE INDEX IX_Feedback_TraineeId ON Feedback(TraineeId);

        IF COL_LENGTH('Submissions', 'IsDeleted') IS NULL
            ALTER TABLE Submissions ADD IsDeleted bit NOT NULL CONSTRAINT DF_Submissions_IsDeleted DEFAULT 0;

        IF COL_LENGTH('Submissions', 'DeletedAtUtc') IS NULL
            ALTER TABLE Submissions ADD DeletedAtUtc datetime2 NULL;

        IF COL_LENGTH('Submissions', 'UpdatedAtUtc') IS NULL
            ALTER TABLE Submissions ADD UpdatedAtUtc datetime2 NULL;

        IF COL_LENGTH('Submissions', 'MergedIntoId') IS NULL
            ALTER TABLE Submissions ADD MergedIntoId int NULL;

        IF COL_LENGTH('SubmissionFiles', 'IsDeleted') IS NULL
            ALTER TABLE SubmissionFiles ADD IsDeleted bit NOT NULL CONSTRAINT DF_SubmissionFiles_IsDeleted DEFAULT 0;

        IF COL_LENGTH('SubmissionFiles', 'DeletedAtUtc') IS NULL
            ALTER TABLE SubmissionFiles ADD DeletedAtUtc datetime2 NULL;

        IF OBJECT_ID('ContactMessages') IS NULL
            CREATE TABLE ContactMessages (
                Id int IDENTITY(1,1) NOT NULL CONSTRAINT PK_ContactMessages PRIMARY KEY,
                Name nvarchar(150) NULL,
                Phone nvarchar(30) NULL,
                TeamName nvarchar(100) NULL,
                Kind nvarchar(20) NOT NULL,
                Message nvarchar(3000) NOT NULL,
                IsAnonymous bit NOT NULL,
                CreatedAtUtc datetime2 NOT NULL,
                Status nvarchar(10) NOT NULL,
                AdminNote nvarchar(1000) NULL
            );

        IF OBJECT_ID('ContentUnlocks') IS NULL
            CREATE TABLE ContentUnlocks (
                [Key] nvarchar(64) NOT NULL CONSTRAINT PK_ContentUnlocks PRIMARY KEY,
                UnlockedAtUtc datetime2 NOT NULL
            );

        IF COL_LENGTH('Teams', 'ProjectUrl') IS NULL
            ALTER TABLE Teams ADD ProjectUrl nvarchar(300) NULL;

        IF OBJECT_ID('TraineeCards') IS NULL
            CREATE TABLE TraineeCards (
                TraineeId int NOT NULL CONSTRAINT PK_TraineeCards PRIMARY KEY
                    CONSTRAINT FK_TraineeCards_Trainees REFERENCES Trainees(Id) ON DELETE CASCADE,
                Html nvarchar(max) NOT NULL,
                IsHidden bit NOT NULL,
                UpdatedAtUtc datetime2 NOT NULL
            );
        """;

    // Each statement runs on its own (a table must exist before another table's FK points at it).
    public static async Task RunAsync(AppDbContext db)
    {
        foreach (var statement in Sql.Replace("\r\n", "\n").Split("\n\n", StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
            await db.Database.ExecuteSqlRawAsync(statement);
    }
}
