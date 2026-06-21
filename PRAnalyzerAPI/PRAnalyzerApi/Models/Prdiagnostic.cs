using System;
using System.Collections.Generic;

namespace PRAnalyzerApi.Models;

public partial class Prdiagnostic
{
    public int Id { get; set; }

    public int PrfileId { get; set; }

    public string DiagnosticId { get; set; } = null!;

    public string Message { get; set; } = null!;

    public string Severity { get; set; } = null!;

    public int? LineNumber { get; set; }

    public int DomainId { get; set; }

    public virtual IssueDomain Domain { get; set; } = null!;

    public virtual Prfile Prfile { get; set; } = null!;
}
