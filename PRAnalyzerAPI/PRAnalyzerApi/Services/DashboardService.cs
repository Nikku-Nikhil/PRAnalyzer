using Microsoft.EntityFrameworkCore;
using PRAnalyzerApi.DTOs;
using PRAnalyzerApi.Interfaces;
using PRAnalyzerApi.Models;

namespace PRAnalyzerApi.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly PRAnalyzerDbContext _context;

        public DashboardService(PRAnalyzerDbContext context)
        {
            _context = context;
        }
        public async Task<TeamStatsDto> GetTeamStatsAsync()
        {
            var prs = await _context.PullRequests.ToListAsync();
            var prFiles = await _context.Prfiles.ToListAsync();
            var diagnostics = await _context.Prdiagnostics.ToListAsync();

            int totalPRsAnalyzed = prs.Count;
            int totalIssuesFound = diagnostics.Count;
            int activeReviewers = prs.Sum(p => p.AsigneesCount) ?? 0;

            // Calculate average score across all PRs
            double totalScore = 0;

            foreach (var pr in prs)
            {
                var fileIds = prFiles
                    .Where(f => f.PullRequestId == pr.Id)
                    .Select(f => f.Id)
                    .ToList();

                int diagnosticsCount = diagnostics
                    .Count(d => fileIds.Contains(d.PrfileId));

                double score = Math.Max(0, 100 - diagnosticsCount * 2);
                totalScore += score;
            }

            double avgScore = prs.Count == 0 ? 0 : totalScore / prs.Count;

            // TODO: Implement real analysis timing later
            string avgAnalysisTime = "1.2 min";

            return new TeamStatsDto
            {
                TotalPRsAnalyzed = totalPRsAnalyzed,
                AvgScore = Math.Round(avgScore, 1),
                TotalIssuesFound = totalIssuesFound,
                TotalCommentsPosted = 0, // currently unused but matches UI
                AvgAnalysisTime = avgAnalysisTime,
                ActiveReviewers = activeReviewers
            };
        }


        public async Task<WeeklyTrendsDto> GetWeeklyTrendsAsync()
        {
            var prs = await _context.PullRequests
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            var prFiles = await _context.Prfiles.ToListAsync();
            var diagnostics = await _context.Prdiagnostics.ToListAsync();

            DateTime oneWeekAgo = DateTime.UtcNow.AddDays(-7);

            // PRs analyzed this week
            int prsThisWeek = prs.Count(p => p.CreatedAt >= oneWeekAgo);

            // Issues found this week
            int issuesThisWeek = diagnostics.Count(d =>
                prFiles.Any(f =>
                    f.Id == d.PrfileId &&
                    prs.Any(p =>
                        p.Id == f.PullRequestId &&
                        p.CreatedAt >= oneWeekAgo)));

            // Score improvement = compare first PR vs latest PR
            double scoreImprovement = 0;

            if (prs.Count > 1)
            {
                var oldest = prs.Last();
                var newest = prs.First();

                double oldestScore = CalculateScore(oldest, prFiles, diagnostics);
                double newestScore = CalculateScore(newest, prFiles, diagnostics);

                scoreImprovement = newestScore - oldestScore;
            }

            return new WeeklyTrendsDto
            {
                PrsAnalyzed = prsThisWeek,
                ScoreImprovement = Math.Round(scoreImprovement, 1),
                IssuesDecreased = issuesThisWeek
            };
        }

        public async Task<List<RecentAnalysisDto>> GetRecentAnalysesAsync()
        {
            var prs = await _context.PullRequests
                .OrderByDescending(p => p.CreatedAt)
                //.Take(10)
                .ToListAsync();

            var prFiles = await _context.Prfiles.ToListAsync();
            var diagnostics = await _context.Prdiagnostics.ToListAsync();
            var developers = await _context.Developers.ToListAsync();

            var result = new List<RecentAnalysisDto>();

            foreach (var pr in prs)
            {
                var developer = developers.FirstOrDefault(d => d.Id == pr.DeveloperId);

                var fileIds = prFiles
                    .Where(f => f.PullRequestId == pr.Id)
                    .Select(f => f.Id)
                    .ToList();

                int issuesFound = diagnostics
                    .Count(d => fileIds.Contains(d.PrfileId));

                double score = Math.Max(0, 100 - issuesFound * 2);

                result.Add(new RecentAnalysisDto
                {
                    Id = pr.Id.ToString(),
                    PrUrl = pr.PrUrl,
                    Title = pr.PrTitle ?? $"PR #{pr.Id}",
                    Author = developer?.Name ?? "Unknown",
                    Timestamp = pr.CreatedAt?.ToString("yyyy-MM-dd HH:mm") ?? "",
                    Status = pr.Status,
                    Score = score,
                    IssuesFound = issuesFound
                });
            }

            return result;
        }

        public async Task<List<IssueDomainScoreDto>> GetIssueDomainScoresAsync()
        {
            //const int maxScore = 100;
            //const int penaltyPerIssue = 2;
            int totalDiagnostics = await _context.Prdiagnostics.CountAsync();

            var domainStats = await (
                from d in _context.Prdiagnostics
                join domain in _context.IssueDomains
                on d.DomainId equals domain.Id
                group d by new { domain.Id, domain.Name } into g
                select new
                {
                    DomainId = g.Key.Id,
                    DomainName = g.Key.Name,
                    IssueCount = g.Count()
                }
                ).ToListAsync();


            var result = domainStats.Select(g => new IssueDomainScoreDto
            {
                DomainId = g.DomainId,
                DomainName = g.DomainName,
                IssuesCount = g.IssueCount,
                Score = totalDiagnostics == 0
         ? 0
         : Math.Round((double)g.IssueCount / totalDiagnostics * 100, 2)
            }).ToList();



            return result;
        }


        private double CalculateScore(PullRequest pr, List<Prfile> files, List<Prdiagnostic> diagnostics)
        {
            var fileIds = files
                .Where(f => f.PullRequestId == pr.Id)
                .Select(f => f.Id)
                .ToList();

            int issues = diagnostics
                .Count(d => fileIds.Contains(d.PrfileId));

            return Math.Max(0, 100 - issues * 2);
        }

    }
}
