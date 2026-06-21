import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  User, 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Calendar
} from 'lucide-react'

interface DeveloperStat {
  developer: {
    name: string
    avatar: string
    githubUrl: string
  }
  totalPRsReviewed: number
  commonIssues: Array<{
    type: string
    count: number
    percentage: number
    trend: 'up' | 'down' | 'stable'
    examples: string[]
  }>
  improvementAreas: string[]
  strengths: string[]
  lastAnalyzed: string
  overallScore: number
  scoreHistory: Array<{
    date: string
    score: number
  }>
}

interface DeveloperStatsProps {
  stats: DeveloperStat[]
}

export function DeveloperStats({ stats }: DeveloperStatsProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />
      default: return <div className="h-4 w-4" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Developer Statistics
          </CardTitle>
          <CardDescription>
            Track recurring issues and improvement patterns for each developer
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patterns">Issue Patterns</TabsTrigger>
          <TabsTrigger value="trends">Improvement Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={stat.developer.avatar} />
                      <AvatarFallback>
                        {stat.developer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{stat.developer.name}</CardTitle>
                      <CardDescription>
                        {stat.totalPRsReviewed} PRs reviewed • Last analyzed {stat.lastAnalyzed}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(stat.overallScore)}`}>
                      {stat.overallScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Strengths
                    </h4>
                    <div className="space-y-2">
                      {stat.strengths.map((strength, i) => (
                        <Badge key={i} variant="secondary" className="mr-2">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      Improvement Areas
                    </h4>
                    <div className="space-y-2">
                      {stat.improvementAreas.map((area, i) => (
                        <Badge key={i} variant="outline" className="mr-2">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={stat.developer.avatar} />
                    <AvatarFallback>
                      {stat.developer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{stat.developer.name}</CardTitle>
                    <CardDescription>Common issues and patterns</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stat.commonIssues.map((issue, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{issue.type}</span>
                          {getTrendIcon(issue.trend)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {issue.count} times ({issue.percentage}%)
                          </span>
                        </div>
                      </div>
                      <Progress value={issue.percentage} className="h-2" />
                      <div className="text-sm text-muted-foreground">
                        Recent examples: {issue.examples.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={stat.developer.avatar} />
                    <AvatarFallback>
                      {stat.developer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{stat.developer.name}</CardTitle>
                    <CardDescription>Score improvement over time</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-2">
                    {stat.scoreHistory.map((entry, i) => (
                      <div key={i} className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">
                          {entry.date}
                        </div>
                        <div className={`text-sm font-medium ${getScoreColor(entry.score)}`}>
                          {entry.score}%
                        </div>
                        <div 
                          className="w-full bg-muted rounded h-2 mt-1"
                          style={{
                            background: `linear-gradient(to top, ${
                              entry.score >= 80 ? '#22c55e' : 
                              entry.score >= 60 ? '#eab308' : '#ef4444'
                            } ${entry.score}%, #f1f5f9 ${entry.score}%)`
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        7-day trend
                      </span>
                      <span className={`font-medium ${
                        stat.scoreHistory[stat.scoreHistory.length - 1].score > 
                        stat.scoreHistory[0].score ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.scoreHistory[stat.scoreHistory.length - 1].score > 
                         stat.scoreHistory[0].score ? '+' : ''}
                        {(stat.scoreHistory[stat.scoreHistory.length - 1].score - 
                          stat.scoreHistory[0].score).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}