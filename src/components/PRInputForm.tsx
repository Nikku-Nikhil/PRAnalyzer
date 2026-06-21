import { useState } from 'react'
import { GitPullRequest, Loader2, Shield, Zap, Code, CheckCircle, AlertCircle } from 'lucide-react'

interface PRInputFormProps {
  onAnalyze: (prUrl: string) => void
  isAnalyzing: boolean
}

const glassCard: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
  backdropFilter: "blur(20px) saturate(180%) brightness(1.1)",
  WebkitBackdropFilter: "blur(20px) saturate(180%) brightness(1.1)",
  border: "1px solid rgba(255,255,255,0.13)",
  borderTop: "1px solid rgba(255,255,255,0.22)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
  borderRadius: 16,
}

const capabilities = [
  {
    icon: Shield,
    color: "#4f7cff",
    bg: "rgba(79,124,255,0.12)",
    label: "Security Scan",
    desc: "Detects SQL injection, auth issues, and secrets exposure",
  },
  {
    icon: Zap,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    label: "Performance",
    desc: "Flags N+1 queries, memory leaks, and inefficient loops",
  },
  {
    icon: Code,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    label: "Code Quality",
    desc: "Enforces naming, structure, and maintainability rules",
  },
  {
    icon: CheckCircle,
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    label: "Roslyn Analyzer",
    desc: ".NET static analysis with Roslyn diagnostic rules",
  },
]

export function PRInputForm({ onAnalyze, isAnalyzing }: PRInputFormProps) {
  const [prUrl, setPrUrl] = useState('')
  const [urlError, setUrlError] = useState('')

  const validatePRUrl = (url: string) => {
    return /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/pull\/\d+$/.test(url)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUrlError('')
    if (!prUrl.trim()) { setUrlError('Please enter a PR URL'); return }
    if (!validatePRUrl(prUrl)) { setUrlError('Enter a valid GitHub PR URL — e.g. https://github.com/owner/repo/pull/123'); return }
    onAnalyze(prUrl)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>

      {/* Hero Banner */}
      <div style={{
        ...glassCard,
        padding: '32px 36px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle blue glow top-right */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 180, height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,124,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <div style={{
            padding: 12, borderRadius: 14,
            background: 'rgba(79,124,255,0.15)',
            border: '1px solid rgba(79,124,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <GitPullRequest style={{ width: 22, height: 22, color: '#4f7cff' }} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#fff' }}>Analyze Pull Request</h2>
            <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>
              Paste a GitHub PR URL to run automated code review analysis
            </p>
          </div>
        </div>

        {/* Input + Button */}
        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <input
                id="pr-url"
                type="url"
                placeholder="https://github.com/owner/repo/pull/123"
                value={prUrl}
                onChange={e => setPrUrl(e.target.value)}
                disabled={isAnalyzing}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: 14,
                  borderRadius: 10,
                  border: urlError ? '1px solid rgba(248,113,113,0.5)' : '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontFamily: 'inherit',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backdropFilter: 'blur(8px)',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(79,124,255,0.6)' }}
                onBlur={e => { e.currentTarget.style.borderColor = urlError ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.15)' }}
              />
              {urlError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 12, color: '#f87171' }}>
                  <AlertCircle style={{ width: 12, height: 12 }} />
                  {urlError}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 24px',
                borderRadius: 10,
                border: 'none',
                background: isAnalyzing ? 'rgba(79,124,255,0.4)' : 'linear-gradient(135deg, #4f7cff 0%, #3b5bdb 100%)',
                color: '#fff',
                fontSize: 14, fontWeight: 600,
                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 4px 16px rgba(79,124,255,0.35)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                if (!isAnalyzing) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #608eff 0%, #476beb 100%)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,124,255,0.45)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={e => {
                if (!isAnalyzing) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #4f7cff 0%, #3b5bdb 100%)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,124,255,0.35)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              {isAnalyzing ? (
                <><Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />Analyzing…</>
              ) : (
                <><GitPullRequest style={{ width: 16, height: 16 }} />Start Analysis</>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Capability Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {capabilities.map(({ icon: Icon, color, bg, label, desc }) => (
          <div
            key={label}
            style={{
              ...glassCard,
              padding: '18px 20px',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(-2px)'
              el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18)'
              el.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)'
              el.style.borderColor = 'rgba(255,255,255,0.22)'
              el.style.borderTop = '1px solid rgba(255,255,255,0.38)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)'
              el.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)'
              el.style.borderColor = 'rgba(255,255,255,0.13)'
              el.style.borderTop = '1px solid rgba(255,255,255,0.22)'
            }}
          >
            <div style={{ padding: 9, borderRadius: 9, background: bg, display: 'inline-flex', marginBottom: 12, border: `1px solid ${color}30` }}>
              <Icon style={{ width: 16, height: 16, color }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 5 }}>{label}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}