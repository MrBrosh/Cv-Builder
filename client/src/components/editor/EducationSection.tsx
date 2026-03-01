import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd'
import { useCV } from '../../context/CVContext'
import {
  educationEntrySchema,
  type EducationEntry,
} from '../../lib/schemas'
import { ISRAELI_INSTITUTES, DEGREE_TYPES } from '../../lib/constants'
import { formatDateForDisplay } from '../../lib/utils'
import { Button, Input, DateField, Card, CardHeader, CardTitle } from '../ui'
import { Trash2, GripVertical } from 'lucide-react'

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = [...list]
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export function EducationSection() {
  const { cvData, addEducation, removeEducation, reorderEducation } = useCV()
  const education = cvData.education ?? []
  const [ordered, setOrdered] = useState<EducationEntry[]>(education)

  useEffect(() => {
    setOrdered(education)
  }, [education])

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<EducationEntry>({
    resolver: zodResolver(educationEntrySchema),
    mode: 'onChange',
    defaultValues: {
      degree: '',
      institution: '',
      startDate: '',
      endDate: '',
    },
  })

  function onAdd(data: EducationEntry) {
    addEducation({
      degree: data.degree,
      institution: data.institution,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
    })
    reset()
  }

  function removeAt(index: number) {
    removeEducation(index)
  }

  function onDragEnd(result: DropResult) {
    if (result.destination == null) return
    const start = result.source.index
    const end = result.destination.index
    if (start === end) return
    const next = reorder(ordered, start, end)
    setOrdered(next)
    reorderEducation(next)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white shadow-md">
            🎓
          </span>
          Education
        </CardTitle>
      </CardHeader>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="education-list">
          {(provided) => (
            <ul
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="mb-4 space-y-3"
            >
              {ordered.map((edu, i) => (
                <Draggable
                  key={`edu-${i}`}
                  draggableId={`edu-${i}`}
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
                        <p className="font-medium text-slate-100">{edu.degree}</p>
                        <p className="text-sm text-slate-300">{edu.institution}</p>
                        {(edu.startDate || edu.endDate) && (
                          <p className="text-xs text-slate-400">
                            {[edu.startDate, edu.endDate]
                              .filter(Boolean)
                              .map((d) => formatDateForDisplay(d ?? ''))
                              .join(' – ')}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAt(i)}
                        className="shrink-0 rounded p-1.5 text-slate-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-400 hover:scale-110"
                        aria-label="Remove education"
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
        <datalist id="degree-list">
          {DEGREE_TYPES.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>
        <datalist id="institution-list">
          {ISRAELI_INSTITUTES.map((inst) => (
            <option key={inst} value={inst} />
          ))}
        </datalist>

        <Input
          label="Degree"
          {...register('degree')}
          list="degree-list"
          error={errors.degree?.message}
          placeholder="e.g. B.Sc, M.A, Practical Engineer"
        />
        <Input
          label="Institution"
          {...register('institution')}
          list="institution-list"
          error={errors.institution?.message}
          placeholder="e.g. Technion, Tel Aviv University"
        />
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
          Add education
        </Button>
      </form>
    </Card>
  )
}
