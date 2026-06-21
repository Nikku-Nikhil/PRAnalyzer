import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Code,
  Shield,
  Zap,
  FileText,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { Button } from "./ui/button";

export interface AnalysisResult {
  prUrl: string;
  title: string;
  author: string;
  status: "analyzing" | "completed" | "failed";
  overallScore: number;
  metrics: {
    codeQuality: number;
    security: number;
    performance: number;
    maintainability: number;
  };
  issues: Array<{
    id: string;
    type: "error" | "warning" | "info";
    category: "quality" | "security" | "performance" | "style";
    file: string;
    line: number;
    message: string;
    suggestion: string;
    severity: "high" | "medium" | "low";
  }>;
  commentsPosted: number;
  filesAnalyzed: number;
}

interface AnalysisResultsProps {
  result: AnalysisResult | null;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  if (!result) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "quality":
        return <Code className="h-4 w-4" />;
      case "security":
        return <Shield className="h-4 w-4" />;
      case "performance":
        return <Zap className="h-4 w-4" />;
      case "style":
        return <FileText className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };

  const errorCount = result.issues.filter(
    (issue) => issue.type === "error"
  ).length;
  const warningCount = result.issues.filter(
    (issue) => issue.type === "warning"
  ).length;
  const infoCount = result.issues.filter(
    (issue) => issue.type === "info"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Analysis Results
              </CardTitle>
              <CardDescription>
                {result.title} by {result.author}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <FileText className="h-3 w-3" />
                {result.filesAnalyzed} files
              </Badge>
              <Badge variant="outline" className="gap-1">
                <MessageSquare className="h-3 w-3" />
                {result.commentsPosted} comments posted
              </Badge>
              {/* <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="h-3 w-3" />
                View PR
              </Button> */}
              <Button 
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => window.open(result.prUrl, "_blank")}
              >
              <ExternalLink className="h-3 w-3" />
              View PR
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${getScoreColor(
                  result.overallScore
                )}`}
              >
                {result.overallScore}%
              </div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {errorCount}
              </div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {warningCount}
              </div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {infoCount}
              </div>
              <div className="text-sm text-muted-foreground">Info</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.metrics.map((data, index) => {
              return (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      {data?.type}
                    </span>
                    <span className={getScoreColor(data?.percentage)}>
                      {data?.percentage}%
                    </span>
                  </div>
                  <Progress value={data?.percentage} className="h-2" />
                </div>
              );
            })} 
          </div>
        </CardContent>
      </Card>

      {/* Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Detected Issues</CardTitle>
          <CardDescription>
            Issues found during code analysis with suggested fixes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                All ({result.issues.length})
              </TabsTrigger>
              <TabsTrigger value="error">Errors ({errorCount})</TabsTrigger>
              <TabsTrigger value="warning">
                Warnings ({warningCount})
              </TabsTrigger>
              <TabsTrigger value="info">Info ({infoCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-4">
              {result.issues.map((issue) => (
                <Alert key={issue.id} className="p-4">
                  <div className="flex items-start gap-3">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(issue.category)}
                        <span className="font-medium">
                          {issue.file}:{issue.line}
                        </span>
                        {/* <Badge
                          variant={
                            issue.severity === "high"
                              ? "destructive"
                              : issue.severity === "medium"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {issue.severity}
                        </Badge> */}
                      </div>
                      <AlertDescription>
                        <strong>Issue:</strong> {issue.message}
                      </AlertDescription>
                      {/* <AlertDescription className="text-green-700">
                        <strong>Suggestion:</strong> {issue.suggestion}
                      </AlertDescription> */}
                    </div>
                  </div>
                </Alert>
              ))}
            </TabsContent>

            <TabsContent value="error" className="space-y-3 mt-4">
              {result.issues
                .filter((issue) => issue.type === "error")
                .map((issue) => (
                  <Alert key={issue.id} variant="destructive" className="p-4">
                    <div className="flex items-start gap-3">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(issue.category)}
                          <span className="font-medium">
                            {issue.file}:{issue.line}
                          </span>
                          {/* <Badge variant="destructive">{issue.severity}</Badge> */}
                        </div>
                        <AlertDescription>
                          <strong>Error:</strong> {issue.message}
                        </AlertDescription>
                        {/* <AlertDescription>
                          <strong>Fix:</strong> {issue.suggestion}
                        </AlertDescription> */}
                      </div>
                    </div>
                  </Alert>
                ))}
            </TabsContent>

            <TabsContent value="warning" className="space-y-3 mt-4">
              {result.issues
                .filter((issue) => issue.type === "warning")
                .map((issue) => (
                  <Alert key={issue.id} className="p-4">
                    <div className="flex items-start gap-3">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(issue.category)}
                          <span className="font-medium">
                            {issue.file}:{issue.line}
                          </span>
                          {/* <Badge variant="outline">{issue.severity}</Badge> */}
                        </div>
                        <AlertDescription>
                          <strong>Warning:</strong> {issue.message}
                        </AlertDescription>
                        {/* <AlertDescription className="text-green-700">
                          <strong>Recommendation:</strong> {issue.suggestion}
                        </AlertDescription> */}
                      </div>
                    </div>
                  </Alert>
                ))}
            </TabsContent>

            <TabsContent value="info" className="space-y-3 mt-4">
              {result.issues
                .filter((issue) => issue.type === "info")
                .map((issue) => (
                  <Alert key={issue.id} className="p-4">
                    <div className="flex items-start gap-3">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(issue.category)}
                          <span className="font-medium">
                            {issue.file}:{issue.line}
                          </span>
                          {/* <Badge variant="secondary">{issue.severity}</Badge> */}
                        </div>
                        <AlertDescription>
                          <strong>Info:</strong> {issue.message}
                        </AlertDescription>
                        {/* <AlertDescription className="text-blue-700">
                          <strong>Tip:</strong> {issue.suggestion}
                        </AlertDescription> */}
                      </div>
                    </div>
                  </Alert>
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
