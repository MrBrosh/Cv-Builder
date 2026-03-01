import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useCV } from '../../context/CVContext'
import { Loader } from '../ui'
import { emptyCVData } from '../../lib/schemas'
import type { CVData } from '../../lib/schemas'
import { CV_LAYOUT_TEMPLATES } from './templates'
import type { CVTemplateId } from './templates'

const A4_WIDTH_PX = 794   // 210mm at 96dpi
const A4_HEIGHT_PX = 1123 // 297mm at 96dpi

const themeMap: Record<string, string> = {
  blue: 'text-blue-600',
  green: 'text-emerald-600',
  purple: 'text-purple-600',
  red: 'text-rose-600',
  black: 'text-slate-900',
}

type CVPreviewProps = {
  printRef?: RefObject<HTMLElement | null>
  /** When provided, display this data (e.g. from server). Otherwise use CVContext. */
  serverData?: CVData | null
}

export function CVPreview({ printRef, serverData }: CVPreviewProps) {
  const { cvData: contextData, isLoading: contextLoading, selectedTemplateId } = useCV()
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const cvData = (serverData !== undefined ? serverData : contextData) ?? emptyCVData
  const isLoading = serverData !== undefined ? false : contextLoading
  const validIds: CVTemplateId[] = ['classic', 'modern', 'minimal', 'creative']
  // תבנית = תמיד לפי הבחירה בעורך (selectedTemplateId), כדי שלחיצה על תבנית תשנה מיד את התצוגה
  const templateId: CVTemplateId = validIds.includes(selectedTemplateId as CVTemplateId)
    ? (selectedTemplateId as CVTemplateId)
    : validIds.includes(cvData.templateId as CVTemplateId)
      ? (cvData.templateId as CVTemplateId)
      : 'classic'
  const TemplateComponent = CV_LAYOUT_TEMPLATES[templateId]
  const themeClass = themeMap[cvData.themeColor ?? 'blue'] ?? themeMap.blue

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const updateScale = () => {
      const w = el.offsetWidth
      setScale(w > 0 && w < A4_WIDTH_PX ? w / A4_WIDTH_PX : 1)
    }
    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-[40rem] items-center justify-center rounded-xl border border-primary-500/25 bg-slate-800/60 backdrop-blur-md shadow-xl shadow-slate-900/50">
        <Loader variant="spinner" className="h-10 w-10" />
      </div>
    )
  }

  const printContent = (
    <div
      ref={printRef as RefObject<HTMLDivElement>}
      className="cv-preview-print bg-white"
      style={{ width: A4_WIDTH_PX, minHeight: A4_HEIGHT_PX }}
    >
      <TemplateComponent data={cvData} themeClass={themeClass} />
    </div>
  )

  return (
    <>
      {/* Hidden print-only copy - ref on content div for react-to-print */}
      {printRef && (
        <div
          className="fixed left-[-9999px] top-0 z-[-1] overflow-visible"
          style={{ width: A4_WIDTH_PX, minHeight: A4_HEIGHT_PX }}
          aria-hidden
        >
          {printContent}
        </div>
      )}
      <div ref={containerRef} className="flex min-h-0 w-full justify-center overflow-auto">
      <div
        style={{ width: A4_WIDTH_PX * scale, minHeight: A4_HEIGHT_PX * scale, flexShrink: 0 }}
      >
        <div
          className="cv-preview-print shrink-0 rounded-xl bg-white shadow-[0_25px_80px_-12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(34,211,238,0.1)] transition-shadow duration-300 hover:shadow-[0_30px_90px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(34,211,238,0.2)]"
          style={{
            width: A4_WIDTH_PX,
            minHeight: A4_HEIGHT_PX,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <TemplateComponent data={cvData} themeClass={themeClass} className="print:px-12 print:py-10" />
        </div>
      </div>
    </div>
    </>
  )
}
