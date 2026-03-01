import { FileText, Briefcase, GraduationCap, Sparkles } from 'lucide-react'
import { formatDateForDisplay } from '../../../lib/utils'
import type { CVTemplateProps } from './types'

/** Classic: traditional single column, formal document style, icons, serif */
export function ClassicTemplate({ data, themeClass, printRef, className = '' }: CVTemplateProps) {
  const pi = data.personalInfo
  const experiences = data.experience ?? []
  const education = data.education ?? []
  const summary = data.summary ?? ''
  const skills = data.skills ?? []

  return (
    <article className={`mx-auto min-h-[297mm] px-10 py-8 text-slate-800 ${className}`} style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <header className="border-b-2 border-slate-300 pb-4 mb-4">
        <h1 className={`text-2xl font-semibold tracking-tight ${themeClass}`}>
          {pi?.name || 'Your Name'}
        </h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0 text-sm text-slate-600">
          {pi?.email && <span>{pi.email}</span>}
          {pi?.phone && <span>{pi.phone}</span>}
          {pi?.location && <span>{pi.location}</span>}
        </div>
      </header>
      {summary ? (
        <section className="mt-4">
          <h2 className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 ${themeClass}`}>
            <FileText className="h-4 w-4 shrink-0" />
            Summary
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{summary}</p>
        </section>
      ) : null}
      {experiences.length > 0 ? (
        <section className="mt-6">
          <h2 className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 ${themeClass}`}>
            <Briefcase className="h-4 w-4 shrink-0" />
            Experience
          </h2>
          <ul className="mt-2 space-y-4">
            {experiences.map((exp, i) => (
              <li key={i}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">{exp.role}</h3>
                  {(exp.startDate || exp.endDate) && (
                    <span className="text-sm text-slate-500">
                      {[exp.startDate, exp.endDate]
                        .filter(Boolean)
                        .map((d) => formatDateForDisplay(d ?? ''))
                        .join(' – ')}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600">{exp.company}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-slate-700">{exp.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {education.length > 0 ? (
        <section className="mt-6">
          <h2 className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 ${themeClass}`}>
            <GraduationCap className="h-4 w-4 shrink-0" />
            Education
          </h2>
          <ul className="mt-2 space-y-3">
            {education.map((edu, i) => (
              <li key={i}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">{edu.degree}</h3>
                  {(edu.startDate || edu.endDate) && (
                    <span className="text-sm text-slate-500">
                      {[edu.startDate, edu.endDate]
                        .filter(Boolean)
                        .map((d) => formatDateForDisplay(d ?? ''))
                        .join(' – ')}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600">{edu.institution}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {skills.length > 0 ? (
        <section className="mt-6">
          <h2 className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 ${themeClass}`}>
            <Sparkles className="h-4 w-4 shrink-0" />
            Skills
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i} className="rounded-md border border-slate-300 bg-slate-50 px-2.5 py-1 text-sm text-slate-700">
                {skill}
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
