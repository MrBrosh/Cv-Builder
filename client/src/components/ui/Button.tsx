import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'outline'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  isLoading?: boolean
  size?: 'sm' | 'md'
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/40 hover:from-primary-400 hover:to-primary-500 hover:shadow-glow hover:shadow-primary-400/50 focus-visible:ring-primary-400 border-transparent active:scale-95',
  secondary:
    'bg-slate-700/60 text-slate-200 border border-primary-500/30 shadow-md shadow-slate-900/50 hover:bg-slate-600/60 hover:border-primary-400/50 hover:text-white hover:shadow-primary-500/20 focus-visible:ring-primary-400 active:scale-95',
  outline:
    'bg-transparent text-primary-400 border border-primary-500/50 hover:bg-primary-500/10 hover:border-primary-400 hover:text-primary-300 hover:shadow-lg hover:shadow-primary-500/20 focus-visible:ring-primary-400 active:scale-95',
}

const sizeStyles = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, disabled, type = 'button', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled ?? isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition-all duration-200',
          sizeStyles[size],
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-primary-400',
          'disabled:pointer-events-none disabled:opacity-60',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            <span>Loading…</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
