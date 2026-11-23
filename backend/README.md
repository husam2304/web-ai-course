# CourseSubmissions.Api

باك إند تسليمات الدورة: ASP.NET Core 8 Minimal API + SQL Server + رفع ملفات + لوحة مدرب.

## التحديث على السيرفر الحالي (بدون ما تخسر البيانات)

1. **لا تستبدل `appsettings.json` اللي على السيرفر**، فيه الـ connection string. بس تأكد إن فيه:
   ```json
   "Admin": { "Key": "مفتاح-طويل-عشوائي-12-حرف-أو-أكثر" }
   ```
   (إذا المفتاح أقل من 12 حرف أو بيبلش بـ `CHANGE-ME` لوحة الأدمن ما بتشتغل.)
2. ```bash
   dotnet restore
   dotnet build
   dotnet publish -c Release -o publish
   ```
   وارفع محتوى `publish` لـ `wwwroot` (بدون `appsettings.json` إذا ما عدّلته).
3. أول تشغيل: `SchemaUpgrade` بيضيف لحاله عمود `Source` والجداول `Teams`, `Trainees`, `SubmissionTrainees`, `Evaluations`. التسليمات القديمة ما بتنمس.
4. افتح `https://web-train.runasp.net/` لازم يرجع `{"status":"ok",...}`.
5. من `admin.html`:
   1. قسم «الفرق والمتدربين»: أضف الفرق، وبكل فريق الصق الأسماء (كل اسم بسطر).
   2. قسم «التسليمات» ← «ربط تلقائي»: بيربط تسليمات اليوم الأول القديمة بالأسماء، وبيعرضلك تقرير.
   3. راجع التقرير، واللي انربط غلط أو ما انربط اضغط «ربط» جنبه وصلّحه.

## الـ Endpoints العامة

| Method | Path | الوصف |
|---|---|---|
| GET | `/` | فحص إن السيرفر شغال |
| GET | `/api/teams` | الفرق مع المتدربين النشطين (للقوائم المنسدلة) |
| POST | `/api/submissions` | تسليم (multipart/form-data) |
| GET | `/api/teams/{teamId}/files` | ملفات الفريق (كل الأيام) |
| GET | `/api/teams/{teamId}/files/{fileId}` | تنزيل ملف من ملفات الفريق |
| GET | `/api/teams/{teamId}/texts` | نصوص الفريق: الجمهور والأهداف، خطة الفريق، الشغل الإضافي |
| GET | `/api/teams/{teamId}/feedback` | ملاحظات المدرب للفريق (فتحها = انشافت) |
| GET | `/api/teams/{teamId}/feedback/count` | عدد الملاحظات الجديدة والمفتوحة (للشارة) |
| POST | `/api/feedback/personal` | `{ traineeId, code }` الملاحظات الشخصية بالكود |
| POST | `/api/contact` | رسالة من صفحة التواصل: `{ name, phone?, teamName?, kind, message, anonymous }` |
| POST | `/api/feedback/{id}/resolve` | «تم التعديل» أو تراجع: `{ teamId, traineeId?, code?, resolved }` |

حقول `POST /api/submissions`:

| الحقل | مطلوب | ملاحظة |
|---|---|---|
| `day` | نعم | 1 لـ 5 |
| `traineeId` | نعم (الطريقة الجديدة) | من القائمة. الاسم والفريق بيتعبّوا منه |
| `fullName` + `teamNumber` | بديل قديم | إذا ما انبعث `traineeId` (الصفحة بترجعلهم لحالها إذا ما قدرت تحمّل الفرق) |
| `answers` | لا | JSON object |
| أي حقل ملف | لا | لحد 3 ملفات، 20MB للملف، PDF/Word/صور/ZIP |
| `website` | لا | honeypot، لازم يكون فاضي |

## Endpoints الأدمن (`/api/admin/*`، كلها بدها هيدر `X-Admin-Key`)

| Method | Path | الوصف |
|---|---|---|
| GET | `summary` | عدد التسليمات لكل يوم |
| GET | `submissions?day=` | تسليمات اليوم مع المتدربين المربوطين |
| POST | `submissions` | رفع ملف من المدرب: `day`, `traineeIds` (1,2,3), `note`, ملفات |
| PUT | `submissions/{id}/trainees` | `{ "traineeIds": [..] }` تعديل الربط |
| DELETE | `submissions/{id}` | التسليم بيروح للمحذوفات (بيرجع) |
| PUT | `submissions/{id}` | تعديل: `{ day, answers }` (نقل لليوم الصح + تعديل الحقول) |
| POST | `submissions/{id}/files` | إضافة ملفات لتسليم موجود |
| POST | `merge` | دمج: `{ targetId, sourceIds, day, answers, keepFileIds }` |
| GET | `trash` | المحذوفات: تسليمات وملفات |
| POST | `trash/submissions/{id}/restore`، `trash/files/{id}/restore` | استرجاع |
| DELETE | `trash/submissions/{id}`، `trash/files/{id}` | حذف نهائي (بيمسح الملف من السيرفر) |
| POST | `auto-link` | ربط التسليمات غير المربوطة حسب الاسم، بيرجع تقرير |
| GET/POST | `teams` | الفرق (مع كل المتدربين) / إضافة فريق `{ name }` |
| PUT/DELETE | `teams/{id}` | تعديل / حذف (بس إذا فاضي) |
| POST | `trainees` | `{ fullName, teamId }` |
| POST | `trainees/bulk` | `{ teamId, names }` كل اسم بسطر |
| PUT | `trainees/{id}` | `{ fullName, teamId, isActive }` |
| DELETE | `trainees/{id}` | بينحذف، أو بيتوقف إذا عنده تسليمات/علامات |
| GET | `roster?day=` | مين سلّم ومين لا + العلامات |
| POST | `feedback` | `{ submissionId, scope: team/trainee, traineeId?, kind: good/improve/fix, text }` |
| PUT/DELETE | `feedback/{id}` | تعديل (بترجع «جديدة») / حذف |
| GET | `messages` | رسائل صفحة التواصل |
| PUT/DELETE | `messages/{id}` | `{ status: new/replied, adminNote }` / حذف |
| GET | `codes` | أكواد المتدربين للطباعة |
| POST | `trainees/{id}/code` | كود جديد لمتدرب |
| PUT | `evaluations` | `{ traineeId, day, score (0-10), note }` |
| GET | `files/{id}` | تنزيل ملف |
| DELETE | `files/{id}` | ملف واحد بيروح للمحذوفات (الإجابات بتضل) |
| GET | `files-zip?day=` | كل ملفات اليوم ZIP (مجلد لكل فريق) |
| GET | `export` أو `export?day=` | Excel: شيت «التقييم» (متدرب × يوم) + شيت تسليمات لكل يوم |

## التخزين

- الجداول: `Submissions`, `SubmissionFiles`, `Teams`, `Trainees`, `SubmissionTrainees` (تسليم ↔ متدربين، لأنه في تسليمات جماعية), `Evaluations`, `Feedback` (الملاحظات). وعمود `AccessCode` بجدول المتدربين.
- الملفات بـ `App_Data/uploads/day{N}/team-{الفريق}/` (IIS ما بيعرض App_Data للعامة).
- ملفات الفريق متاحة لأي حدا بيختار الفريق بصفحة «ملفات فريقي» (مناسب للقاعة، مش لملفات سرية).

## أول رفع (لو احتجته مرة ثانية)

1. من لوحة MonsterASP: Website + MSSQL Database.
2. `ConnectionStrings:Default` و`Cors:AllowedOrigins` و`Admin:Key` بـ `appsettings.json`.
3. `dotnet publish -c Release -o publish` وارفع لـ `wwwroot`.
4. خطأ 500.30: غالباً الـ connection string. فعّل `stdoutLogEnabled="true"` بـ `web.config` مؤقتاً وشوف `logs`.
