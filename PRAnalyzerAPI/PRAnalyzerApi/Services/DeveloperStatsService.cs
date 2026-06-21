using Microsoft.EntityFrameworkCore;
using PRAnalyzerApi.DTOs;
using PRAnalyzerApi.Interfaces;
using PRAnalyzerApi.Models;

namespace PRAnalyzerApi.Services
{
    public class DeveloperStatsService : IDeveloperStatsService
    {
        private readonly PRAnalyzerDbContext _context;

        public DeveloperStatsService(PRAnalyzerDbContext context)
        {
            _context = context;
        }

        public async Task<List<DeveloperStatsDto>> GetAllDeveloperStatsAsync()
        {
            var developers = await _context.Developers.ToListAsync();
            var domains = await _context.IssueDomains.ToListAsync();

            var result = new List<DeveloperStatsDto>();

            foreach (var dev in developers)
            {
                var prs = await _context.PullRequests
                    .Where(p => p.DeveloperId == dev.Id)
                    .OrderBy(p => p.CreatedAt)
                    .ToListAsync();

                // Skip developers with no PRs (e.g. deleted/unknown entries)
                if (prs.Count == 0)
                    continue;

                var prIds = prs.Select(p => p.Id).ToList();

                var files = await _context.Prfiles
                    .Where(f => prIds.Contains(f.PullRequestId))
                    .ToListAsync();

                var fileIds = files.Select(f => f.Id).ToList();

                var diagnostics = await _context.Prdiagnostics
                    .Where(d => fileIds.Contains(d.PrfileId))
                    .ToListAsync();

                int totalDiagnostics = diagnostics.Count;

                double overallScore = Math.Max(0, 100 - totalDiagnostics * 2);

                // Score history
                var scoreHistory = prs
                    .OrderByDescending(pr => pr.CreatedAt)
                    .Take(7).Select(pr =>
                    {
                        var prFileIds = files.Where(f => f.PullRequestId == pr.Id)
                            .Select(f => f.Id)
                            .ToList();

                        int prDiagCount = diagnostics.Count(d => prFileIds.Contains(d.PrfileId));

                        double prScore = Math.Max(0, 100 - prDiagCount * 2);

                        return new ScoreHistoryEntryDto
                        {
                            Date = pr.CreatedAt?.ToString("yyyy-MM-dd") ?? "",
                            Score = prScore
                        };
                    }).ToList();

                // Common issues by domain (only for domains where developer has issues > 0)
                var commonIssues = diagnostics
                    .GroupBy(d => d.DomainId)
                    .Select(g => new CommonIssueDto
                    {
                        Type = domains.FirstOrDefault(dom => dom.Id == g.Key)?.Name ?? "Unknown",
                        Count = g.Count(),
                        Percentage = totalDiagnostics == 0 ? 0 :
                            Math.Round((double)g.Count() / totalDiagnostics * 100, 2),
                        Trend = "stable",
                        Examples = g.Take(3).Select(x => x.Message).ToList()
                    }).ToList();

                // Calculate issue counts for ALL domains in the database
                var devFileNames = files.Select(f => f.FileName).ToList();
                var domainCounts = domains
                    .Where(dom => IsDomainApplicable(dom.Name, devFileNames))
                    .Select(dom => new
                    {
                        Domain = dom.Name,
                        Count = diagnostics.Count(d => d.DomainId == dom.Id)
                    }).ToList();

                // Improvement areas: domains with the most issues (only count domains with > 0 issues)
                var improvementAreas = domainCounts
                    .Where(dc => dc.Count > 0)
                    .OrderByDescending(dc => dc.Count)
                    .Take(3)
                    .Select(dc => dc.Domain)
                    .ToList();

                // Strengths: domains with the least issues
                // Prefer domains with 0 issues. If none, take those not in improvement areas.
                var strengths = domainCounts
                    .Where(dc => !improvementAreas.Contains(dc.Domain))
                    .OrderBy(dc => dc.Count)
                    .Take(3)
                    .Select(dc => dc.Domain)
                    .ToList();

                // Fallback if all domains have issues and strengths is empty
                if (strengths.Count == 0 && domainCounts.Count > 0)
                {
                    strengths = domainCounts
                        .OrderBy(dc => dc.Count)
                        .Take(3)
                        .Select(dc => dc.Domain)
                        .ToList();
                }

                result.Add(new DeveloperStatsDto
                {
                    Developer = new DeveloperInfoDto
                    {
                        Name = dev.Name,
                        Avatar = "",
                        GithubUrl = ""
                    },
                    TotalPRsReviewed = prs.Count,
                    CommonIssues = commonIssues,
                    ImprovementAreas = improvementAreas,
                    Strengths = strengths,
                    LastAnalyzed = prs.LastOrDefault()?.CreatedAt?.ToString("yyyy-MM-dd") ?? "",
                    OverallScore = overallScore,
                    ScoreHistory = scoreHistory
                });
            }

            return result;
        }

        private static bool IsDomainApplicable(string domain, List<string> fileNames)
        {
            if (domain == "SQL")
            {
                return fileNames.Any(f => f.EndsWith(".sql", StringComparison.OrdinalIgnoreCase));
            }
            return true;
        }
    }


}
