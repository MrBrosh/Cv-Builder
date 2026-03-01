import { type ReactNode } from 'react'
import { cn } from '../../lib/utils'

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl bg-slate-800/60 backdrop-blur-md px-5 py-4',
        'border border-primary-500/25 shadow-xl shadow-primary-900/15',
        'transition-all duration-300',
        'hover:border-primary-500/50 hover:shadow-glow hover:shadow-primary-500/20',
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  )
}

type CardHeaderProps = {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function CardHeader({ children, className, onClick }: CardHeaderProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      onClick={onClick}
      className={cn('mb-3 border-b border-slate-600/50 pb-2', onClick && 'cursor-pointer', className)}
    >
      {children}
    </div>
  )
}

type CardTitleProps = {
  children: ReactNode
  className?: string
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('text-base font-semibold text-slate-100 flex items-center gap-2', className)}>
      {children}
    </h3>
  )
}
