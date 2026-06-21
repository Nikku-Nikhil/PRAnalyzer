import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { 
  Activity, 
  GitPullRequest, 
  Users, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Shield,
  Code,
  Zap,
  BarChart3,
  Calendar,
  ExternalLink
} from 'lucide-react'

interface DashboardProps {
  recentAnalyses: Array<{
    id: string
    prUrl: string
    title: string
    author: string
    timestamp: string
    status: 'completed' | 'failed' | 'analyzing'
    score: number
    issuesFound: number
  }>
  teamStats: {
    totalPRsAnalyzed: number
    avgScore: number
    totalIssuesFound: number
    totalCommentsPosted: number
    avgAnalysisTime: string
    activeReviewers: number
  }
  weeklyTrends: {
    prsAnalyzed: number
    scoreImprovement: number
    issuesDecreased: number
  }
}

export function Dashboard({ recentAnalyses, teamStats, weeklyTrends }: DashboardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'analyzing': return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PRs Analyzed</CardTitle>
            <GitPullRequest className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.totalPRsAnalyzed}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{weeklyTrends.prsAnalyzed} this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(teamStats.avgScore)}`}>
              {teamStats.avgScore}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{weeklyTrends.scoreImprovement}% this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.totalIssuesFound}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              -{weeklyTrends.issuesDecreased} this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reviewers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.activeReviewers}</div>
            <div className="text-xs text-muted-foreground">
              Avg analysis: {teamStats.avgAnalysisTime}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Team Performance Overview
          </CardTitle>
          <CardDescription>
            Overall code quality metrics across all analyzed PRs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Code Quality
                </span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security
                </span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Performance
                </span>
                <span className="font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Analysis Activity
              </CardTitle>
              <CardDescription>
                Latest PR reviews and their results
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAnalyses.map((analysis) => (
              <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(analysis.status)}
                  <div>
                    <div className="font-medium">{analysis.title}</div>
                    <div className="text-sm text-muted-foreground">
                      by {analysis.author} • {analysis.timestamp}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {analysis.status === 'completed' && (
                    <>
                      <div className="text-center">
                        <div className={`font-medium ${getScoreColor(analysis.score)}`}>
                          {analysis.score}%
                        </div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{analysis.issuesFound}</div>
                        <div className="text-xs text-muted-foreground">Issues</div>
                      </div>
                    </>
                  )}
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ExternalLink className="h-3 w-3" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and configuration options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start gap-2">
              <GitPullRequest className="h-4 w-4" />
              Analyze New PR
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Users className="h-4 w-4" />
              Manage Team
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Activity className="h-4 w-4" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}