using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;

public class AnalyzerService
{
    private const int MaxLineLength = 120;

    public Task<List<(string FileName, string DiagnosticId, string Message, string Severity, int? Line, string DomainName)>> AnalyzeFilesAsync(
        List<(string FileName, string Content)> files)
    {
        var diagnosticsList = new List<(string, string, string, string, int?, string)>();

        foreach (var (fileName, content) in files)
        {
            var ext = Path.GetExtension(fileName).ToLowerInvariant();

            if (ext == ".cs")
            {
                diagnosticsList.AddRange(AnalyzeCSharpFile(fileName, content));
            }
            else if (IsCodeFile(ext))
            {
                diagnosticsList.AddRange(AnalyzeGenericFile(fileName, content, ext));
            }
            // Skip binary/asset files silently
        }

        return Task.FromResult(diagnosticsList);
    }

    // ── C# Roslyn Analysis ────────────────────────────────────────────────────

    private static IEnumerable<(string, string, string, string, int?, string)> AnalyzeCSharpFile(string fileName, string content)
    {
        var tree = CSharpSyntaxTree.ParseText(content);
        var compilation = CSharpCompilation.Create("Analysis")
            .AddReferences(MetadataReference.CreateFromFile(typeof(object).Assembly.Location))
            .AddSyntaxTrees(tree);

        foreach (var diag in compilation.GetDiagnostics())
        {
            var severity = diag.Severity.ToString();
            var domainName = MapDiagnosticToDomain(diag.Id);
            var line = diag.Location.IsInSource
                ? diag.Location.GetLineSpan().StartLinePosition.Line + 1
                : (int?)null;

            yield return (fileName, diag.Id, diag.GetMessage(), severity, line, domainName);
        }
    }

    // ── Universal Language-Agnostic Analysis ──────────────────────────────────

    private static IEnumerable<(string, string, string, string, int?, string)> AnalyzeGenericFile(string fileName, string content, string ext)
    {
        var lines = content.Split('\n');

        for (int i = 0; i < lines.Length; i++)
        {
            var trimmed = lines[i].TrimEnd('\r');
            var lineNum = i + 1;

            // 1. console.log/error/warn left in code
            if ((ext is ".js" or ".jsx" or ".ts" or ".tsx") &&
                System.Text.RegularExpressions.Regex.IsMatch(trimmed, @"\bconsole\.(log|error|warn|debug)\b"))
            {
                yield return (fileName, "GEN001", "Debug statement 'console.log/error/warn' found — remove before production.", "Warning", lineNum, "Code Quality");
            }

            // 2. TODO / FIXME / HACK comments
            if (System.Text.RegularExpressions.Regex.IsMatch(trimmed, @"\b(TODO|FIXME|HACK|XXX)\b", System.Text.RegularExpressions.RegexOptions.IgnoreCase))
            {
                yield return (fileName, "GEN002", $"Unresolved TODO/FIXME comment: '{trimmed.Trim()}'", "Warning", lineNum, "Code Quality");
            }

            // 3. Long lines
            if (trimmed.Length > MaxLineLength)
            {
                yield return (fileName, "GEN003", $"Line exceeds {MaxLineLength} characters ({trimmed.Length} chars). Consider breaking it up.", "Info", lineNum, "Style");
            }

            // 4. Hardcoded secrets / API keys
            if (System.Text.RegularExpressions.Regex.IsMatch(trimmed, @"(password|secret|api_?key|token)\s*[:=]\s*[""'][^""']{6,}[""']", System.Text.RegularExpressions.RegexOptions.IgnoreCase))
            {
                yield return (fileName, "SEC001", $"Possible hardcoded secret or credential detected.", "Error", lineNum, "Security");
            }

            // 5. debugger statement
            if ((ext is ".js" or ".jsx" or ".ts" or ".tsx") &&
                System.Text.RegularExpressions.Regex.IsMatch(trimmed, @"\bdebugger\b"))
            {
                yield return (fileName, "GEN004", "'debugger' statement found — must be removed before production.", "Error", lineNum, "Code Quality");
            }

            // 6. alert() calls
            if ((ext is ".js" or ".jsx" or ".ts" or ".tsx") &&
                System.Text.RegularExpressions.Regex.IsMatch(trimmed, @"\balert\s*\("))
            {
                yield return (fileName, "GEN005", "'alert()' call found — use a proper notification/toast system instead.", "Warning", lineNum, "Style");
            }

            // 7. Magic numbers
            if (System.Text.RegularExpressions.Regex.IsMatch(trimmed, @"(?<![a-zA-Z_])[0-9]{3,}(?![a-zA-Z_])") &&
                !trimmed.TrimStart().StartsWith("//") && !trimmed.TrimStart().StartsWith("*"))
            {
                yield return (fileName, "GEN006", "Magic number detected — consider extracting to a named constant.", "Info", lineNum, "Code Quality");
            }
        }

        // 8. File too large
        if (lines.Length > 400)
        {
            yield return (fileName, "GEN007", $"File has {lines.Length} lines — consider splitting into smaller modules.", "Warning", null, "Style");
        }

        // 9. Async without error handling
        if (ext is ".js" or ".jsx" or ".ts" or ".tsx")
        {
            bool hasAsync = content.Contains("async ");
            bool hasCatch = content.Contains(".catch(") || content.Contains("try {") || content.Contains("try{");
            if (hasAsync && !hasCatch)
            {
                yield return (fileName, "GEN008", "Async functions found without any try/catch or .catch() error handling.", "Warning", null, "Code Quality");
            }
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static bool IsCodeFile(string ext) => ext switch
    {
        ".js" or ".jsx" or ".ts" or ".tsx" => true,
        ".py" or ".rb" or ".go" or ".java" => true,
        ".css" or ".scss" or ".less" => true,
        ".html" or ".vue" or ".svelte" => true,
        ".json" or ".yaml" or ".yml" => true,
        ".sh" or ".bash" => true,
        _ => false
    };

    private static string MapDiagnosticToDomain(string diagnosticId)
    {
        if (string.IsNullOrWhiteSpace(diagnosticId))
            return "Unknown";

        string prefix = new string(diagnosticId.TakeWhile(char.IsLetter).ToArray());

        var map = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            { "CS",  "Code Quality" },
            { "IDE", "Code Quality" },
            { "CA",  "Security"     },
            { "SA",  "Style"        },
            { "SQL", "SQL"          },
            { "GEN", "Code Quality" },
            { "SEC", "Security"     }
        };

        return map.TryGetValue(prefix, out var domain) ? domain : "Unknown";
    }
}
