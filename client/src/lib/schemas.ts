import { z } from 'zod'

// 1. Education Entry (Added ID for DnD & stricter validation)
export const educationEntrySchema = z.object({
  id: z.string().uuid().optional(), // ID is crucial for Drag & Drop
  degree: z.string().min(1, 'Degree is required').max(100, 'Degree must be less than 100 characters'),
  institution: z.string().min(1, 'Institution is required').max(100, 'Institution must be less than 100 characters'),
  startDate: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$|^$/, 'Invalid date format').optional(),
  endDate: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$|^Present$|^$/, 'Invalid date or use Present').optional(),
})

// 2. Experience Entry (Added ID for DnD)
export const experienceEntrySchema = z.object({
  id: z.string().uuid().optional(), // ID is crucial for Drag & Drop
  role: z.string().min(1, 'Role is required').max(100, 'Role must be less than 100 characters'),
  company: z.string().min(1, 'Company is required').max(100, 'Company must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
  startDate: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$|^$/, 'Invalid date format').optional(),
  endDate: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$|^Present$|^$/, 'Invalid date or use Present').optional(),
})

// 3. Skills Schema (Max 20 items, max 50 chars each)
export const skillsSchema = z
  .array(z.string().min(1, 'Skill cannot be empty').max(50, 'Skill must be less than 50 characters'))
  .max(20, 'Maximum 20 skills allowed')

// 4. Personal Info Schema
export const personalInfoFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address').min(5, 'Email is too short'),
  phone: z.string().regex(/^[\d\s\-\+\(\)]+$|^$/, 'Invalid phone number format').optional().or(z.literal('')), 
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  themeColor: z.string().optional(), // Moved themeColor here as part of user prefs usually, or keep in root
})

// 5. Main CV Schema
export const cvSchema = z.object({
  personalInfo: personalInfoFormSchema,
  summary: z.string().optional(),
  experience: z.array(experienceEntrySchema),
  education: z.array(educationEntrySchema), // Using the defined schema
  skills: skillsSchema, // Using the strict skills schema
  themeColor: z.string().optional(), // Kept at root as per your original structure
  templateId: z.enum(['classic', 'modern', 'minimal', 'creative']).optional(),
})

// Types
export type CVData = z.infer<typeof cvSchema>
export type PersonalInfoFormData = z.infer<typeof personalInfoFormSchema>
export type ExperienceEntry = z.infer<typeof experienceEntrySchema>
export type EducationEntry = z.infer<typeof educationEntrySchema>

// Default Empty Data
export const emptyCVData: CVData = {
  personalInfo: { name: '', email: '', phone: '', location: '', themeColor: 'blue' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  themeColor: 'blue',
  templateId: 'classic',
}
