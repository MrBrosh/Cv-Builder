import { Router, Response } from 'express'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import {
  cvSchema,
  normalizeCVPayload,
  registerSchema,
  loginSchema,
  setOpenAIKeySchema,
  type CVData,
  improveSummarySchema,
  improveExperienceSchema,
} from './schemas.js'
import {
  requireAuth,
  createUser,
  findUserByEmail,
  verifyPassword,
  createSession,
  destroySession,
  type AuthRequest,
} from './auth.js'
import {
  getSummaryPromptTemplate,
  getExperiencePromptTemplate,
  normalizeTemplateId,
} from './prompts.js'

console.log('Using API Key:', process.env.GEMINI_API_KEY ? 'Loaded' : 'Missing')

export const storedCVByUser = new Map<string, import('./schemas.js').CVData>()

/** OpenAI API key set via Admin page (stored in memory for the session). */
let openaiKeyStore: string | null = null

function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in .env')
  }
  const genAI = new GoogleGenerativeAI(apiKey)
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
}

async function improveWithOpenAI(
  key: string,
  prompt: string
): Promise<string> {
  const openai = new OpenAI({ apiKey: key })
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
  })
  const text = completion.choices[0]?.message?.content?.trim()
  return text ?? ''
}

const emptyCV: CVData = {
  personalInfo: undefined,
  summary: '',
  experience: [],
  education: [],
  skills: [],
  themeColor: 'blue',
  templateId: 'classic',
}

const router = Router()

router.post('/api/auth/register', (req: AuthRequest, res: Response) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: parsed.error.message,
    })
  }
  const { email, password, name } = parsed.data
  if (findUserByEmail(email)) {
    return res.status(400).json({ success: false, message: 'Email already registered' })
  }
  const user = createUser({ email, password, name })
  const token = createSession(user.email)
  return res.status(201).json({
    token,
    user: { email: user.email, name: user.name },
  })
})

router.post('/api/auth/login', (req: AuthRequest, res: Response) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    })
  }
  const { email, password } = parsed.data
  const emailNorm = email.trim().toLowerCase()
  const passwordTrimmed = password.trim()
  const user = findUserByEmail(emailNorm)
  if (!user) {
    console.log(`Login failed: user not found for email "${emailNorm}"`)
    return res.status(401).json({ success: false, message: 'Invalid email or password' })
  }
  if (!verifyPassword(user, passwordTrimmed)) {
    console.log(`Login failed: wrong password for email "${emailNorm}"`)
    return res.status(401).json({ success: false, message: 'Invalid email or password' })
  }
  const token = createSession(user.email)
  return res.json({
    token,
    user: { email: user.email, name: user.name },
  })
})

router.get('/api/auth/me', requireAuth, (req: AuthRequest, res: Response) => {
  const email = req.userEmail!
  const user = findUserByEmail(email)
  if (!user) return res.status(401).json({ success: false, message: 'User not found' })
  return res.json({ user: { email: user.email, name: user.name } })
})

router.post('/api/auth/logout', (req: AuthRequest, res: Response) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (token) destroySession(token)
  return res.json({ success: true })
})

router.post('/api/admin/set-openai-key', requireAuth, (req: AuthRequest, res: Response) => {
  const parsed = setOpenAIKeySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: parsed.error.message,
    })
  }
  openaiKeyStore = parsed.data.key.trim()
  console.log('OpenAI API key saved (key length:', openaiKeyStore.length, ')')
  return res.json({ success: true, message: 'OpenAI API key saved (for this server session).' })
})

router.get('/api/admin/openai-status', requireAuth, (_req: AuthRequest, res: Response) => {
  return res.json({ configured: !!openaiKeyStore })
})

router.get('/api/cv', requireAuth, (req: AuthRequest, res: Response) => {
  const email = req.userEmail!
  const cv = storedCVByUser.get(email) ?? emptyCV
  res.json(cv)
})

router.post('/api/improve-summary', requireAuth, async (req: AuthRequest, res: Response) => {
  const parsed = improveSummarySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    })
  }
  const { summary, templateId: rawTemplateId } = parsed.data
  const templateId = normalizeTemplateId(rawTemplateId)
  console.log('improve-summary template:', templateId)
  const templateInstruction = getSummaryPromptTemplate(templateId)
  const prompt = `You are a professional CV writer. ${templateInstruction}\n\nImprove the following professional summary:\n\n${summary}`

  try {
    if (openaiKeyStore) {
      console.log('Using OpenAI for improve-summary')
      const improvedText = await improveWithOpenAI(openaiKeyStore, prompt)
      return res.json({ improvedText: improvedText || summary })
    }
    const model = getGeminiModel()
    const result = await model.generateContent(prompt)
    const response = result.response

    const hasText =
      response.candidates &&
      response.candidates.length > 0 &&
      response.candidates[0].content?.parts?.length > 0

    let improvedText = summary
    if (hasText) {
      try {
        improvedText = response.text().trim() || summary
      } catch (textErr) {
        console.error('Gemini Error: response.text() failed', textErr)
      }
    } else {
      console.warn('Gemini returned blocked/empty response, using original summary')
    }

    return res.json({ improvedText })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    const errorDetails = err instanceof Error ? err.toString() : String(err)
    console.error('AI Error (improve-summary):', err)
    const is429 = errorDetails.includes('429') || errorDetails.includes('quota') || errorDetails.includes('Quota')
    return res.status(500).json({
      success: false,
      message: is429
        ? 'API quota exceeded. Please wait a few minutes or check your API plan.'
        : 'Failed to improve summary',
      error: errorMessage,
      details: errorDetails,
    })
  }
})

router.post('/api/improve-experience', requireAuth, async (req: AuthRequest, res: Response) => {
  const parsed = improveExperienceSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    })
  }
  const { role, company, description, templateId: rawTemplateId } = parsed.data
  const templateId = normalizeTemplateId(rawTemplateId)
  console.log('improve-experience template:', templateId)
  const templateInstruction = getExperiencePromptTemplate(templateId)
  const prompt = `You are a professional CV writer. ${templateInstruction}\n\nRole: ${role}\nCompany: ${company}\n\nDescription to improve:\n${description}`

  try {
    if (openaiKeyStore) {
      console.log('Using OpenAI for improve-experience')
      const improvedText = await improveWithOpenAI(openaiKeyStore, prompt)
      return res.json({ improvedText: improvedText || description })
    }
    const model = getGeminiModel()
    const result = await model.generateContent(prompt)
    const response = result.response

    const hasText =
      response.candidates &&
      response.candidates.length > 0 &&
      response.candidates[0].content?.parts?.length > 0

    let improvedText = description
    if (hasText) {
      try {
        improvedText = response.text().trim() || description
      } catch (textErr) {
        console.error('Gemini Error: response.text() failed', textErr)
      }
    } else {
      console.warn('Gemini returned blocked/empty response, using original description')
    }

    return res.json({ improvedText })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    const errorDetails = err instanceof Error ? err.toString() : String(err)
    console.error('AI Error (improve-experience):', err)
    const is429 = errorDetails.includes('429') || errorDetails.includes('quota') || errorDetails.includes('Quota')
    return res.status(500).json({
      success: false,
      message: is429
        ? 'API quota exceeded. Please wait a few minutes or check your API plan.'
        : 'Failed to improve experience',
      error: errorMessage,
      details: errorDetails,
    })
  }
})

export default router
