import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { GlassCard } from './GlassCard'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number | string
    isPositive: boolean
  }
  gradient?: 'primary' | 'success' | 'warning' | 'destructive' | 'accent'
}

export function StatCard({ title, value, description, icon: Icon, trend, gradient = 'primary' }: StatCardProps) {
  const gradientClasses = {
    primary: 'from-blue-500 to-purple-600',
    success: 'from-green-500 to-emerald-600',
    warning: 'from-yellow-500 to-orange-600',
    destructive: 'from-red-500 to-pink-600',
    accent: 'from-cyan-500 to-teal-600'
  }

  return (
    <GlassCard hover className="relative overflow-hidden">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[gradient]} opacity-5`} />
      
      {/* Icon background */}
      <div className={`absolute top-4 right-4 p-3 rounded-xl bg-gradient-to-br ${gradientClasses[gradient]} opacity-10`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      
      {/* Content */}
      <div className="relative space-y-2">
        <p className="text-sm font-medium text-white/80">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              trend.isPositive 
                ? 'bg-green-500/20 text-green-300' 
                : 'bg-red-500/20 text-red-300'
            }`}>
              {trend.isPositive ? '+' : ''}{trend.value}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-white/60">{description}</p>
        )}
      </div>
    </GlassCard>
  )
}