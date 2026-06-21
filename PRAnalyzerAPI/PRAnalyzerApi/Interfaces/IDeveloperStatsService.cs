using PRAnalyzerApi.DTOs;

namespace PRAnalyzerApi.Interfaces
{
    public interface IDeveloperStatsService
    {
        Task<List<DeveloperStatsDto>> GetAllDeveloperStatsAsync();
    }
}
