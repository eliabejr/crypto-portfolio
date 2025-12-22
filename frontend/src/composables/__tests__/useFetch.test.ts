import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { useFetch } from '../useFetch'

describe('useFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const fetcher = vi.fn().mockResolvedValue('data')
    const { data, error, isLoading, isError } = useFetch(fetcher, { immediate: false })

    expect(data.value).toBeNull()
    expect(error.value).toBeNull()
    expect(isLoading.value).toBe(false)
    expect(isError.value).toBe(false)
  })

  it('should execute immediately by default', async () => {
    const mockData = { id: 1, name: 'Test' }
    const fetcher = vi.fn().mockResolvedValue(mockData)
    const { data, isLoading } = useFetch(fetcher)

    expect(isLoading.value).toBe(true)
    expect(fetcher).toHaveBeenCalledTimes(1)

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(data.value).toEqual(mockData)
    expect(isLoading.value).toBe(false)
  })

  it('should not execute when immediate is false', () => {
    const fetcher = vi.fn().mockResolvedValue('data')
    const { isLoading } = useFetch(fetcher, { immediate: false })

    expect(isLoading.value).toBe(false)
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('should handle successful fetch', async () => {
    const mockData = { id: 1, name: 'Test' }
    const fetcher = vi.fn().mockResolvedValue(mockData)
    const { data, error, isLoading, isError, execute } = useFetch(fetcher, {
      immediate: false,
    })

    await execute()
    await nextTick()

    expect(data.value).toEqual(mockData)
    expect(error.value).toBeNull()
    expect(isLoading.value).toBe(false)
    expect(isError.value).toBe(false)
  })

  it('should handle fetch errors', async () => {
    const mockError = new Error('Fetch failed')
    const fetcher = vi.fn().mockRejectedValue(mockError)
    const { data, error, isLoading, isError, execute } = useFetch(fetcher, {
      immediate: false,
    })

    await execute()
    await nextTick()

    expect(data.value).toBeNull()
    expect(error.value).toEqual(mockError)
    expect(isLoading.value).toBe(false)
    expect(isError.value).toBe(true)
  })

  it('should handle non-Error exceptions', async () => {
    const fetcher = vi.fn().mockRejectedValue('String error')
    const { error, isError, execute } = useFetch(fetcher, { immediate: false })

    await execute()
    await nextTick()

    expect(error.value).toBeInstanceOf(Error)
    expect(error.value?.message).toBe('String error')
    expect(isError.value).toBe(true)
  })

  it('should call onSuccess callback on successful fetch', async () => {
    const mockData = { id: 1, name: 'Test' }
    const fetcher = vi.fn().mockResolvedValue(mockData)
    const onSuccess = vi.fn()
    const { execute } = useFetch(fetcher, {
      immediate: false,
      onSuccess,
    })

    await execute()
    await nextTick()

    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledWith(mockData)
  })

  it('should call onError callback on failed fetch', async () => {
    const mockError = new Error('Fetch failed')
    const fetcher = vi.fn().mockRejectedValue(mockError)
    const onError = vi.fn()
    const { execute } = useFetch(fetcher, {
      immediate: false,
      onError,
    })

    await execute()
    await nextTick()

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(mockError)
  })

  it('should reset state correctly', async () => {
    const mockData = { id: 1, name: 'Test' }
    const fetcher = vi.fn().mockResolvedValue(mockData)
    const { data, error, isLoading, isError, execute, reset } = useFetch(fetcher, {
      immediate: false,
    })

    await execute()
    await nextTick()

    expect(data.value).toEqual(mockData)
    expect(isLoading.value).toBe(false)

    reset()

    expect(data.value).toBeNull()
    expect(error.value).toBeNull()
    expect(isLoading.value).toBe(false)
    expect(isError.value).toBe(false)
  })

  it('should reset state after error', async () => {
    const mockError = new Error('Fetch failed')
    const fetcher = vi.fn().mockRejectedValue(mockError)
    const { error, isError, execute, reset } = useFetch(fetcher, {
      immediate: false,
    })

    await execute()
    await nextTick()

    expect(error.value).toEqual(mockError)
    expect(isError.value).toBe(true)

    reset()

    expect(error.value).toBeNull()
    expect(isError.value).toBe(false)
  })

  it('should handle multiple execute calls', async () => {
    const mockData1 = { id: 1, name: 'Test 1' }
    const mockData2 = { id: 2, name: 'Test 2' }
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2)
    const { data, execute } = useFetch(fetcher, { immediate: false })

    await execute()
    await nextTick()
    expect(data.value).toEqual(mockData1)

    await execute()
    await nextTick()
    expect(data.value).toEqual(mockData2)

    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('should update loading state during fetch', async () => {
    let resolvePromise: (value: string) => void
    const promise = new Promise<string>(resolve => {
      resolvePromise = resolve
    })
    const fetcher = vi.fn().mockReturnValue(promise)
    const { isLoading, execute } = useFetch(fetcher, { immediate: false })

    const executePromise = execute()
    await nextTick()

    expect(isLoading.value).toBe(true)

    resolvePromise!('data')
    await executePromise
    await nextTick()

    expect(isLoading.value).toBe(false)
  })

  it('should handle null and undefined return values', async () => {
    const fetcherNull = vi.fn().mockResolvedValue(null)
    const fetcherUndefined = vi.fn().mockResolvedValue(undefined)

    const { data: dataNull, execute: executeNull } = useFetch(fetcherNull, {
      immediate: false,
    })
    const { data: dataUndefined, execute: executeUndefined } = useFetch(
      fetcherUndefined,
      { immediate: false }
    )

    await executeNull()
    await nextTick()
    expect(dataNull.value).toBeNull()

    await executeUndefined()
    await nextTick()
    expect(dataUndefined.value).toBeUndefined()
  })
})
