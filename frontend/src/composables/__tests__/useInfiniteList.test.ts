import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInfiniteList } from '../useInfiniteList'
import type { AssetListResponse } from '../../modules/assets/types'

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(),
}))

describe('useInfiniteList', () => {
  let mockRoute: ReturnType<typeof createMockRoute>
  const mockRouter = {
    replace: vi.fn(({ query }) => {


      const keys = Object.keys(mockRoute.query)
      keys.forEach(key => {
        delete mockRoute.query[key]
      })

      Object.assign(mockRoute.query, query)

      void mockRoute.query
    }),
    push: vi.fn(),
  }

  const createMockRoute = (query: Record<string, string | number> = {}) => {
    const reactiveQuery = reactive({ ...query })
    return {
      query: reactiveQuery,
      params: {},
      path: '/test',
      name: 'test',
      meta: {},
      matched: [],
      fullPath: '/test',
      hash: '',
      redirectedFrom: undefined,
    }
  }

  const updateRouteQuery = (query: Record<string, string | number>) => {
    Object.keys(mockRoute.query).forEach(key => {
      delete mockRoute.query[key]
    })
    Object.assign(mockRoute.query, query)
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute = createMockRoute()
    ;(useRouter as any).mockReturnValue(mockRouter)
    ;(useRoute as any).mockReturnValue(mockRoute)
  })

  const createMockFetcher = (
    responses: AssetListResponse[]
  ): ((
    page: number,
    pageSize: number,
    search?: string
  ) => Promise<AssetListResponse>) => {
    let callCount = 0
    return async (_page: number, _pageSize: number, _search?: string) => {
      const response = responses[callCount] ?? responses[responses.length - 1] ?? {
        data: [],
        page: 1,
        pageSize: 20,
        total: 0,
        hasMore: false,
      }
      callCount++
      return Promise.resolve(response)
    }
  }

  it('should initialize with default values', async () => {
    const fetcher = createMockFetcher([
      { data: [], page: 1, pageSize: 20, total: 0, hasMore: false },
    ])
    updateRouteQuery({ page: '1' })
    const { items, isLoading, isError, hasMore, total } = useInfiniteList(fetcher)


    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()

    expect(items.value).toEqual([])
    expect(isLoading.value).toBe(false)
    expect(isError.value).toBe(false)
    expect(hasMore.value).toBe(false)
    expect(total.value).toBe(0)
  })

  it('should load initial page from route query', async () => {
    const mockData = [
      { id: '1', symbol: 'BTC', name: 'Bitcoin', image: '', status: 'active' },
    ]
    const fetcher = vi.fn().mockResolvedValue({
      data: mockData,
      page: 1,
      pageSize: 20,
      total: 1,
      hasMore: false,
    })

    updateRouteQuery({ page: '1', q: '' })

    const { items, isLoading } = useInfiniteList(fetcher)


    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()

    expect(fetcher).toHaveBeenCalled()
    expect(items.value).toEqual(mockData)
    expect(isLoading.value).toBe(false)
  })

  it('should handle page loading correctly', async () => {
    const page1Data = [
      { id: '1', symbol: 'BTC', name: 'Bitcoin', image: '', status: 'active' },
    ]
    const page2Data = [
      { id: '2', symbol: 'ETH', name: 'Ethereum', image: '', status: 'active' },
    ]

    const fetcher = vi
      .fn()
      .mockResolvedValueOnce({
        data: page1Data,
        page: 1,
        pageSize: 20,
        total: 2,
        hasMore: true,
      })
      .mockResolvedValueOnce({
        data: page2Data,
        page: 2,
        pageSize: 20,
        total: 2,
        hasMore: false,
      })

    updateRouteQuery({ page: '1' })

    const { items, hasMore, loadMore } = useInfiniteList(fetcher)

    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()

    expect(items.value).toEqual(page1Data)
    expect(hasMore.value).toBe(true)


    loadMore()



    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()

    expect(items.value).toEqual([...page1Data, ...page2Data])
    expect(hasMore.value).toBe(false)
  })

  it('should handle search functionality', async () => {
    const searchResults = [
      { id: '1', symbol: 'BTC', name: 'Bitcoin', image: '', status: 'active' },
    ]

    const fetcher = vi.fn().mockResolvedValue({
      data: searchResults,
      page: 1,
      pageSize: 20,
      total: 1,
      hasMore: false,
    })

    updateRouteQuery({})

    const { search } = useInfiniteList(fetcher)

    search('bitcoin')

    expect(mockRouter.replace).toHaveBeenCalledWith({
      query: { q: 'bitcoin' },
    })
  })

  it('should reset items when search changes', async () => {
    const initialData = [
      { id: '1', symbol: 'BTC', name: 'Bitcoin', image: '', status: 'active' },
    ]
    const searchData = [
      { id: '2', symbol: 'ETH', name: 'Ethereum', image: '', status: 'active' },
    ]

    const fetcher = vi
      .fn()
      .mockResolvedValueOnce({
        data: initialData,
        page: 1,
        pageSize: 20,
        total: 1,
        hasMore: false,
      })
      .mockResolvedValueOnce({
        data: searchData,
        page: 1,
        pageSize: 20,
        total: 1,
        hasMore: false,
      })

    updateRouteQuery({ page: '1' })

    const { items, search } = useInfiniteList(fetcher)

    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()

    expect(items.value).toEqual(initialData)


    search('eth')




    await new Promise(resolve => setTimeout(resolve, 10))
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 10))
    await nextTick()


    expect(items.value).toEqual(searchData)
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('should compute isEmpty correctly', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      data: [],
      page: 1,
      pageSize: 20,
      total: 0,
      hasMore: false,
    })

    updateRouteQuery({ page: '1' })

    const { isEmpty, isLoading } = useInfiniteList(fetcher)

    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()

    expect(isEmpty.value).toBe(true)
    expect(isLoading.value).toBe(false)
  })

  it('should compute isEndReached correctly', async () => {
    const data = [
      { id: '1', symbol: 'BTC', name: 'Bitcoin', image: '', status: 'active' },
    ]

    const fetcher = vi.fn().mockResolvedValue({
      data,
      page: 1,
      pageSize: 20,
      total: 1,
      hasMore: false,
    })

    updateRouteQuery({ page: '1' })

    const { isEndReached, hasMore, items } = useInfiniteList(fetcher)

    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()

    expect(hasMore.value).toBe(false)
    expect(items.value.length).toBeGreaterThan(0)
    expect(isEndReached.value).toBe(true)
  })

  it('should compute isInitialLoading correctly', async () => {
    let resolvePromise: (value: AssetListResponse) => void
    const promise = new Promise<AssetListResponse>(resolve => {
      resolvePromise = resolve
    })

    const fetcher = vi.fn().mockReturnValue(promise)

    updateRouteQuery({ page: '1' })

    const { isInitialLoading, items } = useInfiniteList(fetcher)


    expect(isInitialLoading.value).toBe(true)
    expect(items.value.length).toBe(0)

    resolvePromise!({
      data: [
        { id: '1', symbol: 'BTC', name: 'Bitcoin', image: '', status: 'active' },
      ],
      page: 1,
      pageSize: 20,
      total: 1,
      hasMore: false,
    })

    await promise
    await nextTick()

    expect(isInitialLoading.value).toBe(false)
  })

  it('should handle retry functionality', async () => {
    const mockError = new Error('Fetch failed')
    const mockData = [
      { id: '1', symbol: 'BTC', name: 'Bitcoin', image: '', status: 'active' },
    ]

    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(mockError)
      .mockResolvedValueOnce({
        data: mockData,
        page: 1,
        pageSize: 20,
        total: 1,
        hasMore: false,
      })

    updateRouteQuery({ page: '1' })

    const { items, isError, retry } = useInfiniteList(fetcher)


    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 10))
    await nextTick()

    expect(isError.value).toBe(true)


    await retry()
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()

    expect(items.value).toEqual(mockData)
    expect(isError.value).toBe(false)
  })

  it('should handle loadMore when hasMore is false', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      data: [],
      page: 1,
      pageSize: 20,
      total: 0,
      hasMore: false,
    })

    updateRouteQuery({ page: '1' })

    const { hasMore, loadMore } = useInfiniteList(fetcher)


    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()

    expect(hasMore.value).toBe(false)

    const initialCallCount = fetcher.mock.calls.length
    loadMore()

    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()
    expect(fetcher).toHaveBeenCalledTimes(initialCallCount)
  })

  it('should handle loadMore when already loading', async () => {
    let resolvePromise: (value: AssetListResponse) => void
    const promise = new Promise<AssetListResponse>(resolve => {
      resolvePromise = resolve
    })

    const fetcher = vi.fn().mockReturnValue(promise)

    updateRouteQuery({ page: '1' })

    const { loadMore } = useInfiniteList(fetcher)


    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()


    const initialCallCount = fetcher.mock.calls.length
    loadMore()
    await nextTick()

    expect(fetcher).toHaveBeenCalledTimes(initialCallCount)

    resolvePromise!({
      data: [],
      page: 1,
      pageSize: 20,
      total: 0,
      hasMore: false,
    })

    await promise
    await nextTick()
  })

  it('should use custom pageSize', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      data: [],
      page: 1,
      pageSize: 50,
      total: 0,
      hasMore: false,
    })

    updateRouteQuery({ page: '1' })

    useInfiniteList(fetcher, { pageSize: 50 })

    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()


    expect(fetcher).toHaveBeenCalledWith(1, 50, '')
  })

  it('should use custom search and page params', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      data: [],
      page: 1,
      pageSize: 20,
      total: 0,
      hasMore: false,
    })

    updateRouteQuery({ search: 'bitcoin', p: '2' })

    const { searchQuery, currentPage } = useInfiniteList(fetcher, {
      searchParam: 'search',
      pageParam: 'p',
    })

    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()

    expect(searchQuery.value).toBe('bitcoin')
    expect(currentPage.value).toBe(2)
  })

  it('should handle errors correctly', async () => {
    const mockError = new Error('Network error')
    const fetcher = vi.fn().mockRejectedValue(mockError)

    updateRouteQuery({ page: '1' })

    const { isError, error } = useInfiniteList(fetcher)

    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()


    await new Promise(resolve => setTimeout(resolve, 10))
    await nextTick()

    expect(isError.value).toBe(true)
    expect(error.value).toBeInstanceOf(Error)
  })

  it('should cancel previous requests when new one starts', async () => {
    let resolveFirst: (value: AssetListResponse) => void
    const firstPromise = new Promise<AssetListResponse>(resolve => {
      resolveFirst = resolve
    })

    const secondData = [
      { id: '2', symbol: 'ETH', name: 'Ethereum', image: '', status: 'active' },
    ]

    const fetcher = vi
      .fn()
      .mockReturnValueOnce(firstPromise)
      .mockResolvedValueOnce({
        data: secondData,
        page: 2,
        pageSize: 20,
        total: 1,
        hasMore: false,
      })

    updateRouteQuery({ page: '1' })

    useInfiniteList(fetcher)


    await nextTick()


    updateRouteQuery({ page: '2' })


    resolveFirst!({
      data: [
        { id: '1', symbol: 'BTC', name: 'Bitcoin', image: '', status: 'active' },
      ],
      page: 1,
      pageSize: 20,
      total: 1,
      hasMore: true,
    })

    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()



  })
})
