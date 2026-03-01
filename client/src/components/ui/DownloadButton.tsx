import type { RefObject } from 'react'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'sonner'
import { Download } from 'lucide-react'
import { cn } from '../../lib/utils'

type DownloadButtonProps = {
  contentRef: RefObject<HTMLElement | null>
  className?: string
  disabled?: boolean
  children?: React.ReactNode
}

export function DownloadButton({
  contentRef,
  className,
  disabled,
  children = 'Download PDF',
}: DownloadButtonProps) {
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: 'CV',
    pageStyle: `
      @page { size: A4; margin: 12mm; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      body, html { background: white !important; }
      .preview-page-root, .cv-preview-print-wrapper {
        padding: 0 !important; margin: 0 !important; display: block !important;
        background: transparent !important; overflow: visible !important;
      }
      .cv-preview-print-wrapper > *,
      .cv-preview-print-wrapper * {
        transform: none !important; transform-origin: unset !important;
      }
      .cv-preview-print {
        box-shadow: none !important; background: white !important; border: none !important;
        outline: none !important; border-radius: 0 !important;
        width: 210mm !important; min-width: 210mm !important;
        min-height: 297mm !important; height: auto !important;
        max-width: none !important; overflow: visible !important;
      }
      .cv-preview-print article { color: #1e293b !important; }
      .cv-preview-print h1, .cv-preview-print h2, .cv-preview-print h3 { color: #0f172a !important; }
      .cv-preview-print p, .cv-preview-print span, .cv-preview-print li { color: #334155 !important; }
    `,
  })

  function onClick() {
    if (!contentRef?.current) {
      toast.info('Open Preview', {
        description: 'Please switch to Preview tab to download your CV.',
      })
      return
    }
    handlePrint()
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-primary-500/40 transition-all duration-200',
        'hover:from-primary-400 hover:to-primary-500 hover:shadow-glow hover:shadow-primary-400/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-slate-900',
        'disabled:pointer-events-none disabled:opacity-60 active:scale-95',
        className
      )}
    >
      <Download className="h-4 w-4" />
      {children}
    </button>
  )
}
