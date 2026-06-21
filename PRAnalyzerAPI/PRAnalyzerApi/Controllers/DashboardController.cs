using Microsoft.AspNetCore.Mvc;
using PRAnalyzerApi.Interfaces;

namespace PRAnalyzerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : Controller
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("team-stats")]
        public async Task<IActionResult> GetTeamStats()
        {
            var stats = await _dashboardService.GetTeamStatsAsync();
            return Ok(stats);
        }

        [HttpGet("weekly-trends")]
        public async Task<IActionResult> GetWeeklyTrends()
        {
            var trends = await _dashboardService.GetWeeklyTrendsAsync();
            return Ok(trends);
        }

        [HttpGet("recent-analyses")]
        public async Task<IActionResult> GetRecentAnalyses()
        {
            var recent = await _dashboardService.GetRecentAnalysesAsync();
            return Ok(recent);
        }

        [HttpGet("issue-domain-scores")]
        public async Task<IActionResult> GetIssueDomainScores()
        {
            var result = await _dashboardService.GetIssueDomainScoresAsync();
            return Ok(result);
        }

    }

}
