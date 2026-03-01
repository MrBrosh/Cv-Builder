import { useState, useMemo } from 'react'
import { useCV } from '../../context/CVContext'
import { Input, Card, CardHeader, CardTitle } from '../ui'
import { Sparkles, X, Lightbulb } from 'lucide-react'
import { SKILL_SUGGESTIONS } from '../../lib/constants'
import { cn } from '../../lib/utils'

export function SkillsSection() {
  const { cvData, addSkill, removeSkill } = useCV()
  const [inputVal, setInputVal] = useState('')

  const existingSkills = useMemo(
    () => new Set((cvData.skills ?? []).map((s) => s.toLowerCase().trim())),
    [cvData.skills]
  )
  const suggestedSkills = useMemo(
    () => SKILL_SUGGESTIONS.filter((s) => !existingSkills.has(s.toLowerCase())),
    [existingSkills]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!inputVal.trim()) return
      addSkill(inputVal.trim())
      setInputVal('')
    }
  }

  const addSuggested = (skill: string) => {
    if (!existingSkills.has(skill.toLowerCase())) {
      addSkill(skill)
    }
  }

  return (
    <Card className="mt-6 border-l-4 border-l-primary-500/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary-300">
          <Sparkles className="h-5 w-5" /> Skills
        </CardTitle>
      </CardHeader>
      <div className="space-y-4 p-4">
        <div>
          <Input
            placeholder="Type a skill and press Enter (e.g. React, Node.js)"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            list="skills-datalist"
          />
          <datalist id="skills-datalist">
            {SKILL_SUGGESTIONS.map((skill) => (
              <option key={skill} value={skill} />
            ))}
          </datalist>
        </div>

        {suggestedSkills.length > 0 && (
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
              <Lightbulb className="h-3.5 w-3.5" />
              Quick suggestions – click to add
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSuggested(skill)}
                  className={cn(
                    'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
                    'border border-primary-500/40 bg-slate-700/60 text-slate-300',
                    'hover:border-primary-400 hover:bg-primary-500/20 hover:text-primary-200 hover:scale-105'
                  )}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {cvData.skills?.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary-500/80 to-primary-600/80 px-3 py-1 text-sm text-white shadow-lg shadow-primary-500/20 transition-transform hover:scale-105 hover:shadow-primary-500/30"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="rounded-full p-0.5 transition-colors hover:bg-white/20 hover:text-slate-200"
                aria-label={`Remove ${skill}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </Card>
  )
}
