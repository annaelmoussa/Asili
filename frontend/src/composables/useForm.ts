import { ref, reactive, type Ref, type UnwrapRef } from 'vue'
import { z, ZodObject, type ZodRawShape } from 'zod'

type FormData = Record<string, any>
type Transformations<T extends FormData> = Partial<Record<keyof T, (value: any) => any>>
type Errors<T extends FormData> = Partial<Record<keyof T, string>>

export function useForm<T extends FormData>(
  initialData: T,
  transformations: Transformations<T>,
  validationSchema: ZodObject<ZodRawShape>,
  onSubmit: (data: UnwrapRef<T>, signal: AbortSignal) => Promise<void>
) {
  const formData = reactive<T>({ ...initialData })
  const errors = reactive<Errors<T>>({})
  const serverError: Ref<string | null> = ref(null)
  const isSubmitting = ref(false)
  let abortController: AbortController | null = null

  const applyTransformations = (field: keyof T, value: any): any => {
    if (transformations[field]) {
      return transformations[field]!(value)
    }
    return value
  }

  const updateField = (field: keyof T, value: any): void => {
    ;(formData as any)[field] = applyTransformations(field, value)
    validateField(field)
  }

  const validateField = (field: keyof T): void => {
    try {
      validationSchema.shape[field as string].parse((formData as any)[field])
      delete (errors as any)[field]
    } catch (error) {
      if (error instanceof z.ZodError) {
        ;(errors as any)[field] = error.errors[0].message
      }
    }
  }

  const validateForm = (): boolean => {
    try {
      validationSchema.parse(formData)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0]) {
            ;(errors as any)[err.path[0] as keyof T] = err.message
          }
        })
      }
      return false
    }
  }

  const submit = async (): Promise<void> => {
    if (validateForm()) {
      isSubmitting.value = true
      serverError.value = null
      abortController = new AbortController()

      try {
        await onSubmit(formData as UnwrapRef<T>, abortController.signal)
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.log('Requête annulée')
          } else {
            serverError.value = error.message
          }
        }
      } finally {
        isSubmitting.value = false
      }
    }
  }

  const cancelSubmit = (): void => {
    if (abortController) {
      abortController.abort()
    }
  }

  return {
    formData,
    errors,
    serverError,
    isSubmitting,
    updateField,
    submit,
    cancelSubmit
  }
}
