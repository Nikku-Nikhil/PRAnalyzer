import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  Activity,
  GitPullRequest,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Shield,
  Code,
  Zap,
  BarChart3,
  Calendar,
  ExternalLink,
  TrendingDown,
  Clock,
} from "lucide-react";
import { axiosClient } from "../config/axiosClient";
import { AnalysisResults } from "./AnalysisResults";
import { Modal } from "./Modal/Modal";
import { toast } from "sonner";

interface DashboardProps {
  recentAnalyses: Array<{
    id: string;
    prUrl: string;
    title: string;
    author: string;
    timestamp: string;
    status: "completed" | "failed" | "analyzing";
    score: number;
    issuesFound: number;
  }>;
  teamStats: {
    totalPRsAnalyzed: number;
    avgScore: number;
    totalIssuesFound: number;
    totalCommentsPosted: number;
    avgAnalysisTime: string;
    activeReviewers: number;
  };
  weeklyTrends: {
    prsAnalyzed: number;
    scoreImprovement: number;
    issuesDecreased: number;
  };
  issueDomainsScore?: Array<{
    domainId: number;
    domainName: string;
    score: number;
    issuesCount: number;
  }>;
  onError?: (message: string, onRetry: () => void) => void;
}

const glassCard: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
  backdropFilter: "blur(20px) saturate(180%) brightness(1.1)",
  WebkitBackdropFilter: "blur(20px) saturate(180%) brightness(1.1)",
  border: "1px solid rgba(255,255,255,0.13)",
  borderTop: "1px solid rgba(255,255,255,0.22)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
  borderRadius: 16,
};

const domainMeta: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  security:    { icon: Shield, color: "#4f7cff", bg: "rgba(79,124,255,0.12)" },
  performance: { icon: Zap,    color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  style:       { icon: Code,   color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  reliability: { icon: Activity, color: "#34d399", bg: "rgba(52,211,153,0.12)" },
};

export function Dashboard({
  recentAnalyses,
  teamStats,
  weeklyTrends,
  issueDomainsScore,
  onError,
}: DashboardProps) {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 4;

  const [selectedAnalysis, setSelectedAnalysis] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#34d399";
    if (score >= 60) return "#f59e0b";
    return "#f87171";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle style={{ width: 14, height: 14, color: "#34d399" }} />;
      case "failed":    return <AlertTriangle style={{ width: 14, height: 14, color: "#f87171" }} />;
      case "analyzing": return <Clock style={{ width: 14, height: 14, color: "#4f7cff" }} />;
      default: return <Clock style={{ width: 14, height: 14 }} />;
    }
  };

  const handleViewAnalysis = async (prId: string) => {
    try {
      setLoadingAnalysis(true);
      const response = await axiosClient.get(`/api/pr/${prId}`);
      setSelectedAnalysis(response.data);
      setIsModalOpen(true);
    } catch {
      toast.info("Using mock details (backend offline)");
      const id = parseInt(prId);
      const mockResult = {
        prUrl: "https://github.com/company/repo/pull/402",
        title: id === 1 ? "Optimize database indexing for users search"
          : id === 2 ? "Refactor auth middleware validation flow"
          : id === 3 ? "Implement generic error handling boundaries"
          : "Fix memory leak in web socket listener subscriptions",
        author: id === 1 ? "alex.chen" : id === 2 ? "sarah.smith" : id === 3 ? "john.nikhil" : "sarah.smith",
        status: "completed" as const,
        overallScore: id === 1 ? 88 : id === 2 ? 65 : id === 3 ? 92 : 78,
        filesAnalyzed: id === 1 ? 4 : id === 2 ? 11 : id === 3 ? 2 : 5,
        commentsPosted: id === 1 ? 2 : id === 2 ? 6 : id === 3 ? 0 : 3,
        metrics: [
          { type: "Code Quality",  percentage: id === 1 ? 90 : id === 2 ? 68 : id === 3 ? 95 : 80 },
          { type: "Security Scan", percentage: id === 1 ? 95 : id === 2 ? 72 : id === 3 ? 98 : 85 },
          { type: "Performance",   percentage: id === 1 ? 75 : id === 2 ? 55 : id === 3 ? 90 : 70 },
          { type: "Maintainability", percentage: id === 1 ? 92 : id === 2 ? 65 : id === 3 ? 94 : 78 },
        ],
        issues: id === 3 ? [] : [
          { id: "d1", type: "error" as const, category: "security" as const, file: "src/Middleware/AuthValidation.cs", line: 55, message: "JWT verification: Signature lifetime validation disabled.", suggestion: "Set ValidateLifetime = true.", severity: "high" as const },
          { id: "d2", type: "warning" as const, category: "style" as const, file: "src/Utils/Helper.cs", line: 12, message: "Unused parameters in method signature.", suggestion: "Clean up signature or use standard discard patterns.", severity: "low" as const },
        ],
      };
      setSelectedAnalysis(mockResult);
      setIsModalOpen(true);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const statCards = [
    {
      label: "PRs Analyzed",
      value: teamStats.totalPRsAnalyzed,
      suffix: "",
      trend: `+${weeklyTrends.prsAnalyzed} this week`,
      trendUp: true,
      icon: GitPullRequest,
      iconColor: "#4f7cff",
      iconBg: "rgba(79,124,255,0.15)",
    },
    {
      label: "Average Score",
      value: teamStats.avgScore,
      suffix: "%",
      trend: `${weeklyTrends.scoreImprovement > 0 ? "+" : ""}${weeklyTrends.scoreImprovement}% this week`,
      trendUp: weeklyTrends.scoreImprovement > 0,
      icon: BarChart3,
      iconColor: "#34d399",
      iconBg: "rgba(52,211,153,0.15)",
    },
    {
      label: "Issues Found",
      value: teamStats.totalIssuesFound,
      suffix: "",
      trend: `${weeklyTrends.issuesDecreased > 0 ? "+" : ""}${weeklyTrends.issuesDecreased} this week`,
      trendUp: weeklyTrends.issuesDecreased < 0,
      icon: AlertTriangle,
      iconColor: "#f59e0b",
      iconBg: "rgba(245,158,11,0.15)",
    },
    {
      label: "Active Reviewers",
      value: teamStats.activeReviewers,
      suffix: "",
      trend: `Avg ${teamStats.avgAnalysisTime}`,
      trendUp: true,
      icon: Users,
      iconColor: "#a78bfa",
      iconBg: "rgba(167,139,250,0.15)",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {loadingAnalysis ? (
          <div style={{ padding: 80, textAlign: "center", color: "rgba(255,255,255,0.5)" }}>Loading analysis…</div>
        ) : (
          selectedAnalysis && <AnalysisResults result={selectedAnalysis} />
        )}
      </Modal>

      {/* ── Stat Cards Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              style={{
                ...glassCard,
                padding: "20px 22px",
                transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)";
                el.style.borderColor = "rgba(255,255,255,0.22)";
                el.style.borderTop = "1px solid rgba(255,255,255,0.38)";
                el.style.boxShadow = "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)";
                el.style.borderColor = "rgba(255,255,255,0.13)";
                el.style.borderTop = "1px solid rgba(255,255,255,0.22)";
                el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)";
                el.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                    {card.label}
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                    {card.value}{card.suffix}
                  </div>
                </div>
                <div style={{ padding: 10, borderRadius: 10, background: card.iconBg, border: `1px solid ${card.iconColor}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon style={{ width: 18, height: 18, color: card.iconColor }} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                {card.trendUp
                  ? <TrendingUp style={{ width: 12, height: 12, color: "#34d399" }} />
                  : <TrendingDown style={{ width: 12, height: 12, color: "#f87171" }} />
                }
                <span style={{ color: card.trendUp ? "#34d399" : "#f87171" }}>{card.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 2-Column Body ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>

        {/* Left: Team Performance */}
        <div style={{ ...glassCard, padding: "24px 26px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Activity style={{ width: 16, height: 16, color: "#4f7cff" }} />
            <span style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>Team Performance Overview</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 22 }}>
            Code quality metrics across all analyzed PRs
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {(issueDomainsScore && issueDomainsScore.length > 0
              ? issueDomainsScore
              : []
            ).map(({ domainName, score }, i) => {
              const meta = domainMeta[domainName.toLowerCase()] ?? { icon: Activity, color: "#4f7cff", bg: "rgba(79,124,255,0.12)" };
              const DomainIcon = meta.icon;
              return (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ padding: 5, borderRadius: 7, background: meta.bg, display: "flex" }}>
                        <DomainIcon style={{ width: 13, height: 13, color: meta.color }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#fff", textTransform: "capitalize" }}>{domainName}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: meta.color }}>{score}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${score}%`, background: `linear-gradient(90deg, ${meta.color}99, ${meta.color})`, borderRadius: 999, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Recent Activity */}
        <div style={{ ...glassCard, padding: "24px 22px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Calendar style={{ width: 16, height: 16, color: "#4f7cff" }} />
              <span style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>Recent Activity</span>
            </div>
            {recentAnalyses.length > INITIAL_COUNT && (
              <button
                onClick={() => setShowAll(p => !p)}
                style={{ fontSize: 11, color: "#4f7cff", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}
              >
                {showAll ? "Less" : "View All"}
              </button>
            )}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 18 }}>Latest PR reviews</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
            {recentAnalyses
              .slice(0, showAll ? recentAnalyses.length : INITIAL_COUNT)
              .map((analysis) => (
                <div
                  key={analysis.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderLeft: `3px solid ${getScoreColor(analysis.score)}`,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  }}
                >
                  {getStatusIcon(analysis.status)}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{analysis.title}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                      {analysis.author} · {analysis.timestamp}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    {analysis.status === "completed" && (
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: getScoreColor(analysis.score) }}>{analysis.score}%</div>
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{analysis.issuesFound} issues</div>
                      </div>
                    )}
                    <button
                      onClick={() => handleViewAnalysis(analysis.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 4,
                        padding: "4px 8px", borderRadius: 6,
                        background: "rgba(79,124,255,0.12)",
                        border: "1px solid rgba(79,124,255,0.25)",
                        color: "#4f7cff", fontSize: 10, fontWeight: 500,
                        cursor: "pointer", fontFamily: "inherit",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(79,124,255,0.25)";
                        e.currentTarget.style.borderColor = "rgba(79,124,255,0.45)";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(79,124,255,0.12)";
                        e.currentTarget.style.borderColor = "rgba(79,124,255,0.25)";
                        e.currentTarget.style.color = "#4f7cff";
                      }}
                    >
                      <ExternalLink style={{ width: 10, height: 10 }} />
                      View
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
