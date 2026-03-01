import { useEffect, useState, useCallback } from 'react'
import type { RefObject } from 'react'
import { usePrintRef } from '../context/PrintRefContext'
import { CVPreview } from '../components/preview/CVPreview'
import { Button, Loader } from '../components/ui'
import { RefreshCw } from 'lucide-react'
import * as api from '../lib/api'
import { emptyCVData } from '../lib/schemas'
import type { CVData } from '../lib/schemas'

function normalizeCV(data: CVData): CVData {
  return {
    personalInfo: { ...emptyCVData.personalInfo, ...data.personalInfo },
    summary: data.summary ?? '',
    experience: data.experience ?? [],
    education: data.education ?? [],
    skills: data.skills ?? [],
    themeColor: data.themeColor ?? emptyCVData.themeColor ?? 'blue',
    templateId: data.templateId ?? emptyCVData.templateId ?? 'classic',
  }
}

export function PreviewPage() {
  const printRef = usePrintRef()
  const [serverData, setServerData] = useState<CVData | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadFromServer = useCallback(() => {
    setLoading(true)
    setError(null)
    api
      .fetchCV()
      .then((data) => setServerData(normalizeCV(data)))
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load CV')
        setServerData(undefined)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    api
      .fetchCV()
      .then((data) => {
        if (!cancelled) setServerData(normalizeCV(data))
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load CV')
          setServerData(undefined)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  if (error && !serverData) {
    return (
      <div className="preview-page-root flex min-h-[20rem] flex-col items-center justify-center gap-4 py-4">
        <p className="rounded-lg bg-red-500/10 px-4 py-3 text-red-400" role="alert">
          {error}
        </p>
        <Button variant="outline" onClick={loadFromServer}>
          Try again
        </Button>
      </div>
    )
  }

  if (loading && serverData === undefined) {
    return (
      <div className="preview-page-root flex min-h-[30rem] w-full items-center justify-center py-4">
        <Loader variant="spinner" className="h-10 w-10 text-primary-400" />
      </div>
    )
  }

  return (
    <div className="preview-page-root flex w-full min-w-0 flex-col items-center gap-3 py-4">
      <div className="flex w-full max-w-[794px] justify-end">
        <Button variant="outline" size="sm" onClick={loadFromServer} disabled={loading} className="gap-1">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh from server
        </Button>
      </div>
      <div
        ref={printRef as RefObject<HTMLDivElement>}
        className="cv-preview-print-wrapper w-full min-w-0 flex justify-center"
      >
        <CVPreview serverData={serverData === undefined ? undefined : serverData} printRef={printRef} />
      </div>
    </div>
  )
}
