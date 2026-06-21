using System;
using System.Collections.Generic;

namespace PRAnalyzerApi.Models;

public partial class IssueDomain
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<Prdiagnostic> Prdiagnostics { get; set; } = new List<Prdiagnostic>();
}
