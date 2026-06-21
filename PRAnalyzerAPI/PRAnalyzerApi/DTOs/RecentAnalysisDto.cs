namespace PRAnalyzerApi.DTOs
{
    public class RecentAnalysisDto
    {
        public string Id { get; set; }
        public string PrUrl { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string Timestamp { get; set; }
        public string Status { get; set; } // completed | failed | analyzing
        public double Score { get; set; }
        public int IssuesFound { get; set; }
    }

}
