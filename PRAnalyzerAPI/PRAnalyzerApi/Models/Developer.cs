using System;
using System.Collections.Generic;

namespace PRAnalyzerApi.Models;

public partial class Developer
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Email { get; set; }

    public virtual ICollection<PullRequest> PullRequests { get; set; } = new List<PullRequest>();
}
