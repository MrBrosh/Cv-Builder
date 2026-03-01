import type { RefObject } from 'react'
import type { CVData } from '../../../lib/schemas'

export type CVTemplateProps = {
  data: CVData
  themeClass: string
  printRef?: RefObject<HTMLDivElement | null>
  /** Optional className for the root article (e.g. for scale/print) */
  className?: string
}

/** Split text by newlines or bullet-like chars for list rendering */
export function descriptionToLines(text: string): string[] {
  if (!text?.trim()) return []
  return text
    .split(/\n+|[\u2022\u2023\u25E6\u2043\u2219]\s*/)
    .map((s) => s.trim())
    .filter(Boolean)
}
