import { z } from 'zod'

const experienceEntrySchema = z.object({
  id: z.string().optional().nullable(),
  role: z.union([z.string(), z.null()]).optional().default(''),
  company: z.union([z.string(), z.null()]).optional().default(''),
  description: z.union([z.string(), z.null()]).optional().default(''),
  startDate: z.union([z.string(), z.null()]).optional(),
  endDate: z.union([z.string(), z.null()]).optional(),
})

const educationEntrySchema = z.object({
  id: z.string().optional().nullable(),
  degree: z.union([z.string(), z.null()]).optional().default(''),
  institution: z.union([z.string(), z.null()]).optional().default(''),
  startDate: z.union([z.string(), z.null()]).optional(),
  endDate: z.union([z.string(), z.null()]).optional(),
})

const personalInfoSchema = z
  .object({
    name: z.union([z.string(), z.null()]).optional().default(''),
    email: z.union([z.string().email(), z.literal(''), z.null()]).optional().transform((v) => (v === null ? '' : v ?? '')),
    phone: z.union([z.string(), z.null()]).optional(),
    location: z.union([z.string(), z.null()]).optional(),
  })
  .passthrough()
  .optional()
  .nullable()

export const cvSchema = z
  .object({
    personalInfo: personalInfoSchema,
    summary: z.union([z.string(), z.null()]).optional(),
    experience: z.array(experienceEntrySchema).optional().default([]),
    education: z.array(educationEntrySchema).optional().default([]),
    skills: z
      .array(z.union([z.string(), z.null()]))
      .optional()
      .transform((arr) => (arr ?? []).filter((s): s is string => typeof s === 'string')),
    themeColor: z.union([z.string(), z.null()]).optional(),
    templateId: z.enum(['classic', 'modern', 'minimal', 'creative']).optional(),
  })
  .transform((data) => ({
    ...data,
    personalInfo: data.personalInfo ?? undefined,
    summary: data.summary ?? undefined,
    themeColor: data.themeColor ?? undefined,
    templateId: data.templateId ?? undefined,
  }))

export type CVData = z.infer<typeof cvSchema>

/** Accept any payload and normalize to CVData. Never throws – use for /api/cv/save to avoid 400. */
export function normalizeCVPayload(body: unknown): CVData {
  const o = body && typeof body === 'object' ? (body as Record<string, unknown>) : {}
  const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : [])
  const str = (v: unknown): string => (typeof v === 'string' ? v : '')

  const personalInfoRaw = o.personalInfo
  const pi =
    personalInfoRaw && typeof personalInfoRaw === 'object' && !Array.isArray(personalInfoRaw)
      ? (personalInfoRaw as Record<string, unknown>)
      : {}
  const personalInfo = {
    name: str(pi.name),
    email: str(pi.email),
    phone: typeof pi.phone === 'string' ? pi.phone : undefined,
    location: typeof pi.location === 'string' ? pi.location : undefined,
  }

  const experience = arr(o.experience).map((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return { id: undefined, role: '', company: '', description: '', startDate: undefined, endDate: undefined }
    }
    const e = item as Record<string, unknown>
    return {
      id: typeof e.id === 'string' ? e.id : undefined,
      role: str(e.role),
      company: str(e.company),
      description: str(e.description),
      startDate: typeof e.startDate === 'string' ? e.startDate : undefined,
      endDate: typeof e.endDate === 'string' ? e.endDate : undefined,
    }
  })

  const education = arr(o.education).map((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return { id: undefined, degree: '', institution: '', startDate: undefined, endDate: undefined }
    }
    const e = item as Record<string, unknown>
    return {
      id: typeof e.id === 'string' ? e.id : undefined,
      degree: str(e.degree),
      institution: str(e.institution),
      startDate: typeof e.startDate === 'string' ? e.startDate : undefined,
      endDate: typeof e.endDate === 'string' ? e.endDate : undefined,
    }
  })

  const skillsRaw = arr(o.skills)
  const skills = skillsRaw.filter((s): s is string => typeof s === 'string')

  return {
    personalInfo,
    summary: typeof o.summary === 'string' ? o.summary : undefined,
    experience,
    education,
    skills,
    themeColor: typeof o.themeColor === 'string' ? o.themeColor : undefined,
    templateId: typeof o.templateId === 'string' && ['classic', 'modern', 'minimal', 'creative'].includes(o.templateId)
      ? o.templateId
      : undefined,
  }
}

export const improveSummarySchema = z.object({
  summary: z.string(),
  templateId: z.enum(['classic', 'modern', 'minimal', 'creative']).optional(),
})

export const improveExperienceSchema = z.object({
  role: z.string(),
  company: z.string(),
  description: z.string(),
  templateId: z.enum(['classic', 'modern', 'minimal', 'creative']).optional(),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>

export const setOpenAIKeySchema = z.object({
  key: z.string().min(1, 'API key is required'),
})
export type SetOpenAIKeyInput = z.infer<typeof setOpenAIKeySchema>
