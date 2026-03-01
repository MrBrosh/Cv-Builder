import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format date string (YYYY-MM-DD, YYYY-MM, or YYYY) for display as DD/MM/YYYY */
export function formatDateForDisplay(dateStr: string): string {
  if (!dateStr || dateStr === 'Present') return dateStr
  const fullMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (fullMatch) return `${fullMatch[3]}/${fullMatch[2]}/${fullMatch[1]}`
  const monthMatch = dateStr.match(/^(\d{4})-(\d{2})$/)
  if (monthMatch) return `${monthMatch[2]}/${monthMatch[1]}`
  return dateStr
}
