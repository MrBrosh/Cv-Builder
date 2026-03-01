import { formatDateForDisplay } from '../../../lib/utils'
import { descriptionToLines } from './types'
import type { CVTemplateProps } from './types'

/** Minimal: single line header, tiny section titles, skills as one line, very dense */
export function MinimalTemplate({ data, themeClass, printRef, className = '' }: CVTemplateProps) {
  const pi = data.personalInfo
  const experiences = data.experience ?? []
  const education = data.education ?? []
  const summary = data.summary ?? ''
  const skills = data.skills ?? []
  const summaryLines = descriptionToLines(summary)

  return (
    <article className={`mx-auto min-h-[297mm] max-w-[85%] px-6 py-5 font-sans text-slate-800 ${className}`}>
      {/* One line: Name | email · phone · location */}
      <header className="border-b border-slate-300 pb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h1 className={`text-lg font-bold tracking-tight ${themeClass}`}>
          {pi?.name || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-3 gap-y-0 text-[11px] text-slate-500">
          {pi?.email && <span>{pi.email}</span>}
          {pi?.phone && <span>{pi.phone}</span>}
          {pi?.location && <span>{pi.location}</span>}
        </div>
      </header>

      {summary ? (
        <section className="mt-3">
          <h2 className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
            Summary
          </h2>
          {summaryLines.length >= 1 ? (
            <div className="mt-0.5 flex flex-col gap-0.5 text-[12px] text-slate-700">
              {summaryLines.map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </div>
          ) : (
            <p className="mt-0.5 text-[12px] text-slate-700">{summary}</p>
          )}
        </section>
      ) : null}

      {experiences.length > 0 ? (
        <section className="mt-3">
          <h2 className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
            Experience
          </h2>
          <div className="mt-1 space-y-1.5">
            {experiences.map((exp, i) => {
              const descLines = descriptionToLines(exp.description)
              return (
                <div key={i}>
                  <div className="flex justify-between gap-2 items-baseline">
                    <span className="font-semibold text-slate-900 text-[12px]">{exp.role}</span>
                    {(exp.startDate || exp.endDate) && (
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {[exp.startDate, exp.endDate]
                          .filter(Boolean)
                          .map((d) => formatDateForDisplay(d ?? ''))
                          .join('–')}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600">{exp.company}</p>
                  {descLines.length >= 1 ? (
                    <div className="mt-0.5 space-y-0.5 text-[11px] text-slate-700">
                      {descLines.map((line, j) => (
                        <span key={j} className="block">{line}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-0.5 text-[11px] text-slate-700">{exp.description}</p>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      ) : null}

      {education.length > 0 ? (
        <section className="mt-3">
          <h2 className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
            Education
          </h2>
          <div className="mt-1 space-y-0.5">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between gap-2 items-baseline">
                  <span className="font-semibold text-slate-900 text-[12px]">{edu.degree}</span>
                  {(edu.startDate || edu.endDate) && (
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {[edu.startDate, edu.endDate]
                        .filter(Boolean)
                        .map((d) => formatDateForDisplay(d ?? ''))
                        .join('–')}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600">{edu.institution}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {skills.length > 0 ? (
        <section className="mt-3">
          <h2 className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
            Skills
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-700 leading-relaxed">
            {skills.join(' · ')}
          </p>
        </section>
      ) : null}
    </article>
  )
}
