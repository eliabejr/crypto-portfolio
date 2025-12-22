import { ref, type Ref } from 'vue'

export interface UseFetchOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useFetch<T>(fetcher: () => Promise<T>, options: UseFetchOptions<T> = {}) {
  const { immediate = true, onSuccess, onError } = options

  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<Error | null>(null)
  const isLoading = ref(false)
  const isError = ref(false)

  const execute = async () => {
    isLoading.value = true
    isError.value = false
    error.value = null

    try {
      const result = await fetcher()
      data.value = result
      onSuccess?.(result)
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err))
      error.value = errorObj
      isError.value = true
      onError?.(errorObj)
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    data.value = null
    error.value = null
    isError.value = false
    isLoading.value = false
  }

  if (immediate) {
    execute()
  }

  return {
    data,
    error,
    isLoading,
    isError,
    execute,
    reset,
  }
}
