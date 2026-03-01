import { useState } from 'react'
import { Card, CardHeader, CardTitle } from '../ui'
import { JOB_SECTORS } from '../../lib/constants'
import { Briefcase, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../lib/utils'

export function JobSectorsSection() {
  const [expanded, setExpanded] = useState(true)

  return (
    <Card className="border-l-4 border-l-primary-500/60">
      <CardHeader className="cursor-pointer" onClick={() => setExpanded((e) => !e)}>
        <CardTitle className="flex items-center justify-between text-primary-300">
          <span className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Popular job sectors – links to job boards
          </span>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </CardTitle>
      </CardHeader>
      {expanded && (
        <div className="space-y-4 p-4 pt-0">
          <p className="text-sm text-slate-400">
            Select a sector and click the links to search for relevant jobs
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {JOB_SECTORS.map((sector) => (
              <div
                key={sector.id}
                className="rounded-xl border border-slate-600/60 bg-slate-700/30 p-3 transition-colors hover:border-primary-500/40 hover:bg-slate-700/50"
              >
                <h4 className="mb-2 font-medium text-slate-100">
                  {sector.name}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {sector.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all',
                        'border border-primary-500/40 bg-slate-800/60 text-primary-300',
                        'hover:border-primary-400 hover:bg-primary-500/20 hover:text-primary-200'
                      )}
                    >
                      {link.label}
                      <ExternalLink className="h-3 w-3 opacity-70" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
