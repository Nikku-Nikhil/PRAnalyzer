using System;
using System.Collections.Generic;

namespace PRAnalyzerApi.Models;

public partial class PullRequest
{
    public int Id { get; set; }

    public string PrUrl { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public int? DeveloperId { get; set; }
    public string? PrTitle { get; set; }
    public int? AsigneesCount { get; set; }

    public string Status { get; set; }
    public virtual Developer? Developer { get; set; }

    public virtual ICollection<Prfile> Prfiles { get; set; } = new List<Prfile>();
}
