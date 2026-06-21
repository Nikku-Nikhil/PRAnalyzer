import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Progress } from './ui/progress'
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Calendar,
  ArrowRight,
} from 'lucide-react'

interface DeveloperStat {
  developer: { name: string; avatar: string; githubUrl: string }
  totalPRsReviewed: number
  commonIssues: Array<{ type: string; count: number; percentage: number; trend: 'up' | 'down' | 'stable'; examples: string[] }>
  improvementAreas: string[]
  strengths: string[]
  lastAnalyzed: string
  overallScore: number
  scoreHistory: Array<{ date: string; score: number }>
}

interface DeveloperStatsProps { stats: DeveloperStat[] }

const glassCard: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
  backdropFilter: "blur(20px) saturate(180%) brightness(1.1)",
  WebkitBackdropFilter: "blur(20px) saturate(180%) brightness(1.1)",
  border: "1px solid rgba(255,255,255,0.13)",
  borderTop: "1px solid rgba(255,255,255,0.22)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
  borderRadius: 16,
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#34d399' : score >= 60 ? '#f59e0b' : '#f87171'
  const r = 28; const c = 2 * Math.PI * r
  const filled = (score / 100) * c
  return (
    <div style={{ position: 'relative', width: 76, height: 76, flexShrink: 0 }}>
      <svg width={76} height={76} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={38} cy={38} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={6} />
        <circle
          cx={38} cy={38} r={r} fill="none"
          stroke={color} strokeWidth={6}
          strokeDasharray={`${filled} ${c}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}88)`, transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 15, fontWeight: 700, color, lineHeight: 1 }}>{score}%</span>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>score</span>
      </div>
    </div>
  )
}

type ActiveTab = 'overview' | 'patterns' | 'trends'

export function DeveloperStats({ stats }: DeveloperStatsProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview')

  const tabs: { id: ActiveTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'patterns', label: 'Issue Patterns' },
    { id: 'trends',   label: 'Improvement Trends' },
  ]

  const getScoreColor = (score: number) =>
    score >= 80 ? '#34d399' : score >= 60 ? '#f59e0b' : '#f87171'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Sub-tab bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarChart3 style={{ width: 16, height: 16, color: '#4f7cff' }} />
          <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>View mode:</span>
        </div>
        <div style={{
          display: 'inline-flex', gap: 4, padding: 4, borderRadius: 12,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '6px 14px', borderRadius: 8, border: 'none',
                fontSize: 12, fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.45)',
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, rgba(79,124,255,0.3) 0%, rgba(79,124,255,0.12) 100%)'
                  : 'transparent',
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === tab.id ? '0 2px 8px rgba(79,124,255,0.2)' : 'none',
              }}
              onMouseEnter={e => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }
              }}
              onMouseLeave={e => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{
                ...glassCard,
                padding: '24px 26px',
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
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar style={{ width: 42, height: 42, border: '2px solid rgba(79,124,255,0.3)' }}>
                    <AvatarImage src={stat.developer.avatar} />
                    <AvatarFallback style={{ background: 'rgba(79,124,255,0.15)', color: '#4f7cff', fontWeight: 700, fontSize: 13 }}>
                      {stat.developer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>{stat.developer.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                      {stat.totalPRsReviewed} PRs · {stat.lastAnalyzed}
                    </div>
                  </div>
                </div>
                <ScoreRing score={stat.overallScore} />
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 18 }} />

              {/* Strengths + Areas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#34d399', marginBottom: 10 }}>
                    <CheckCircle style={{ width: 13, height: 13 }} /> Strengths
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {stat.strengths.map((s, idx) => (
                      <span key={idx} style={{
                        fontSize: 10, padding: '3px 8px', borderRadius: 999,
                        background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)',
                        color: '#34d399', fontWeight: 500,
                      }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#f59e0b', marginBottom: 10 }}>
                    <AlertTriangle style={{ width: 13, height: 13 }} /> Improve
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {stat.improvementAreas.map((a, idx) => (
                      <span key={idx} style={{
                        fontSize: 10, padding: '3px 8px', borderRadius: 999,
                        background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
                        color: '#f59e0b', fontWeight: 500,
                      }}>{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Issue Patterns */}
      {activeTab === 'patterns' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{
                ...glassCard,
                padding: '24px 26px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Avatar style={{ width: 36, height: 36 }}>
                  <AvatarImage src={stat.developer.avatar} />
                  <AvatarFallback style={{ background: 'rgba(79,124,255,0.15)', color: '#4f7cff', fontSize: 11, fontWeight: 700 }}>
                    {stat.developer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: 13 }}>{stat.developer.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Issue patterns</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {stat.commonIssues.map((issue, j) => (
                  <div key={j}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#fff' }}>{issue.type}</span>
                        {issue.trend === 'up' && <TrendingUp style={{ width: 12, height: 12, color: '#f87171' }} />}
                        {issue.trend === 'down' && <TrendingDown style={{ width: 12, height: 12, color: '#34d399' }} />}
                      </div>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{issue.count}× ({issue.percentage}%)</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${issue.percentage}%`, background: 'linear-gradient(90deg, #4f7cff88, #4f7cff)', borderRadius: 999 }} />
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
                      e.g. {issue.examples.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Improvement Trends */}
      {activeTab === 'trends' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {stats.map((stat, i) => {
            const hasHistory = stat.scoreHistory && stat.scoreHistory.length > 0;
            const delta = hasHistory
              ? stat.scoreHistory[stat.scoreHistory.length - 1].score - stat.scoreHistory[0].score
              : 0;
            const deltaPositive = delta >= 0;
            return (
              <div
                key={i}
                style={{
                  ...glassCard,
                  padding: '24px 26px',
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar style={{ width: 36, height: 36 }}>
                      <AvatarImage src={stat.developer.avatar} />
                      <AvatarFallback style={{ background: 'rgba(79,124,255,0.15)', color: '#4f7cff', fontSize: 11, fontWeight: 700 }}>
                        {stat.developer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: 13 }}>{stat.developer.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Score history (7 days)</div>
                    </div>
                  </div>
                  {hasHistory && (
                    <span style={{
                      fontSize: 13, fontWeight: 700,
                      color: deltaPositive ? '#34d399' : '#f87171',
                      display: 'flex', alignItems: 'center', gap: 3,
                    }}>
                      {deltaPositive ? <TrendingUp style={{ width: 14, height: 14 }} /> : <TrendingDown style={{ width: 14, height: 14 }} />}
                      {deltaPositive ? '+' : ''}{delta.toFixed(1)}%
                    </span>
                  )}
                </div>

                {!hasHistory ? (
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', padding: '24px 0', textAlign: 'center' }}>
                    No history available
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
                    {stat.scoreHistory.map((entry, j) => {
                      const h = Math.max(4, (entry.score / 100) * 48);
                      const color = getScoreColor(entry.score);
                      return (
                        <div key={j} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{entry.score}%</div>
                          <div style={{
                            width: '100%', height: 48, borderRadius: 5,
                            background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
                            display: 'flex', alignItems: 'flex-end',
                          }}>
                            <div style={{
                              width: '100%', height: h,
                              background: `linear-gradient(to top, ${color}99, ${color})`,
                              borderRadius: 5, transition: 'height 0.6s ease',
                            }} />
                          </div>
                          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{entry.date}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}