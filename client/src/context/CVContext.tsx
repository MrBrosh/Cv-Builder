import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import * as api from '../lib/api'
import {
  emptyCVData,
  type CVData,
  type ExperienceEntry,
  type EducationEntry,
} from '../lib/schemas'
import { useAuth } from './AuthContext'

type CVContextValue = {
  cvData: CVData
  selectedTemplateId: string
  setSelectedTemplateId: (id: string) => void
  isLoading: boolean
  isSaving: boolean
  fetchCV: () => Promise<void>
  saveCV: (data: CVData) => Promise<void>
  reorderExperience: (newOrder: ExperienceEntry[]) => void
  reorderEducation: (newOrder: EducationEntry[]) => void
  addEducation: (edu: EducationEntry) => void
  removeEducation: (index: number) => void
  addSkill: (skill: string) => void
  removeSkill: (index: number) => void
}

const CVContext = createContext<CVContextValue | null>(null)

function normalizeCV(data: CVData): CVData {
  return {
    personalInfo: { ...emptyCVData.personalInfo, ...data.personalInfo },
    summary: data.summary ?? '',
    experience: data.experience ?? [],
    education: data.education ?? [],
    skills: data.skills ?? [],
    themeColor: data.themeColor ?? emptyCVData.themeColor ?? 'blue',
    templateId: data.templateId ?? emptyCVData.templateId ?? 'classic',
  }
}

export function CVProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  const [cvData, setCvData] = useState<CVData>(emptyCVData)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(emptyCVData.templateId ?? 'classic')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const fetchCV = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    try {
      const data = await api.fetchCV()
      const normalized = normalizeCV(data)
      setCvData(normalized)
      setSelectedTemplateId(normalized.templateId ?? 'classic')
    } catch (err) {
      console.error('Failed to fetch CV:', err)
      setCvData(emptyCVData)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  const saveCV = useCallback(async (data: CVData) => {
    setIsSaving(true)
    try {
      await api.saveCV(data)
      setCvData(normalizeCV(data))
    } catch (err) {
      console.error('Failed to save CV:', err)
      throw err
    } finally {
      setIsSaving(false)
    }
  }, [])

  const reorderExperience = useCallback(
    (newOrder: ExperienceEntry[]) => {
      const updated = { ...cvData, experience: newOrder }
      setCvData(updated)
      void saveCV(updated)
    },
    [cvData, saveCV]
  )

  const reorderEducation = useCallback(
    (newOrder: EducationEntry[]) => {
      const updated = { ...cvData, education: newOrder }
      setCvData(updated)
      void saveCV(updated)
    },
    [cvData, saveCV]
  )

  const addEducation = useCallback(
    (edu: EducationEntry) => {
      const updated = {
        ...cvData,
        education: [...(cvData.education ?? []), edu],
      }
      setCvData(updated)
      void saveCV(updated).then(() => {
        toast.success('Education added', {
          description: `${edu.degree} has been added.`,
        })
      }).catch(() => {
        toast.error('Failed to add education')
      })
    },
    [cvData, saveCV]
  )

  const removeEducation = useCallback(
    (index: number) => {
      const education = cvData.education ?? []
      const removed = education[index]
      const updated = {
        ...cvData,
        education: education.filter((_, i) => i !== index),
      }
      setCvData(updated)
      void saveCV(updated).then(() => {
        toast.success('Education removed', {
          description: removed ? `${removed.degree} has been removed.` : 'Education entry removed.',
        })
      }).catch(() => {
        toast.error('Failed to remove education')
      })
    },
    [cvData, saveCV]
  )

  const addSkill = useCallback(
    (skill: string) => {
      const trimmed = skill.trim()
      if (!trimmed) {
        toast.error('Invalid skill', {
          description: 'Skill cannot be empty.',
        })
        return
      }
      const skills = cvData.skills ?? []
      if (skills.includes(trimmed)) {
        toast.error('Skill already exists', {
          description: 'This skill is already in your list.',
        })
        return
      }
      const updated = {
        ...cvData,
        skills: [...skills, trimmed],
      }
      setCvData(updated)
      void saveCV(updated).then(() => {
        toast.success('Skill added', {
          description: `${trimmed} has been added to your skills.`,
        })
      }).catch(() => {
        toast.error('Failed to add skill')
      })
    },
    [cvData, saveCV]
  )

  const removeSkill = useCallback(
    (index: number) => {
      const skills = cvData.skills ?? []
      const removed = skills[index]
      const updated = {
        ...cvData,
        skills: skills.filter((_, i) => i !== index),
      }
      setCvData(updated)
      void saveCV(updated).then(() => {
        toast.success('Skill removed', {
          description: removed ? `${removed} has been removed.` : 'Skill removed.',
        })
      }).catch(() => {
        toast.error('Failed to remove skill')
      })
    },
    [cvData, saveCV]
  )

  useEffect(() => {
    if (token) {
      fetchCV()
    } else {
      setCvData(emptyCVData)
      setIsLoading(false)
    }
  }, [token, fetchCV])

  const value: CVContextValue = {
    cvData,
    selectedTemplateId,
    setSelectedTemplateId,
    isLoading,
    isSaving,
    fetchCV,
    saveCV,
    reorderExperience,
    reorderEducation,
    addEducation,
    removeEducation,
    addSkill,
    removeSkill,
  }

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>
}

export function useCV() {
  const ctx = useContext(CVContext)
  if (!ctx) throw new Error('useCV must be used within CVProvider')
  return ctx
}
