import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { GitPullRequest, Loader2, Github, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'

interface PRInputFormProps {
  onAnalyze: (prUrl: string) => void
  isAnalyzing: boolean
}

export function PRInputForm({ onAnalyze, isAnalyzing }: PRInputFormProps) {
  const [prUrl, setPrUrl] = useState('')
  const [urlError, setUrlError] = useState('')

  const validatePRUrl = (url: string) => {
    const githubPRRegex = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/pull\/\d+$/
    return githubPRRegex.test(url)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUrlError('')

    if (!prUrl.trim()) {
      setUrlError('Please enter a PR URL')
      return
    }

    if (!validatePRUrl(prUrl)) {
      setUrlError('Please enter a valid GitHub PR URL (e.g., https://github.com/owner/repo/pull/123)')
      return
    }

    onAnalyze(prUrl)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitPullRequest className="h-5 w-5" />
          Analyze Pull Request
        </CardTitle>
        <CardDescription>
          Enter a GitHub PR URL to perform automated code review analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-muted-foreground" />
              <label htmlFor="pr-url" className="text-sm font-medium">
                GitHub PR URL
              </label>
            </div>
            <Input
              id="pr-url"
              type="url"
              placeholder="https://github.com/owner/repo/pull/123"
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              className={urlError ? 'border-destructive' : ''}
            />
            {urlError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{urlError}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">Roslyn Analyzer</Badge>
            <Badge variant="outline">Code Quality</Badge>
            <Badge variant="outline">Security Scan</Badge>
            <Badge variant="outline">Performance</Badge>
          </div>

          <Button type="submit" disabled={isAnalyzing} className="w-full">
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing PR...
              </>
            ) : (
              <>
                <GitPullRequest className="mr-2 h-4 w-4" />
                Start Analysis
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}