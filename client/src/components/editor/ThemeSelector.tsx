import { toast } from 'sonner'
import { useCV } from '../../context/CVContext'
import { Card, CardHeader, CardTitle } from '../ui'
import { cn } from '../../lib/utils'

const THEMES = [
  { id: 'blue', color: '#2563eb', label: 'Blue' },
  { id: 'green', color: '#059669', label: 'Green' },
  { id: 'purple', color: '#7c3aed', label: 'Purple' },
  { id: 'red', color: '#e11d48', label: 'Red' },
  { id: 'black', color: '#0f172a', label: 'Black' },
] as const

export function ThemeSelector() {
  const { cvData, saveCV } = useCV()
  const selected = cvData.themeColor ?? 'blue'

  async function selectTheme(id: string) {
    try {
      await saveCV({ ...cvData, themeColor: id })
      toast.success('Theme updated', {
        description: `Theme color changed to ${THEMES.find((t) => t.id === id)?.label ?? id}.`,
      })
    } catch (err) {
      toast.error('Failed to save theme', {
        description: err instanceof Error ? err.message : 'An error occurred while saving.',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-bold">
            🎨
          </span>
          Theme color
        </CardTitle>
      </CardHeader>
      <div className="flex flex-wrap gap-3">
        {THEMES.map(({ id, color, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => selectTheme(id)}
            className={cn(
              'flex h-10 w-10 rounded-full transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 focus-visible:ring-primary-400',
              'hover:scale-110 hover:shadow-lg hover:shadow-primary-500/30',
              selected === id && 'ring-2 ring-offset-2 ring-offset-slate-800 ring-primary-400 shadow-lg shadow-primary-500/30'
            )}
            style={{ backgroundColor: color }}
            aria-label={`Select ${label} theme`}
            aria-pressed={selected === id}
          />
        ))}
      </div>
    </Card>
  )
}
