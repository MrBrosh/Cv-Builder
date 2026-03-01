import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd'
import { toast } from 'sonner'
import { useCV } from '../../context/CVContext'
import { useAI } from '../../hooks/useAI'
import { formatDateForDisplay } from '../../lib/utils'
import {
  experienceEntrySchema,
  type ExperienceEntry,
} from '../../lib/schemas'
import { Button, Input, Textarea, DateField, Card, CardHeader, CardTitle } from '../ui'
import { Sparkles, Trash2, GripVertical } from 'lucide-react'

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = [...list]
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export function ExperienceSection() {
  const { cvData, saveCV, reorderExperience, selectedTemplateId } = useCV()
  const { generateExperience, isGenerating, error } = useAI()
  const experiences = cvData.experience ?? []
  const [ordered, setOrdered] = useState<ExperienceEntry[]>(experiences)

  useEffect(() => {
    setOrdered(experiences)
  }, [experiences])

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ExperienceEntry>({
    resolver: zodResolver(experienceEntrySchema),
    mode: 'onChange',
    defaultValues: {
      role: '',
      company: '',
      description: '',
      startDate: '',
      endDate: '',
    },
  })

  const role = watch('role')
  const company = watch('company')
  const description = watch('description')

  async function onAdd(data: ExperienceEntry) {
    try {
      const next: ExperienceEntry[] = [
        ...experiences,
        {
          role: data.role,
          company: data.company,
          description: data.description,
          startDate: data.startDate || undefined,
          endDate: data.endDate || undefined,
        },
      ]
      await saveCV({ ...cvData, experience: next })
      reset()
      toast.success('Experience added', {
        description: `${data.role} at ${data.company} has been added.`,
      })
    } catch (err) {
      toast.error('Failed to add experience', {
        description: err instanceof Error ? err.message : 'An error occurred.',
      })
    }
  }

  async function removeAt(index: number) {
    try {
      const removed = ordered[index]
      const next = ordered.filter((_, i) => i !== index)
      setOrdered(next)
      await saveCV({ ...cvData, experience: next })
      toast.success('Experience removed', {
        description: `${removed.role} has been removed.`,
      })
    } catch (err) {
      toast.error('Failed to remove experience', {
        description: err instanceof Error ? err.message : 'An error occurred.',
      })
    }
  }

  function onDragEnd(result: DropResult) {
    if (result.destination == null) return
    const start = result.source.index
    const end = result.destination.index
    if (start === end) return
    const next = reorder(ordered, start, end)
    setOrdered(next)
    reorderExperience(next)
  }

  async function handleAIImprove() {
    if (!role.trim() || !company.trim() || !description.trim()) return
    try {
      const improved = await generateExperience(role, company, description, selectedTemplateId ?? cvData.templateId ?? 'classic')
      setValue('description', improved, { shouldDirty: true })
      toast.success('Description improved', {
        description: 'AI has enhanced your experience description.',
      })
    } catch {
      // error state handled by useAI
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white text-sm font-bold">
            💼
          </span>
          Experience
        </CardTitle>
      </CardHeader>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="experience-list">
          {(provided) => (
            <ul
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="mb-4 space-y-3"
            >
              {ordered.map((exp, i) => (
                <Draggable
                  key={`exp-${i}`}
                  draggableId={`exp-${i}`}
                  index={i}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex items-start gap-2 rounded-xl border border-slate-600/60 bg-slate-700/40 backdrop-blur-sm px-3 py-2 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary-500/40 hover:bg-slate-700/60"
                    >
                      <span
                        {...provided.dragHandleProps}
                        className="mt-0.5 flex shrink-0 cursor-grab touch-none rounded p-1 text-slate-400 transition-colors hover:bg-slate-600 hover:text-slate-200 active:cursor-grabbing"
                        aria-label="Drag to reorder"
                      >
                        <GripVertical className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900">{exp.role}</p>
                        <p className="text-sm text-slate-600">{exp.company}</p>
                        {(exp.startDate || exp.endDate) && (
                          <p className="text-xs text-slate-500">
                            {[exp.startDate, exp.endDate]
                              .filter(Boolean)
                              .map((d) => formatDateForDisplay(d ?? ''))
                              .join(' – ')}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-slate-300">
                          {exp.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void removeAt(i)}
                        className="shrink-0 rounded p-1.5 text-slate-400 transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:scale-110"
                        aria-label="Remove experience"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      <form onSubmit={handleSubmit(onAdd)} className="space-y-3">
        <Input
          label="Role"
          {...register('role')}
          error={errors.role?.message}
          placeholder="e.g. Software Engineer"
        />
        <Input
          label="Company"
          {...register('company')}
          error={errors.company?.message}
          placeholder="e.g. Acme Inc."
        />
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-200">
              Description
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAIImprove}
              disabled={
                isGenerating ||
                !role.trim() ||
                !company.trim() ||
                !description.trim()
              }
              className="gap-1"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Improve
            </Button>
          </div>
          <Textarea
            {...register('description')}
            error={errors.description?.message}
            placeholder="Describe your responsibilities and achievements…"
          />
          {error && (
            <p className="mt-1 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <DateField
            label="Start date"
            {...register('startDate')}
            error={errors.startDate?.message}
          />
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DateField
                label="End date"
                ref={field.ref}
                name={field.name}
                onBlur={field.onBlur}
                value={field.value === 'Present' ? '' : (field.value ?? '')}
                onChange={(e) => field.onChange(e.target.value)}
                error={errors.endDate?.message}
                showPresentOption
                isPresent={field.value === 'Present'}
                onPresentChange={(checked) => field.onChange(checked ? 'Present' : '')}
              />
            )}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid || isSubmitting}
        >
          Add experience
        </Button>
      </form>
    </Card>
  )
}
