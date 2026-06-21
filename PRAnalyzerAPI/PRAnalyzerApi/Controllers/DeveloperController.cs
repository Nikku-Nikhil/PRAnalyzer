using Microsoft.AspNetCore.Mvc;
using PRAnalyzerApi.Interfaces;

namespace PRAnalyzerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeveloperStatsController : Controller
    {
        private readonly IDeveloperStatsService _service;

        public DeveloperStatsController(IDeveloperStatsService service)
        {
            _service = service;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllStats()
        {
            var stats = await _service.GetAllDeveloperStatsAsync();
            return Ok(stats);
        }
    }


}
