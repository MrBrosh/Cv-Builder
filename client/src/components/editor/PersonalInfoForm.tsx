import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useCV } from '../../context/CVContext'
import {
  personalInfoFormSchema,
  type PersonalInfoFormData,
} from '../../lib/schemas'
import { Button, Input, Card, CardHeader, CardTitle } from '../ui'

export function PersonalInfoForm() {
  const { cvData, saveCV, isSaving } = useCV()
  const pi = cvData.personalInfo ?? { name: '', email: '', phone: '', location: '' }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoFormSchema),
    defaultValues: {
      name: pi.name ?? '',
      email: pi.email ?? '',
      phone: pi.phone ?? '',
      location: pi.location ?? '',
    },
  })

  useEffect(() => {
    const info = cvData.personalInfo
    reset({
      name: info?.name ?? '',
      email: info?.email ?? '',
      phone: info?.phone ?? '',
      location: info?.location ?? '',
    })
  }, [cvData.personalInfo, reset])

  async function onSubmit(data: PersonalInfoFormData) {
    try {
      await saveCV({
        ...cvData,
        personalInfo: {
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          location: data.location || undefined,
        },
      })
      reset(data)
      toast.success('Personal information saved', {
        description: 'Your personal details have been updated.',
      })
    } catch (err) {
      toast.error('Failed to save', {
        description: err instanceof Error ? err.message : 'An error occurred.',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-bold">
            👤
          </span>
          Personal information
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Input
          label="Name"
          {...register('name')}
          error={errors.name?.message}
          placeholder="John Doe"
        />
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="john@example.com"
        />
        <Input
          label="Phone"
          {...register('phone')}
          error={errors.phone?.message}
          placeholder="+1 234 567 8900"
        />
        <Input
          label="Location"
          {...register('location')}
          error={errors.location?.message}
          placeholder="City, Country"
        />
        <Button
          type="submit"
          variant="primary"
          isLoading={isSaving}
          disabled={!isDirty}
        >
          Save
        </Button>
      </form>
    </Card>
  )
}
