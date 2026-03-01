import { Briefcase, GraduationCap, Sparkles } from 'lucide-react'
import { formatDateForDisplay } from '../../../lib/utils'
import type { CVTemplateProps } from './types'

const accentBg: Record<string, string> = {
  'text-blue-600': '#2563eb',
  'text-emerald-600': '#059669',
  'text-purple-600': '#7c3aed',
  'text-rose-600': '#e11d48',
  'text-slate-900': '#475569',
}

export function CreativeTemplate({ data, themeClass, printRef, className = '' }: CVTemplateProps) {
  const pi = data.personalInfo
  const experiences = data.experience ?? []
  const education = data.education ?? []
  const summary = data.summary ?? ''
  const skills = data.skills ?? []
  const accentColor = accentBg[themeClass] ?? '#2563eb'

  return (
    <article className={`mx-auto min-h-[297mm] flex font-sans text-slate-800 ${className}`}>
      <div
        className="w-3 shrink-0 rounded-r-lg"
        style={{ backgroundColor: accentColor }}
        aria-hidden
      />
      <div className="min-w-0 flex-1 pl-6 pr-8 py-8">
        <header className="pb-4 border-b border-slate-200">
          <h1
            className="text-2xl font-bold text-slate-900"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {pi?.name || 'Your Name'}
          </h1>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0 text-sm text-slate-500">
            {pi?.email && <span>{pi.email}</span>}
            {pi?.phone && <span>{pi.phone}</span>}
            {pi?.location && <span>{pi.location}</span>}
          </div>
        </header>

        {summary ? (
          <section className="mt-6">
            <h2 className={`text-sm font-semibold italic ${themeClass}`}>About</h2>
            <p
              className="mt-2 text-[15px] leading-relaxed text-slate-700"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {summary}
            </p>
          </section>
        ) : null}

        {experiences.length > 0 ? (
          <section className="mt-6">
            <h2 className={`flex items-center gap-2 text-sm font-semibold italic ${themeClass}`}>
              <Briefcase className="h-4 w-4" />
              Experience
            </h2>
            <ul className="mt-3 space-y-4">
              {experiences.map((exp, i) => (
                <li key={i}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3
                      className="font-semibold text-slate-900"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {exp.role}
                    </h3>
                    {(exp.startDate || exp.endDate) && (
                      <span className="text-sm text-slate-500">
                        {[exp.startDate, exp.endDate]
                          .filter(Boolean)
                          .map((d) => formatDateForDisplay(d ?? ''))
                          .join(' - ')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{exp.company}</p>
                  <p
                    className="mt-1.5 text-[15px] leading-relaxed text-slate-700"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {exp.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {education.length > 0 ? (
          <section className="mt-6">
            <h2 className={`flex items-center gap-2 text-sm font-semibold italic ${themeClass}`}>
              <GraduationCap className="h-4 w-4" />
              Education
            </h2>
            <ul className="mt-3 space-y-2">
              {education.map((edu, i) => (
                <li key={i}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3
                      className="font-semibold text-slate-900"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {edu.degree}
                    </h3>
                    {(edu.startDate || edu.endDate) && (
                      <span className="text-sm text-slate-500">
                        {[edu.startDate, edu.endDate]
                          .filter(Boolean)
                          .map((d) => formatDateForDisplay(d ?? ''))
                          .join(' - ')}
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
            <h2 className={`flex items-center gap-2 text-sm font-semibold italic ${themeClass}`}>
              <Sparkles className="h-4 w-4" />
              Skills
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="rounded-full border px-3 py-1 text-sm font-medium text-slate-700"
                  style={{
                    borderColor: accentColor,
                    backgroundColor: '#f1f5f9',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  )
}
