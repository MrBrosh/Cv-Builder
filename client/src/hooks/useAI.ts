import { useCallback, useState } from 'react'
import * as api from '../lib/api'

type UseAIReturn = {
  generateSummary: (currentText: string, templateId?: string) => Promise<string>
  generateExperience: (
    role: string,
    company: string,
    desc: string,
    templateId?: string
  ) => Promise<string>
  isGenerating: boolean
  error: string | null
}

export function useAI(): UseAIReturn {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSummary = useCallback(async (currentText: string, templateId?: string): Promise<string> => {
    setIsGenerating(true)
    setError(null)
    try {
      const improved = await api.improveSummary(currentText, templateId)
      return improved
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to improve summary'
      setError(msg)
      throw err
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const generateExperience = useCallback(
    async (role: string, company: string, desc: string, templateId?: string): Promise<string> => {
      setIsGenerating(true)
      setError(null)
      try {
        const improved = await api.improveExperience({ role, company, description: desc, templateId })
        return improved
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to improve experience'
        setError(msg)
        throw err
      } finally {
        setIsGenerating(false)
      }
    },
    []
  )

  return {
    generateSummary,
    generateExperience,
    isGenerating,
    error,
  }
}
