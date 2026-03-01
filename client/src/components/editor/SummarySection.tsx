import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useCV } from '../../context/CVContext'
import { useAI } from '../../hooks/useAI'
import { Button, Textarea, Card, CardHeader, CardTitle } from '../ui'
import { Sparkles } from 'lucide-react'

export function SummarySection() {
  const { cvData, saveCV, isSaving, selectedTemplateId } = useCV()
  const { generateSummary, isGenerating, error } = useAI()
  const [summary, setSummary] = useState(cvData.summary ?? '')

  useEffect(() => {
    setSummary(cvData.summary ?? '')
  }, [cvData.summary])

  async function handleImprove() {
    const current = summary.trim() || 'Experienced professional seeking new opportunities.'
    try {
      toast.loading('Improving summary with AI...', { id: 'improve-summary' })
      const improved = await generateSummary(current, selectedTemplateId ?? cvData.templateId ?? 'classic')
      setSummary(improved)
      toast.success('Summary improved', {
        id: 'improve-summary',
        description: 'AI has enhanced your professional summary.',
      })
    } catch {
      toast.error('Failed to improve summary', {
        id: 'improve-summary',
        description: 'Please try again later.',
      })
    }
  }

  async function handleSave() {
    try {
      await saveCV({ ...cvData, summary: summary.trim() || undefined })
      toast.success('Summary saved', {
        description: 'Your professional summary has been updated.',
      })
    } catch (err) {
      toast.error('Failed to save summary', {
        description: err instanceof Error ? err.message : 'An error occurred while saving.',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white text-sm font-bold">
            📝
          </span>
          Professional summary
        </CardTitle>
      </CardHeader>
      <div className="space-y-3">
        <Textarea
          label="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Write a concise professional summary. Use the AI button to improve it."
          className="min-h-[180px] resize-y"
          aria-label="Professional summary"
        />
        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="primary"
            onClick={handleImprove}
            isLoading={isGenerating}
            disabled={isGenerating}
            className="gap-1.5"
          >
            <Sparkles className="h-4 w-4" />
            Improve with AI
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSave}
            isLoading={isSaving}
            disabled={isSaving || summary === (cvData.summary ?? '')}
          >
            Save summary
          </Button>
        </div>
      </div>
    </Card>
  )
}
