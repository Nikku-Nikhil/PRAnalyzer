namespace PRAnalyzerApi.DTOs
{
    public class TeamStatsDto
    {
        public int TotalPRsAnalyzed { get; set; }
        public double AvgScore { get; set; }
        public int TotalIssuesFound { get; set; }
        public int TotalCommentsPosted { get; set; } = 0; // Optional for future
        public string AvgAnalysisTime { get; set; } = "0 min"; // Placeholder until implemented
        public int ActiveReviewers { get; set; }
    }

}
