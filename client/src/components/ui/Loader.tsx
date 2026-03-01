import { cn } from '../../lib/utils'

type LoaderProps = {
  className?: string
  /** 'spinner' | 'skeleton' */
  variant?: 'spinner' | 'skeleton'
}

export function Loader({ className, variant = 'spinner' }: LoaderProps) {
  if (variant === 'skeleton') {
    return (
      <div
        className={cn('animate-pulse rounded-lg bg-slate-600', className)}
        role="status"
        aria-label="Loading"
      />
    )
  }

  return (
    <div
      className={cn(
        'inline-block h-8 w-8 rounded-full border-2 border-slate-600 border-t-primary-400 animate-spin',
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )
}
