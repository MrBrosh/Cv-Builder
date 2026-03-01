import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useCV } from '../../context/CVContext'
import { Card, CardHeader, CardTitle } from '../ui'
import { CV_TEMPLATES } from '../../lib/constants'
import { cn } from '../../lib/utils'
import type { CVTemplateId } from '../../lib/constants'
import { Check } from 'lucide-react'

export function TemplateSelector() {
  const { cvData, saveCV, selectedTemplateId, setSelectedTemplateId } = useCV()
  const savedTemplate = (cvData.templateId ?? 'classic') as CVTemplateId
  const [selected, setSelected] = useState<CVTemplateId>(savedTemplate)

  useEffect(() => {
    setSelected(savedTemplate)
    setSelectedTemplateId(savedTemplate)
  }, [savedTemplate, setSelectedTemplateId])

  async function selectTemplate(id: string) {
    if (id !== 'classic' && id !== 'modern' && id !== 'minimal' && id !== 'creative') return
    const previous = selected
    setSelected(id as CVTemplateId)
    setSelectedTemplateId(id)
    try {
      await saveCV({ ...cvData, templateId: id })
      toast.success('Writing template updated', {
        description: `AI will use the "${CV_TEMPLATES.find((t) => t.id === id)?.label ?? id}" style when improving text.`,
      })
    } catch (err) {
      setSelected(previous)
      toast.error('Failed to save template', {
        description: 'Selection kept for this session. Try saving again later.',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white text-sm font-bold">
            ✍️
          </span>
          Writing template
          <span
            className="ml-auto inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold text-white"
            style={{
              backgroundColor: selected ? '#059669' : undefined,
              color: selected ? '#fff' : undefined,
            }}
          >
            <Check className="h-4 w-4" aria-hidden />
            {CV_TEMPLATES.find((t) => t.id === selected)?.label ?? selectedTemplateId}
          </span>
        </CardTitle>
      </CardHeader>
      <p className="mb-3 text-sm text-slate-400">
        Choose how the AI improves your summary and experience descriptions.
      </p>
      <p className="mb-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
        The difference appears when you click <strong>Improve with AI</strong> in the Summary or Experience section below — the text will match the style of the template you selected here.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {CV_TEMPLATES.map(({ id, label, description }) => {
          const isSelected = selected === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => selectTemplate(id)}
              className={cn(
                'relative flex flex-col items-start rounded-lg border-2 px-4 py-3 text-left transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 focus-visible:ring-primary-400',
                !isSelected && 'border-slate-600/60 bg-slate-800/30 text-slate-200 hover:border-primary-500/50 hover:bg-primary-500/5'
              )}
              style={
                isSelected
                  ? {
                      borderColor: '#10b981',
                      backgroundColor: 'rgba(16, 185, 129, 0.25)',
                      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)',
                      color: '#d1fae5',
                    }
                  : undefined
              }
              aria-label={`Select ${label} template`}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <span
                  className="absolute right-2 top-2 rounded px-2 py-0.5 text-xs font-bold text-white"
                  style={{ backgroundColor: '#059669' }}
                >
                  Selected
                </span>
              )}
              <span className="flex w-full items-center justify-between font-semibold pr-16">
                {label}
                {isSelected && <Check className="h-5 w-5 shrink-0" style={{ color: '#34d399' }} aria-hidden />}
              </span>
              <span className="mt-0.5 text-xs" style={isSelected ? { color: '#a7f3d0' } : undefined}>
                {description}
              </span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
