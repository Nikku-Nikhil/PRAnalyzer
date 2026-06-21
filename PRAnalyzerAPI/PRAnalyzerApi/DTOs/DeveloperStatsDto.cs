namespace PRAnalyzerApi.DTOs
{
    public class DeveloperStatsDto
    {
        public DeveloperInfoDto Developer { get; set; }
        public int TotalPRsReviewed { get; set; }
        public List<CommonIssueDto> CommonIssues { get; set; }
        public List<string> ImprovementAreas { get; set; }
        public List<string> Strengths { get; set; }
        public string LastAnalyzed { get; set; }
        public double OverallScore { get; set; }
        public List<ScoreHistoryEntryDto> ScoreHistory { get; set; }
    }

    public class DeveloperInfoDto
    {
        public string Name { get; set; }
        public string Avatar { get; set; }
        public string GithubUrl { get; set; }
    }

    public class CommonIssueDto
    {
        public string Type { get; set; }
        public int Count { get; set; }
        public double Percentage { get; set; }
        public string Trend { get; set; }
        public List<string> Examples { get; set; }
    }

    public class ScoreHistoryEntryDto
    {
        public string Date { get; set; }
        public double Score { get; set; }
    }


}
