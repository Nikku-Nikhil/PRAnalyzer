namespace PRAnalyzerApi.DTOs
{
    public class PRAnalysisResponseDto
    {
        public string PrUrl { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string Status { get; set; }

        public double OverallScore { get; set; }
        public List<MetricDto> Metrics { get; set; }

        public List<IssueFrontendDto> Issues { get; set; }

        public int CommentsPosted { get; set; }
        public int FilesAnalyzed { get; set; }
    }

    public class IssueFrontendDto
    {
        public string Id { get; set; }
        public string Type { get; set; }       // error | info
        public string Category { get; set; }   // security | performance | style
        public string File { get; set; }
        public int Line { get; set; }
        public string Message { get; set; }
    }

    public class MetricDto
    {
        public string Type { get; set; }
        public double Percentage { get; set; }
    }
}
