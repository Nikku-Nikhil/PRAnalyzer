using System;
using System.Collections.Generic;

namespace PRAnalyzerApi.Models;

public partial class Prfile
{
    public int Id { get; set; }

    public int PullRequestId { get; set; }

    public string FileName { get; set; } = null!;

    public string Content { get; set; } = null!;

    public virtual ICollection<Prdiagnostic> Prdiagnostics { get; set; } = new List<Prdiagnostic>();

    public virtual PullRequest PullRequest { get; set; } = null!;
}
