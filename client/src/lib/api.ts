import axios from 'axios'
import type { CVData } from './schemas'

const TOKEN_KEY = 'cv_token'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem('cv_user')
      window.dispatchEvent(new Event('cv-auth-logout'))
    }
    return Promise.reject(err)
  }
)

export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: { email: string; name: string } }> {
  try {
    const { data } = await api.post<{ token: string; user: { email: string; name: string } }>(
      '/auth/login',
      { email, password }
    )
    return data
  } catch (err: unknown) {
    const ax = err as { response?: { data?: { message?: string } } }
    throw new Error(ax.response?.data?.message ?? (err instanceof Error ? err.message : 'Login failed'))
  }
}

export async function register(
  email: string,
  password: string,
  name: string
): Promise<{ token: string; user: { email: string; name: string } }> {
  try {
    const { data } = await api.post<{ token: string; user: { email: string; name: string } }>(
      '/auth/register',
      { email, password, name }
    )
    return data
  } catch (err: unknown) {
    const ax = err as { response?: { data?: { message?: string } } }
    throw new Error(ax.response?.data?.message ?? (err instanceof Error ? err.message : 'Registration failed'))
  }
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem('cv_user')
}

export async function setOpenAIKey(key: string): Promise<{ success: boolean; message?: string }> {
  const { data } = await api.post<{ success: boolean; message?: string }>('/admin/set-openai-key', { key })
  return data
}

export async function getOpenAIStatus(): Promise<{ configured: boolean }> {
  const { data } = await api.get<{ configured: boolean }>('/admin/openai-status')
  return data
}

export async function fetchCV(): Promise<CVData> {
  const { data } = await api.get<CVData>('/cv')
  return data
}

export async function saveCV(data: CVData): Promise<{ success: boolean; message?: string }> {
  let payload: Record<string, unknown>
  try {
    payload = {
      personalInfo: data.personalInfo,
      summary: data.summary ?? '',
      experience: data.experience ?? [],
      education: data.education ?? [],
      skills: data.skills ?? [],
      themeColor: data.themeColor ?? 'blue',
      templateId: data.templateId ?? 'classic',
    }
    payload = JSON.parse(JSON.stringify(payload)) as Record<string, unknown>
  } catch (e) {
    console.error('saveCV: serialization failed', e)
    payload = {
      personalInfo: { name: '', email: '', phone: '', location: '' },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      themeColor: data.themeColor ?? 'blue',
      templateId: data.templateId ?? 'classic',
    }
  }
  try {
    const { data: res } = await api.post<{ success: boolean; message?: string }>('/cv/save', payload)
    return res
  } catch (err: unknown) {
    const ax = err as { response?: { status: number; data?: unknown } }
    if (ax.response?.status === 400) {
      console.error('Server 400 response:', ax.response?.data)
    }
    throw err
  }
}

export async function improveSummary(text: string, templateId?: string): Promise<string> {
  try {
    const body: { summary: string; templateId?: string } = { summary: text }
    if (templateId) body.templateId = templateId
    const { data } = await api.post<{ improvedText: string }>('/improve-summary', body)
    return data.improvedText
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { error?: string; details?: string; message?: string } } }
    const serverError = axiosErr.response?.data?.error ?? axiosErr.response?.data?.details ?? axiosErr.response?.data?.message
    if (serverError) {
      console.error('API Error (improve-summary):', serverError, axiosErr.response?.data)
      throw new Error(serverError)
    }
    throw err
  }
}

export async function improveExperience(data: {
  role: string
  company: string
  description: string
  templateId?: string
}): Promise<string> {
  try {
    const { templateId, ...rest } = data
    const body = { ...rest } as { role: string; company: string; description: string; templateId?: string }
    if (templateId) body.templateId = templateId
    const { data: res } = await api.post<{ improvedText: string }>('/improve-experience', body)
    return res.improvedText
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { error?: string; details?: string; message?: string } } }
    const serverError = axiosErr.response?.data?.message ?? axiosErr.response?.data?.error ?? axiosErr.response?.data?.details
    if (serverError) {
      console.error('API Error (improve-experience):', serverError, axiosErr.response?.data)
      throw new Error(serverError)
    }
    throw err
  }
}
