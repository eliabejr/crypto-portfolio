import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const value = ref('initial')
    const debounced = useDebounce(value)

    expect(debounced.value).toBe('initial')
  })

  it('should debounce value changes with default delay', async () => {
    const value = ref('initial')
    const debounced = useDebounce(value)

    value.value = 'updated'
    await nextTick()
    expect(debounced.value).toBe('initial')

    vi.advanceTimersByTime(300)
    await nextTick()
    expect(debounced.value).toBe('updated')
  })

  it('should debounce value changes with custom delay', async () => {
    const value = ref('initial')
    const debounced = useDebounce(value, 500)

    value.value = 'updated'
    await nextTick()
    expect(debounced.value).toBe('initial')

    vi.advanceTimersByTime(300)
    await nextTick()
    expect(debounced.value).toBe('initial')

    vi.advanceTimersByTime(200)
    await nextTick()
    expect(debounced.value).toBe('updated')
  })

  it('should cancel previous timeout when value changes rapidly', async () => {
    const value = ref('initial')
    const debounced = useDebounce(value, 300)

    value.value = 'first'
    await nextTick()
    vi.advanceTimersByTime(200)
    await nextTick()
    expect(debounced.value).toBe('initial')

    value.value = 'second'
    await nextTick()
    vi.advanceTimersByTime(200)
    await nextTick()
    expect(debounced.value).toBe('initial')

    vi.advanceTimersByTime(100)
    await nextTick()
    expect(debounced.value).toBe('second')
  })

  it('should handle multiple rapid changes correctly', async () => {
    const value = ref(0)
    const debounced = useDebounce(value, 300)

    value.value = 1
    await nextTick()
    vi.advanceTimersByTime(100)
    await nextTick()
    expect(debounced.value).toBe(0)

    value.value = 2
    await nextTick()
    vi.advanceTimersByTime(100)
    await nextTick()
    expect(debounced.value).toBe(0)

    value.value = 3
    await nextTick()
    vi.advanceTimersByTime(100)
    await nextTick()
    expect(debounced.value).toBe(0)

    vi.advanceTimersByTime(200)
    await nextTick()
    expect(debounced.value).toBe(3)
  })

  it('should work with different value types', async () => {
    const stringValue = ref('test')
    const numberValue = ref(42)
    const booleanValue = ref(true)
    const objectValue = ref({ key: 'value' })

    const debouncedString = useDebounce(stringValue, 100)
    const debouncedNumber = useDebounce(numberValue, 100)
    const debouncedBoolean = useDebounce(booleanValue, 100)
    const debouncedObject = useDebounce(objectValue, 100)

    stringValue.value = 'updated'
    numberValue.value = 100
    booleanValue.value = false
    objectValue.value = { key: 'newValue' }

    await nextTick()
    vi.advanceTimersByTime(100)
    await nextTick()

    expect(debouncedString.value).toBe('updated')
    expect(debouncedNumber.value).toBe(100)
    expect(debouncedBoolean.value).toBe(false)
    expect(debouncedObject.value).toEqual({ key: 'newValue' })
  })

  it('should handle immediate option correctly', async () => {
    const value = ref('initial')
    const debounced = useDebounce(value, 300)

    expect(debounced.value).toBe('initial')

    value.value = 'updated'
    await nextTick()
    vi.advanceTimersByTime(300)
    await nextTick()
    expect(debounced.value).toBe('updated')
  })
})
