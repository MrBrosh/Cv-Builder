import { Briefcase, GraduationCap, Sparkles } from 'lucide-react'
import { formatDateForDisplay } from '../../../lib/utils'
import { descriptionToLines } from './types'
import type { CVTemplateProps } from './types'

/** Modern: TWO COLUMNS — left sidebar (name, contact, skills), right (summary, experience, education) */
export function ModernTemplate({ data, themeClass, printRef, className = '' }: CVTemplateProps) {
  const pi = data.personalInfo
  const experiences = data.experience ?? []
  const education = data.education ?? []
  const summary = data.summary ?? ''
  const skills = data.skills ?? []
  const summaryLines = descriptionToLines(summary)

  return (
    <article className={`mx-auto min-h-[297mm] flex font-sans text-slate-800 ${className}`}>
      {/* LEFT COLUMN — sidebar */}
      <aside
        className={`w-[32%] shrink-0 px-5 py-6 text-white ${themeClass.replace('text-', 'bg-')}`}
        style={{
          backgroundColor:
            themeClass === 'text-blue-600'
              ? '#2563eb'
              : themeClass === 'text-emerald-600'
                ? '#059669'
                : themeClass === 'text-purple-600'
                  ? '#7c3aed'
                  : themeClass === 'text-rose-600'
                    ? '#e11d48'
                    : '#1e293b',
        }}
      >
        <h1 className="text-lg font-bold leading-tight">
          {pi?.name || 'Your Name'}
        </h1>
        <div className="mt-3 space-y-1 text-xs opacity-95">
          {pi?.email && <div>{pi.email}</div>}
          {pi?.phone && <div>{pi.phone}</div>}
          {pi?.location && <div>{pi.location}</div>}
        </div>
        {skills.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest opacity-90">
              Skills
            </h2>
            <div className="mt-2 flex flex-wrap gap-1">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="rounded bg-white/20 px-2 py-0.5 text-[11px] font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </aside>

      {/* RIGHT COLUMN */}
      <div className="min-w-0 flex-1 px-6 py-6">
        {summary ? (
          <section className="mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Summary
            </h2>
            {summaryLines.length > 1 ? (
              <ul className="mt-1 space-y-0.5">
                {summaryLines.map((line, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <span className={themeClass}>•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm leading-relaxed text-slate-700">{summary}</p>
            )}
          </section>
        ) : null}
        {experiences.length > 0 ? (
          <section className="mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Experience
            </h2>
            <ul className="mt-2 space-y-2">
              {experiences.map((exp, i) => {
                const descLines = descriptionToLines(exp.description)
                return (
                  <li key={i}>
                    <div className="flex justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{exp.role}</h3>
                      {(exp.startDate || exp.endDate) && (
                        <span className="text-[11px] text-slate-500 shrink-0">
                          {[exp.startDate, exp.endDate]
                            .filter(Boolean)
                            .map((d) => formatDateForDisplay(d ?? ''))
                            .join(' – ')}
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-slate-600">{exp.company}</p>
                    {descLines.length > 1 ? (
                      <ul className="mt-0.5 space-y-0.5 pl-0">
                        {descLines.map((line, j) => (
                          <li key={j} className="flex gap-1.5 text-[12px] text-slate-700">
                            <span className={themeClass}>•</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-0.5 text-[12px] text-slate-700">{exp.description}</p>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        ) : null}
        {education.length > 0 ? (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Education
            </h2>
            <ul className="mt-2 space-y-1">
              {education.map((edu, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{edu.degree}</span>
                    <span className="text-[12px] text-slate-600"> — {edu.institution}</span>
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <span className="text-[11px] text-slate-500 shrink-0">
                      {[edu.startDate, edu.endDate]
                        .filter(Boolean)
                        .map((d) => formatDateForDisplay(d ?? ''))
                        .join(' – ')}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  )
}
