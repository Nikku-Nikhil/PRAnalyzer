using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Octokit;
using PRAnalyzerApi.DTOs;
using PRAnalyzerApi.Models;
using PullRequest = PRAnalyzerApi.Models.PullRequest;

[ApiController]
[Route("api/pr")]
public class PRController : ControllerBase
{
    private readonly GitHubService _gitHubService;
    private readonly AnalyzerService _analyzerService;
    private readonly PRAnalyzerDbContext _dbContext;
    private readonly IServiceProvider _serviceProvider;

    public PRController(GitHubService gitHubService, AnalyzerService analyzerService, PRAnalyzerDbContext dbContext, IServiceProvider serviceProvider)
    {
        _gitHubService = gitHubService;
        _analyzerService = analyzerService;
        _dbContext = dbContext;
        _serviceProvider = serviceProvider;
    }

    [HttpPost("analyze")]
    public async Task<IActionResult> AnalyzePR([FromBody] PRRequestDto request)
    {
        try
        {
            // 1. Extract PR author details from GitHub URL automatically
            var (authorLogin, authorName, authorEmail, prTitle, asigneeCount) = await _gitHubService.GetPrAuthorDetailsAsync(request.PrUrl);

            // 2. Find or create developer with separate DbContext
            var developer = await CreateDeveloperAsync(authorLogin, authorName, authorEmail);

            // 3. Verify developer with separate DbContext
            await VerifyDeveloperAsync(developer.Id);

            // 4. Fetch files from GitHub
            var files = await _gitHubService.GetChangedFilesAsync(request.PrUrl);

            // 5. Analyze files with Roslyn
            var diagnostics = await _analyzerService.AnalyzeFilesAsync(files);

            // 6. Save PR with separate DbContext
            var pr = await CreatePullRequestAsync(request.PrUrl, developer.Id, prTitle, asigneeCount);

            // 7. Save files with separate DbContext
            await CreateFilesAsync(pr.Id, files);

            // 8. Save diagnostics with separate DbContext
            await CreateDiagnosticsAsync(pr.Id, diagnostics);

            await UpdatePrStatusAsync(pr.Id, "Completed");
            var mappedIssuesResponse = await MapIssues(pr.Id, diagnostics);
            var metrics = CalculateMetricsByDomain(diagnostics);
            var response = new PRAnalysisResponseDto
            {
                PrUrl = request.PrUrl,
                Title = prTitle,
                Author = authorLogin,
                Status = prTitle,

                Metrics = metrics,
                OverallScore = CalculateOverallScore(mappedIssuesResponse.Count),

                Issues = mappedIssuesResponse,
                CommentsPosted = mappedIssuesResponse.Count,
                FilesAnalyzed = files.Count
            };
            
            return Ok(response);
        }
        catch (Octokit.RateLimitExceededException)
        {
            return StatusCode(429, new { error = "GitHub API rate limit exceeded. Please try again later or configure a GitHub Token." });
        }
        catch (Octokit.NotFoundException)
        {
            return NotFound(new { error = "The specified PR or repository could not be found. Please check the URL and ensure the repository is public." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"An error occurred while analyzing the PR: {ex.Message}" });
        }
    }


    [HttpGet("{prId}")]
    public async Task<ActionResult<PRAnalysisResponseDto>> GetAnalysisById(int prId)
    {
        var pr = await _dbContext.PullRequests
            .Include(p => p.Developer)
            .FirstOrDefaultAsync(p => p.Id == prId);

        if (pr == null)
            return NotFound("PR not found");

        var devloper = await _dbContext.Developers.FirstOrDefaultAsync(p => p.Id == pr.DeveloperId);
        // Fetch files
        var files = await _dbContext.Prfiles
            .Where(f => f.PullRequestId == prId)
            .ToListAsync();

        // Fetch diagnostics
        var diagnostics = await _dbContext.Prdiagnostics
            .Where(d => d.Prfile.PullRequestId == prId)
            .Select(d => new
            {
                d.Prfile.FileName,
                d.DiagnosticId,
                d.Message,
                d.Severity,
                d.LineNumber,
                d.Domain.Name
            })
            .ToListAsync();

        // Map diagnostics into tuple format (same as POST)
        var diagnosticTuples = diagnostics
            .Select(d => (
                FileName: d.FileName,
                DiagnosticId: d.DiagnosticId,
                Message: d.Message,
                Severity: d.Severity,
                Line: d.LineNumber,
                DomainName: d.Name
            ))
            .ToList();

        // Reuse same mapping logic
        var mappedIssuesResponse = await MapIssues(prId, diagnosticTuples);
        var metrics = CalculateMetricsByDomain(diagnosticTuples);

        var response = new PRAnalysisResponseDto
        {
            PrUrl = pr.PrUrl,
            Title = pr.PrTitle,
            Author = devloper.Name,
            Status = pr.Status,

            Metrics = metrics,
            OverallScore = CalculateOverallScore(mappedIssuesResponse.Count),

            Issues = mappedIssuesResponse,
            CommentsPosted = mappedIssuesResponse.Count,
            FilesAnalyzed = files.Count
        };

        return Ok(response);
    }


    private async Task<Developer> CreateDeveloperAsync(string authorLogin, string authorName, string authorEmail)
    {
        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PRAnalyzerDbContext>();

        var developer = await dbContext.Developers
            .FirstOrDefaultAsync(d => d.Name == authorLogin || d.Email == authorEmail);

        if (developer == null)
        {
            developer = new Developer
            {
                Name = authorName,
                Email = authorEmail
            };
            dbContext.Developers.Add(developer);
            await dbContext.SaveChangesAsync(); // Immediate commit
        }

        return developer;
    }

    private async Task VerifyDeveloperAsync(int developerId)
    {
        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PRAnalyzerDbContext>();

        var verifyDeveloper = await dbContext.Developers.FindAsync(developerId);
        Console.WriteLine($"🔍 Verification: {(verifyDeveloper == null ? "FAILED" : $"SUCCESS - ID: {verifyDeveloper.Id}")}");
    }

    private async Task<PullRequest> CreatePullRequestAsync(string prUrl, int developerId, string prTitle, int asigneeCount)
    {
        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PRAnalyzerDbContext>();

        var pr = new PullRequest
        {
            PrUrl = prUrl,
            DeveloperId = developerId,
            CreatedAt = DateTime.UtcNow,
            PrTitle = prTitle,
            AsigneesCount = asigneeCount,
            Status = "Processing"


        };
        dbContext.PullRequests.Add(pr);
        await dbContext.SaveChangesAsync(); // Immediate commit

        return pr;
    }

    private async Task CreateFilesAsync(int prId, List<(string FileName, string Content)> files)
    {
        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PRAnalyzerDbContext>();

        foreach (var (fileName, content) in files)
        {
            dbContext.Prfiles.Add(new Prfile
            {
                PullRequestId = prId,
                FileName = fileName,
                Content = content
            });
        }
        await dbContext.SaveChangesAsync(); // Immediate commit
    }

    private async Task CreateDiagnosticsAsync(int prId, List<(string FileName, string DiagnosticId, string Message, string Severity, int? Line, string DomainName)> diagnostics)
    {
        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PRAnalyzerDbContext>();

        // Ensure Code Quality domain exists
        
        foreach (var diagnostic in diagnostics)
        {
            // FIX: Use FirstOrDefault() instead of First()
            var prFile = await dbContext.Prfiles
                .FirstOrDefaultAsync(f => f.PullRequestId == prId && f.FileName == diagnostic.FileName);

            var domainId = await EnsureCodeQualityDomainExists(dbContext, diagnostic.DomainName);
            if (prFile != null)
            {
                dbContext.Prdiagnostics.Add(new Prdiagnostic
                {
                    PrfileId = prFile.Id,
                    DiagnosticId = diagnostic.DiagnosticId,
                    Message = diagnostic.Message,
                    Severity = diagnostic.Severity,
                    LineNumber = diagnostic.Line ?? 0,
                    DomainId = domainId
                });
            }
            else
            {
                Console.WriteLine($"⚠️ No PrFile found for diagnostic: {diagnostic.DiagnosticId}");
            }
        }
        await dbContext.SaveChangesAsync();
    }
    private async Task<int> EnsureCodeQualityDomainExists(PRAnalyzerDbContext dbContext, string domainName)
    {
        var domain = await dbContext.IssueDomains
            .FirstOrDefaultAsync(d => d.Name == domainName);

        if (domain == null)
        {
            domain = new IssueDomain
            {
                Name = domainName,
                Description = domainName switch
                {
                    "Code Quality" => "Code quality issues, compiler errors, and coding standards",
                    "Security" => "Security vulnerabilities and practices",
                    "Style" => "Code formatting and style guidelines",
                    "SQL" => "Database query and SQL performance optimization",
                    _ => $"{domainName} category issues"
                }
            };
            dbContext.IssueDomains.Add(domain);
            await dbContext.SaveChangesAsync();
            Console.WriteLine($"✅ Created Issue Domain: {domain.Name} (ID: {domain.Id})");
        }
        else
        {
            Console.WriteLine($"✅ Issue Domain exists: {domain.Name} (ID: {domain.Id})");
        }

        return domain.Id;
    }

    private async Task UpdatePrStatusAsync(int prId, string status)
    {
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<PRAnalyzerDbContext>();

        var pr = await db.PullRequests.FindAsync(prId);
        if (pr == null) return;

        pr.Status = status;
        await db.SaveChangesAsync();
    }

    private async Task<List<IssueFrontendDto>> MapIssues(int prId,
    List<(string FileName, string DiagnosticId, string Message, string Severity, int? Line, string DomainName)> diagnostics)
    {
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<PRAnalyzerDbContext>();

        var pr = await db.Prdiagnostics.FindAsync(prId);
        return diagnostics.Select((d, index) => new IssueFrontendDto
        {
            Id = (index + 1).ToString(),
            Type = d.Severity.Equals("error", StringComparison.OrdinalIgnoreCase) ||d.Severity.Equals("warning", StringComparison.OrdinalIgnoreCase)? d.Severity.ToLower(): "info",
            Category = d.DomainName.ToLower(),
            File = d.FileName,
            Line = d.Line ?? 0,
            Message = d.Message
        }).ToList();
    }

    private static double CalculateOverallScore(int diagnosticsCount)
    {
        return Math.Max(0, 100 - diagnosticsCount * 2);
    }

    //private async Task<Dictionary<string, double>> CalculateMetricsByDomain(
    // List<(string FileName, string DiagnosticId, string Message, string Severity, int? Line, string DomainName)> diagnostics)
    //{
    //    int totalDiagnostics = diagnostics.Count;

    //    return diagnostics
    //        .GroupBy(d => d.DomainName)
    //        .ToDictionary(
    //            g => g.Key ?? "Unknown",
    //            g => totalDiagnostics == 0
    //                ? 0
    //                : Math.Round((double)g.Count() / totalDiagnostics * 100, 2)
    //        );
    //}


    private static List<MetricDto> CalculateMetricsByDomain(
     List<(string FileName, string DiagnosticId, string Message, string Severity, int? Line, string DomainName)> diagnostics)
    {
        int totalDiagnostics = diagnostics.Count;

        return diagnostics
            .GroupBy(d => d.DomainName)
            .Select(g => new MetricDto
            {
                Type = g.Key ?? "Unknown",
                Percentage = totalDiagnostics == 0
                    ? 0
                    : Math.Round((double)g.Count() / totalDiagnostics * 100, 2),
            })
            .ToList();
    }



}
