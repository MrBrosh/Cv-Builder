/**
 * Writing templates for AI-improved CV text.
 * Each template has STRICT format rules so the output is clearly different.
 */

export type TemplateId = 'classic' | 'modern' | 'minimal' | 'creative'

const SUMMARY_INSTRUCTIONS: Record<TemplateId, string> = {
  classic:
    'STRICT FORMAT: Write exactly 2–3 full, formal sentences. No bullet points. No line breaks. Traditional third-person professional tone (e.g. "Professional with over X years..."). Use complete sentences only. Keep the same language as the input (if Hebrew, respond in Hebrew).',
  modern:
    'STRICT FORMAT: Output ONLY bullet points. Each line must start with a strong action verb (Led, Delivered, Increased, Built). Include at least one number or metric (%, years, team size). 3–5 bullets total. No paragraphs. Keep the same language as the input (if Hebrew, respond in Hebrew).',
  minimal:
    'STRICT FORMAT: Maximum 5–7 words per line. One keyword or short phrase per line. No full sentences. No bullet symbols. 4–6 lines total. Example format: "Senior developer\n5+ years experience\nTeam leadership\nPython Java". Keep the same language as the input (if Hebrew, respond in Hebrew).',
  creative:
    'STRICT FORMAT: Write exactly one flowing paragraph (3–5 sentences). More personal and narrative. You may use first person ("I am...", "I bring...") or a storytelling tone. No bullet points. Memorable and distinctive. Keep the same language as the input (if Hebrew, respond in Hebrew).',
}

const EXPERIENCE_INSTRUCTIONS: Record<TemplateId, string> = {
  classic:
    'STRICT FORMAT: Rewrite as 2–4 full sentences in one paragraph. Formal tone. Focus on responsibilities and duties. No bullet points. No line breaks. Keep the same language as the input (if Hebrew, respond in Hebrew).',
  modern:
    'STRICT FORMAT: Rewrite ONLY as bullet points. Each bullet must start with an action verb (Managed, Developed, Achieved). Include numbers or metrics where possible. 3–5 bullets. No paragraphs. Keep the same language as the input (if Hebrew, respond in Hebrew).',
  minimal:
    'STRICT FORMAT: Maximum 5–7 words per line. One short phrase per line. No full sentences. 3–5 lines. Example: "Led backend team\nShipped 3 products\nReduced latency 40%". Keep the same language as the input (if Hebrew, respond in Hebrew).',
  creative:
    'STRICT FORMAT: Rewrite as one short paragraph (2–4 sentences) with a narrative, story-like flow. Show impact and personality. No bullet points. Keep the same language as the input (if Hebrew, respond in Hebrew).',
}

export function getSummaryPromptTemplate(templateId: TemplateId): string {
  return SUMMARY_INSTRUCTIONS[templateId] ?? SUMMARY_INSTRUCTIONS.classic
}

export function getExperiencePromptTemplate(templateId: TemplateId): string {
  return EXPERIENCE_INSTRUCTIONS[templateId] ?? EXPERIENCE_INSTRUCTIONS.classic
}

export function normalizeTemplateId(value: unknown): TemplateId {
  if (value === 'modern' || value === 'minimal' || value === 'creative') return value
  return 'classic'
}
