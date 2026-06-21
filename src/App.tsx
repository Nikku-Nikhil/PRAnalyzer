import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Button } from './components/ui/button'
import { PRInputForm } from './components/PRInputForm'
import { AnalysisResults, type AnalysisResult } from './components/AnalysisResults'
import { DeveloperStats } from './components/DeveloperStats'
import { Dashboard } from './components/Dashboard'
import { Settings } from './components/Settings'
import {
  LayoutDashboard,
  GitPullRequest,
  BarChart3,
  Users,
  Settings as SettingsIcon,
  Bot,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { API_BASE_URL } from './config/api'
import { axiosClient } from './config/axiosClient'
import Loader from './components/Loader/Loader'
import { Toaster } from './components/ui/sonner'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from './components/ui/alert-dialog'

// Mock data for demonstration
// const mockAnalysisResult = {
//   prUrl: "https://github.com/example/repo/pull/123",
//   title: "Add user authentication feature",
//   author: "john.doe",
//   status: 'completed' as const,
//   overallScore: 78,
//   metrics:  [
//     {
//       "type": "Code Quality",
//       "percentage": 100
//     },
//     {
//       "type": "Inkjfdahkjs",
//       "percentage": 46
//     }
//   ],
//   issues: [
//     {
//       id: '1',
//       type: 'error' as const,
//       category: 'security' as const,
//       file: 'src/auth/AuthService.cs',
//       line: 45,
//       message: 'Potential SQL injection vulnerability in user login query',
//       // suggestion: 'Use parameterized queries or ORM to prevent SQL injection attacks',
//       // severity: 'high' as const
//     },
//     {
//       id: '2',
//       type: 'error' as const,
//       category: 'performance' as const,
//       file: 'src/controllers/UserController.cs',
//       line: 23,
//       message: 'N+1 query problem detected in user data loading',
//       // suggestion: 'Use eager loading with Include() to reduce database roundtrips',
//       // severity: 'medium' as const
//     },
//     {
//       id: '3',
//       type: 'hidden' as const,
//       category: 'style' as const,
//       file: 'src/models/User.cs',
//       line: 12,
//       message: 'Consider using more descriptive variable names',
//       // suggestion: 'Replace variable "u" with "user" for better readability',
//       // severity: 'low' as const
//     }
//   ],
//   commentsPosted: 3,
//   filesAnalyzed: 12
// }

// const mockDeveloperStats = [
//   {
//     developer: {
//       name: "John Nikhil",
//       avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
//       githubUrl: "https://github.com/johndoe"
//     },
//     totalPRsReviewed: 45,
//     commonIssues: [
//       {
//         type: "SQL Injection Vulnerabilities",
//         count: 8,
//         percentage: 65,
//         trend: 'down' as const,
//         examples: ["AuthService.cs", "UserRepository.cs", "ProductService.cs"]
//       },
//       {
//         type: "Performance Issues",
//         count: 12,
//         percentage: 45,
//         trend: 'stable' as const,
//         examples: ["N+1 queries", "Inefficient loops", "Large object allocation"]
//       },
//       {
//         type: "Code Style Violations",
//         count: 15,
//         percentage: 35,
//         trend: 'down' as const,
//         examples: ["Naming conventions", "Method length", "Cyclomatic complexity"]
//       }
//     ],
//     improvementAreas: ["Security Best Practices", "Database Optimization", "Error Handling"],
//     strengths: ["Clean Architecture", "Unit Testing", "Documentation"],
//     lastAnalyzed: "2 hours ago",
//     overallScore: 78,
//     scoreHistory: [
//       { date: "Mon", score: 72 },
//       { date: "Mon", score: 72 },
//         { date: "Mon", score: 72 },
//           { date: "Mon", score: 72 },
//       { date: "Tue", score: 75 },
//       { date: "Wed", score: 73 },
//       { date: "Thu", score: 78 },
//       { date: "Fri", score: 80 },
//       { date: "Sat", score: 78 },
//       { date: "Sun", score: 82 }
//     ]
//   },
//   {
//     developer: {
//       name: "Sarah Smith",
//       avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100&h=100&fit=crop&crop=face",
//       githubUrl: "https://github.com/sarahsmith"
//     },
//     totalPRsReviewed: 32,
//     commonIssues: [
//       {
//         type: "Memory Leaks",
//         count: 5,
//         percentage: 25,
//         trend: 'up' as const,
//         examples: ["EventHandler subscriptions", "IDisposable not implemented"]
//       },
//       {
//         type: "Exception Handling",
//         count: 7,
//         percentage: 35,
//         trend: 'down' as const,
//         examples: ["Swallowed exceptions", "Generic catch blocks"]
//       }
//     ],
//     improvementAreas: ["Memory Management", "Async/Await Patterns"],
//     strengths: ["API Design", "Refactoring", "Performance Optimization"],
//     lastAnalyzed: "1 day ago",
//     overallScore: 85,
//     scoreHistory: [
//       { date: "Mon", score: 82 },
//       { date: "Tue", score: 84 },
//       { date: "Wed", score: 86 },
//       { date: "Thu", score: 85 },
//       { date: "Fri", score: 87 },
//       { date: "Sat", score: 85 },
//       { date: "Sun", score: 88 }
//     ]
//   }
// ]


export default function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dashboardError, setDashboardError] = useState<string | null>(null)
  const [mockTeamStats, setMockTeamStats] = useState<any>({})
  const [mockWeeklyTrends, setMockWeeklyTrends] = useState<any>({})
  const [mockRecentAnalyses, setMockRecentAnalyses] = useState<any[]>([])
  const [mockIssueDomainsScore, setMockIssueDomainsScore] = useState<any[]>([])
  const [mockDeveloperStats, setMockDeveloperStats] = useState<any[]>([])
  const [errorDialog, setErrorDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    onRetry: () => void;
  }>({
    open: false,
    title: "",
    message: "",
    onRetry: () => { },
  });

  async function fetchTeamStats() {
    const response = await axiosClient.get("/api/dashboard/team-stats");
    return response.data;
  }

  async function fetchWeeklyTrends() {
    const response = await axiosClient.get("/api/dashboard/weekly-trends");
    return response.data;
  }

  async function fetchRecentAnalyses() {
    const response = await axiosClient.get("/api/dashboard/recent-analyses");
    return response.data;
  }

  async function fetchIssueDomainsScore() {
    const response = await axiosClient.get("/api/dashboard/issue-domain-scores");
    return response.data;
  }

  async function fetchDeveloperStats() {
    const response = await axiosClient.get("/api/DeveloperStats/all");
    return response.data;
  }

  async function startAnalysisOnPr(prUrl: string) {
    const response = await axiosClient.post("/api/pr/analyze", {
      prUrl
    });
    return response.data;
  }

  async function loadDashboardData() {
    setIsLoading(true)
    setDashboardError(null)
    try {
      const [stats, trends, recent, issueDomainScores, developerStatsData] = await Promise.all([
        fetchTeamStats(),
        fetchWeeklyTrends(),
        fetchRecentAnalyses(),
        fetchIssueDomainsScore(),
        fetchDeveloperStats()
      ]);

      setMockTeamStats(stats)
      setMockWeeklyTrends(trends)
      setMockRecentAnalyses(recent)
      setMockIssueDomainsScore(issueDomainScores)
      setMockDeveloperStats(developerStatsData)
    } catch (err: any) {
      console.error("Failed to load dashboard data:", err);
      toast.error("Could not connect to the API. Please make sure the backend is running.");
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, [])

  const handleAnalyzePR = async (prUrl: string) => {
    setIsAnalyzing(true)
    setCurrentAnalysis(null)
    try {
      const data = await startAnalysisOnPr(prUrl)
      setCurrentAnalysis({
        ...data,
        prUrl
      })
      toast.success("PR analyzed successfully!")
    } catch (err: any) {
      console.error("PR analysis failed:", err);
      let message = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Unknown error";
      if (typeof message === 'object') {
        message = JSON.stringify(message);
      }
      toast.error(`Analysis failed: ${message}`);
    } finally {
      setIsAnalyzing(false)
    }
  }


  const [activeTab, setActiveTab] = useState<'dashboard' | 'analyze' | 'stats'>('dashboard')

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze' as const, label: 'Analyze PR', icon: GitPullRequest },
    { id: 'stats' as const, label: 'Dev Stats', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-background flex">

      {/* ── Left Sidebar ── */}
      <aside
        style={{
          width: 220,
          minHeight: '100vh',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 12px',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, paddingLeft: 8 }}>
          <div style={{
            padding: 8,
            borderRadius: 10,
            background: 'rgba(79,124,255,0.15)',
            border: '1px solid rgba(79,124,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Bot style={{ width: 20, height: 20, color: '#4f7cff' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', lineHeight: 1.2 }}>PR Reviewer</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>AI-powered</div>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(79,124,255,0.2) 0%, rgba(79,124,255,0.08) 100%)'
                    : 'transparent',
                  borderLeft: isActive ? '2px solid #4f7cff' : '2px solid transparent',
                  boxShadow: isActive ? '0 2px 12px rgba(79,124,255,0.15)' : 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)'
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'
                      (e.currentTarget as HTMLElement).style.background = 'transparent'
                  }
                }}
              >
                <Icon style={{ width: 16, height: 16, flexShrink: 0, color: isActive ? '#4f7cff' : 'inherit' }} />
                {label}
              </button>
            )
          })}
        </nav>

        {/* Bottom badge */}
        <div style={{ marginTop: 'auto', paddingTop: 24, paddingLeft: 8 }}>
          <div style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.25)',
            lineHeight: 1.5,
          }}>
            Code review analyzer<br />v1.0.0
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ marginLeft: 220, flex: 1, minHeight: '100vh', padding: '32px 32px 48px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'analyze' && 'Analyze Pull Request'}
            {activeTab === 'stats' && 'Developer Statistics'}
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
            {activeTab === 'dashboard' && 'Overview of team performance and recent activity'}
            {activeTab === 'analyze' && 'Submit a GitHub PR URL for automated code review'}
            {activeTab === 'stats' && 'Track recurring issues and improvement patterns'}
          </p>
        </div>

        {isLoading ? (
          <div style={{ height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Loader />
          </div>
        ) : dashboardError ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 max-w-xl mx-auto text-center">
            <div className="relative p-8 bg-card/40 border border-destructive/25 rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-transparent pointer-events-none" />
              <div className="inline-flex items-center justify-center p-4 bg-destructive/10 rounded-full mb-6 relative">
                <div className="absolute inset-0 bg-destructive/25 rounded-full animate-ping opacity-25" />
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">API Connection Error</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{dashboardError}</p>
              <Button onClick={loadDashboardData} className="inline-flex items-center gap-2 px-6 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-semibold">
                <RefreshCw className="h-4 w-4" /> Retry Connection
              </Button>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                recentAnalyses={mockRecentAnalyses}
                teamStats={mockTeamStats}
                weeklyTrends={mockWeeklyTrends}
                issueDomainsScore={mockIssueDomainsScore}
                onError={(message: string, onRetry: () => void) => {
                  setErrorDialog({ open: true, title: 'Error', message: 'something went wrong please try again', onRetry })
                }}
              />
            )}

            {activeTab === 'analyze' && (
              <div className="space-y-8">
                <PRInputForm onAnalyze={handleAnalyzePR} isAnalyzing={isAnalyzing} />
                {isAnalyzing && (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center gap-3 text-muted-foreground">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                      <span>Analyzing PR…</span>
                    </div>
                  </div>
                )}
                {currentAnalysis && !isAnalyzing && <AnalysisResults result={currentAnalysis} />}
              </div>
            )}

            {activeTab === 'stats' && (
              <DeveloperStats stats={mockDeveloperStats} />
            )}
          </>
        )}
      </main>

      {/* Error Dialog */}
      <AlertDialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent className="bg-card/90 border border-destructive/25 backdrop-blur-xl shadow-2xl rounded-2xl max-w-md p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-transparent pointer-events-none" />
          <AlertDialogHeader className="flex flex-col items-center gap-4 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-destructive/10 rounded-full mb-2 relative">
              <div className="absolute inset-0 bg-destructive/25 rounded-full animate-ping opacity-25" />
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-foreground">{errorDialog.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">{errorDialog.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
            <AlertDialogCancel onClick={() => setErrorDialog(prev => ({ ...prev, open: false }))} className="w-full sm:w-auto border bg-background hover:bg-accent rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setErrorDialog(prev => ({ ...prev, open: false })); errorDialog.onRetry() }} className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-semibold">try again</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )
}
