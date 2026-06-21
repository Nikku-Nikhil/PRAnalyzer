import { ReactNode } from 'react'
import { cn } from './ui/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div 
      className={cn(
        "glass-card rounded-2xl p-6 transition-all duration-300",
        hover && "hover:scale-105 hover:shadow-2xl hover:bg-white/15",
        className
      )}
    >
      {children}
    </div>
  )
}