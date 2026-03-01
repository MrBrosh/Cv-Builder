import type { ComponentType } from 'react'
import type { CVTemplateProps } from './types'
import { ClassicTemplate } from './ClassicTemplate'
import { ModernTemplate } from './ModernTemplate'
import { MinimalTemplate } from './MinimalTemplate'
import { CreativeTemplate } from './CreativeTemplate'

export type CVTemplateId = 'classic' | 'modern' | 'minimal' | 'creative'

export const CV_LAYOUT_TEMPLATES: Record<CVTemplateId, ComponentType<CVTemplateProps>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
}

export { ClassicTemplate, ModernTemplate, MinimalTemplate, CreativeTemplate }
export type { CVTemplateProps } from './types'
export { descriptionToLines } from './types'
