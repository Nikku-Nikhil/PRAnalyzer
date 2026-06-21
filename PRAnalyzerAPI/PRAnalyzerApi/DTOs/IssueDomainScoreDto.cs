namespace PRAnalyzerApi.DTOs
{
    public class IssueDomainScoreDto
    {
        public int DomainId { get; set; }
        public string DomainName { get; set; }
        public double Score { get; set; }
        public int IssuesCount { get; set; }
    }
}
