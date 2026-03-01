import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

type DateFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  label?: string
  showPresentOption?: boolean
  isPresent?: boolean
  onPresentChange?: (checked: boolean) => void
}

export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(
  (
    {
      className,
      error,
      label,
      id,
      showPresentOption = false,
      isPresent = false,
      onPresentChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const isDisabled = disabled || (showPresentOption && isPresent)

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1 block text-sm font-medium text-slate-200"
          >
            {label}
          </label>
        )}
        <div className="flex items-center gap-2">
          <input
            ref={ref}
            type="date"
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            disabled={isDisabled}
            className={cn(
              'w-full rounded-lg border bg-slate-700/50 px-3 py-2 text-slate-100 shadow-sm transition-all duration-200 [color-scheme:dark]',
              'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-slate-800 focus:border-primary-500',
              'disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500',
              error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-600 hover:border-primary-500/50',
              className
            )}
            {...props}
          />
          {showPresentOption && (
            <label className="flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap text-sm text-slate-300">
              <input
                type="checkbox"
                checked={isPresent}
                onChange={(e) => onPresentChange?.(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Present</span>
            </label>
          )}
        </div>
        {error && (
          <p
            id={inputId ? `${inputId}-error` : undefined}
            className="mt-1 text-sm text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

DateField.displayName = 'DateField'
