import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Settings as SettingsIcon, 
  Github, 
  Key, 
  Bell, 
  Shield, 
  Code, 
  Users,
  Save,
  TestTube,
  AlertTriangle
} from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'

export function Settings() {
  const [githubToken, setGithubToken] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [analysisConfig, setAnalysisConfig] = useState({
    enableRoslynAnalyzer: true,
    enableSecurityScan: true,
    enablePerformanceCheck: true,
    enableStyleCheck: true,
    autoPostComments: true,
    notifyOnCompletion: true,
    severityThreshold: 'medium'
  })
  
  const [teamConfig, setTeamConfig] = useState({
    trackDeveloperStats: true,
    generateReports: true,
    allowPublicRepos: false,
    requireApproval: true
  })

  const handleSave = () => {
    // Mock save functionality
    console.log('Settings saved:', { githubToken, webhookUrl, analysisConfig, teamConfig })
  }

  const testConnection = () => {
    // Mock connection test
    console.log('Testing GitHub connection...')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Settings & Configuration
          </CardTitle>
          <CardDescription>
            Configure your automated PR reviewer settings and integrations
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="github" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="github">GitHub Integration</TabsTrigger>
          <TabsTrigger value="analysis">Analysis Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
        </TabsList>

        <TabsContent value="github" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                GitHub Integration
              </CardTitle>
              <CardDescription>
                Configure GitHub API access and webhook settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="github-token" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  GitHub Personal Access Token
                </Label>
                <Input
                  id="github-token"
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Required permissions: repo, pull_requests, write:discussion
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL (Optional)</Label>
                <Input
                  id="webhook-url"
                  type="url"
                  placeholder="https://your-server.com/webhook"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Automatically trigger analysis on new PRs
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={testConnection} variant="outline" className="gap-2">
                  <TestTube className="h-4 w-4" />
                  Test Connection
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save GitHub Settings
                </Button>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your GitHub token is encrypted and stored securely. It's only used to access PR data and post comments.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Analysis Configuration
              </CardTitle>
              <CardDescription>
                Configure which analyzers and checks to run on PRs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Roslyn Analyzer</Label>
                    <p className="text-sm text-muted-foreground">
                      Static code analysis for C# and .NET projects
                    </p>
                  </div>
                  <Switch 
                    checked={analysisConfig.enableRoslynAnalyzer}
                    onCheckedChange={(checked) => 
                      setAnalysisConfig(prev => ({ ...prev, enableRoslynAnalyzer: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Security Scanning</Label>
                    <p className="text-sm text-muted-foreground">
                      Detect potential security vulnerabilities
                    </p>
                  </div>
                  <Switch 
                    checked={analysisConfig.enableSecurityScan}
                    onCheckedChange={(checked) => 
                      setAnalysisConfig(prev => ({ ...prev, enableSecurityScan: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Performance Analysis</Label>
                    <p className="text-sm text-muted-foreground">
                      Identify performance bottlenecks and inefficiencies
                    </p>
                  </div>
                  <Switch 
                    checked={analysisConfig.enablePerformanceCheck}
                    onCheckedChange={(checked) => 
                      setAnalysisConfig(prev => ({ ...prev, enablePerformanceCheck: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Code Style Checks</Label>
                    <p className="text-sm text-muted-foreground">
                      Ensure consistent coding standards and formatting
                    </p>
                  </div>
                  <Switch 
                    checked={analysisConfig.enableStyleCheck}
                    onCheckedChange={(checked) => 
                      setAnalysisConfig(prev => ({ ...prev, enableStyleCheck: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Minimum Severity Level</Label>
                  <Select 
                    value={analysisConfig.severityThreshold}
                    onValueChange={(value) => 
                      setAnalysisConfig(prev => ({ ...prev, severityThreshold: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Only issues at or above this severity level will be reported
                  </p>
                </div>
              </div>

              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Analysis Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Auto-post Comments</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically post analysis results as PR comments
                    </p>
                  </div>
                  <Switch 
                    checked={analysisConfig.autoPostComments}
                    onCheckedChange={(checked) => 
                      setAnalysisConfig(prev => ({ ...prev, autoPostComments: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Analysis Completion Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when PR analysis is complete
                    </p>
                  </div>
                  <Switch 
                    checked={analysisConfig.notifyOnCompletion}
                    onCheckedChange={(checked) => 
                      setAnalysisConfig(prev => ({ ...prev, notifyOnCompletion: checked }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notification Channels</Label>
                <div className="flex gap-2">
                  <Badge variant="outline">Email</Badge>
                  <Badge variant="outline">Slack</Badge>
                  <Badge variant="secondary">GitHub Comments</Badge>
                </div>
              </div>

              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Management
              </CardTitle>
              <CardDescription>
                Configure team settings and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Track Developer Statistics</Label>
                    <p className="text-sm text-muted-foreground">
                      Monitor individual developer patterns and improvements
                    </p>
                  </div>
                  <Switch 
                    checked={teamConfig.trackDeveloperStats}
                    onCheckedChange={(checked) => 
                      setTeamConfig(prev => ({ ...prev, trackDeveloperStats: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Generate Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Create weekly and monthly team performance reports
                    </p>
                  </div>
                  <Switch 
                    checked={teamConfig.generateReports}
                    onCheckedChange={(checked) => 
                      setTeamConfig(prev => ({ ...prev, generateReports: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Allow Public Repositories</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable analysis of public GitHub repositories
                    </p>
                  </div>
                  <Switch 
                    checked={teamConfig.allowPublicRepos}
                    onCheckedChange={(checked) => 
                      setTeamConfig(prev => ({ ...prev, allowPublicRepos: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Require Manual Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Require approval before posting comments to PRs
                    </p>
                  </div>
                  <Switch 
                    checked={teamConfig.requireApproval}
                    onCheckedChange={(checked) => 
                      setTeamConfig(prev => ({ ...prev, requireApproval: checked }))
                    }
                  />
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Changes to team settings may affect existing analysis workflows and require team member approval.
                </AlertDescription>
              </Alert>

              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Team Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}