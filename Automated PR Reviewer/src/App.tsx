import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { PRInputForm } from './components/PRInputForm'
import { AnalysisResults } from './components/AnalysisResults'
import { DeveloperStats } from './components/DeveloperStats'
import { Dashboard } from './components/Dashboard'
import { Settings } from './components/Settings'
import { 
  LayoutDashboard, 
  GitPullRequest, 
  BarChart3, 
  Users, 
  Settings as SettingsIcon,
  Bot
} from 'lucide-react'

// Mock data for demonstration
const mockAnalysisResult = {
  prUrl: "https://github.com/example/repo/pull/123",
  title: "Add user authentication feature",
  author: "john.doe",
  status: 'completed' as const,
  overallScore: 78,
  metrics: {
    codeQuality: 85,
    security: 65,
    performance: 82,
    maintainability: 79
  },
  issues: [
    {
      id: '1',
      type: 'error' as const,
      category: 'security' as const,
      file: 'src/auth/AuthService.cs',
      line: 45,
      message: 'Potential SQL injection vulnerability in user login query',
      suggestion: 'Use parameterized queries or ORM to prevent SQL injection attacks',
      severity: 'high' as const
    },
    {
      id: '2',
      type: 'warning' as const,
      category: 'performance' as const,
      file: 'src/controllers/UserController.cs',
      line: 23,
      message: 'N+1 query problem detected in user data loading',
      suggestion: 'Use eager loading with Include() to reduce database roundtrips',
      severity: 'medium' as const
    },
    {
      id: '3',
      type: 'info' as const,
      category: 'style' as const,
      file: 'src/models/User.cs',
      line: 12,
      message: 'Consider using more descriptive variable names',
      suggestion: 'Replace variable "u" with "user" for better readability',
      severity: 'low' as const
    }
  ],
  commentsPosted: 3,
  filesAnalyzed: 12
}

const mockDeveloperStats = [
  {
    developer: {
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      githubUrl: "https://github.com/johndoe"
    },
    totalPRsReviewed: 45,
    commonIssues: [
      {
        type: "SQL Injection Vulnerabilities",
        count: 8,
        percentage: 65,
        trend: 'down' as const,
        examples: ["AuthService.cs", "UserRepository.cs", "ProductService.cs"]
      },
      {
        type: "Performance Issues",
        count: 12,
        percentage: 45,
        trend: 'stable' as const,
        examples: ["N+1 queries", "Inefficient loops", "Large object allocation"]
      },
      {
        type: "Code Style Violations",
        count: 15,
        percentage: 35,
        trend: 'down' as const,
        examples: ["Naming conventions", "Method length", "Cyclomatic complexity"]
      }
    ],
    improvementAreas: ["Security Best Practices", "Database Optimization", "Error Handling"],
    strengths: ["Clean Architecture", "Unit Testing", "Documentation"],
    lastAnalyzed: "2 hours ago",
    overallScore: 78,
    scoreHistory: [
      { date: "Mon", score: 72 },
      { date: "Tue", score: 75 },
      { date: "Wed", score: 73 },
      { date: "Thu", score: 78 },
      { date: "Fri", score: 80 },
      { date: "Sat", score: 78 },
      { date: "Sun", score: 82 }
    ]
  },
  {
    developer: {
      name: "Sarah Smith",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100&h=100&fit=crop&crop=face",
      githubUrl: "https://github.com/sarahsmith"
    },
    totalPRsReviewed: 32,
    commonIssues: [
      {
        type: "Memory Leaks",
        count: 5,
        percentage: 25,
        trend: 'up' as const,
        examples: ["EventHandler subscriptions", "IDisposable not implemented"]
      },
      {
        type: "Exception Handling",
        count: 7,
        percentage: 35,
        trend: 'down' as const,
        examples: ["Swallowed exceptions", "Generic catch blocks"]
      }
    ],
    improvementAreas: ["Memory Management", "Async/Await Patterns"],
    strengths: ["API Design", "Refactoring", "Performance Optimization"],
    lastAnalyzed: "1 day ago",
    overallScore: 85,
    scoreHistory: [
      { date: "Mon", score: 82 },
      { date: "Tue", score: 84 },
      { date: "Wed", score: 86 },
      { date: "Thu", score: 85 },
      { date: "Fri", score: 87 },
      { date: "Sat", score: 85 },
      { date: "Sun", score: 88 }
    ]
  }
]

const mockRecentAnalyses = [
  {
    id: '1',
    prUrl: 'https://github.com/example/repo/pull/123',
    title: 'Add user authentication feature',
    author: 'john.doe',
    timestamp: '2 hours ago',
    status: 'completed' as const,
    score: 78,
    issuesFound: 3
  },
  {
    id: '2',
    prUrl: 'https://github.com/example/repo/pull/124',
    title: 'Fix payment processing bug',
    author: 'sarah.smith',
    timestamp: '4 hours ago',
    status: 'completed' as const,
    score: 92,
    issuesFound: 1
  },
  {
    id: '3',
    prUrl: 'https://github.com/example/repo/pull/125',
    title: 'Implement new dashboard features',
    author: 'mike.wilson',
    timestamp: '6 hours ago',
    status: 'analyzing' as const,
    score: 0,
    issuesFound: 0
  }
]

const mockTeamStats = {
  totalPRsAnalyzed: 156,
  avgScore: 82,
  totalIssuesFound: 234,
  totalCommentsPosted: 187,
  avgAnalysisTime: '2.3 min',
  activeReviewers: 8
}

const mockWeeklyTrends = {
  prsAnalyzed: 23,
  scoreImprovement: 4.2,
  issuesDecreased: 12
}

export default function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState<typeof mockAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyzePR = async (prUrl: string) => {
    setIsAnalyzing(true)
    setCurrentAnalysis(null)
    
    // Simulate analysis delay
    setTimeout(() => {
      setCurrentAnalysis({
        ...mockAnalysisResult,
        prUrl
      })
      setIsAnalyzing(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1>Automated PR Reviewer</h1>
              <p className="text-muted-foreground">
                AI-powered code review with Roslyn analyzer integration
              </p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="analyze" className="gap-2">
              <GitPullRequest className="h-4 w-4" />
              Analyze PR
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Developer Stats
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="h-4 w-4" />
              Team Overview
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <SettingsIcon className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard 
              recentAnalyses={mockRecentAnalyses}
              teamStats={mockTeamStats}
              weeklyTrends={mockWeeklyTrends}
            />
          </TabsContent>

          <TabsContent value="analyze" className="space-y-8">
            <div className="flex justify-center">
              <PRInputForm onAnalyze={handleAnalyzePR} isAnalyzing={isAnalyzing} />
            </div>
            
            {isAnalyzing && (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 text-muted-foreground">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span>Running Roslyn analyzer and security scans...</span>
                </div>
              </div>
            )}
            
            {currentAnalysis && !isAnalyzing && (
              <AnalysisResults result={currentAnalysis} />
            )}
          </TabsContent>

          <TabsContent value="stats">
            <DeveloperStats stats={mockDeveloperStats} />
          </TabsContent>

          <TabsContent value="team">
            <Dashboard 
              recentAnalyses={mockRecentAnalyses}
              teamStats={mockTeamStats}
              weeklyTrends={mockWeeklyTrends}
            />
          </TabsContent>

          <TabsContent value="settings">
            <Settings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}