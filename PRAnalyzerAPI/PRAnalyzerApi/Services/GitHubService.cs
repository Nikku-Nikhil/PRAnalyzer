using Octokit;

public class GitHubService
{
    private readonly GitHubClient _client;

    public GitHubService()
    {
        _client = new GitHubClient(new ProductHeaderValue("PRAnalyzer"));
        // Optional: authenticate for private repos or higher rate limits
        // _client.Credentials = new Credentials("YOUR_PERSONAL_ACCESS_TOKEN");
    }

    public async Task<List<(string FileName, string Content)>> GetChangedFilesAsync(string prUrl)
    {
        var (owner, repo, prNumber) = ParsePrUrl(prUrl);

        var prFiles = await _client.PullRequest.Files(owner, repo, prNumber);
        var result = new List<(string, string)>();

        foreach (var file in prFiles)
        {
            // Skip deleted files (no content to analyze)
            if (file.Status == "removed")
                continue;

            string content;

            try
            {
                // Try to get the actual file content from the feature branch (head ref)
                var pr = await _client.PullRequest.Get(owner, repo, prNumber);
                var headRef = pr.Head.Sha;

                var rawContents = await _client.Repository.Content.GetAllContentsByRef(owner, repo, file.FileName, headRef);
                content = rawContents.FirstOrDefault()?.Content ?? string.Empty;

                // GitHub returns base64-encoded content for some file types — decode it
                if (!string.IsNullOrEmpty(content))
                {
                    try
                    {
                        content = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(content.Replace("\n", "")));
                    }
                    catch
                    {
                        // Content was not base64 — use as-is
                    }
                }
            }
            catch
            {
                // Fallback: use the patch/diff text from the PR for analysis
                // This always works even when full file isn't accessible
                content = file.Patch ?? string.Empty;
            }

            if (!string.IsNullOrWhiteSpace(content))
            {
                result.Add((file.FileName, content));
            }
        }

        return result;
    }

    public async Task<(string Login, string Name, string Email, string Title, int AsigneeCount)> GetPrAuthorDetailsAsync(string prUrl)
    {
        try
        {
            var (owner, repo, prNumber) = ParsePrUrl(prUrl);

            var pr = await _client.PullRequest.Get(owner, repo, prNumber);
            var user = await _client.User.Get(pr.User.Login);

            return (
                Login: pr.User.Login,
                Name: user.Name ?? pr.User.Login,
                Email: user.Email ?? $"{pr.User.Login}@users.noreply.github.com",
                Title: pr.Title,
                AsigneeCount: pr.Assignees?.Count ?? 0
            );
        }
        catch (Exception ex)
        {
            Console.WriteLine($"⚠️ GitHub author fetch failed: {ex.Message}");
            var fallback = "unknown";
            return (fallback, fallback, $"{fallback}@users.noreply.github.com", "Unknown PR", 0);
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static (string Owner, string Repo, int PrNumber) ParsePrUrl(string prUrl)
    {
        // Handle both https://github.com/owner/repo/pull/123 and github.com/owner/repo/pull/123
        if (!prUrl.StartsWith("http", StringComparison.OrdinalIgnoreCase))
            prUrl = "https://" + prUrl;

        var uri = new Uri(prUrl);
        var segments = uri.AbsolutePath.Trim('/').Split('/');
        // segments: [owner, repo, "pull", prNumber]
        return (segments[0], segments[1], int.Parse(segments[3]));
    }
}
