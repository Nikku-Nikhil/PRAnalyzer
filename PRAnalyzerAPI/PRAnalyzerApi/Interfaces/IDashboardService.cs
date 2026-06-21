using PRAnalyzerApi.DTOs;

namespace PRAnalyzerApi.Interfaces
{
    public interface IDashboardService
    {
        Task<TeamStatsDto> GetTeamStatsAsync();

        Task<WeeklyTrendsDto> GetWeeklyTrendsAsync();

        Task<List<RecentAnalysisDto>> GetRecentAnalysesAsync();
        Task<List<IssueDomainScoreDto>> GetIssueDomainScoresAsync();

    }
}
