import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { AssetListResponse } from '../modules/assets/types'

export interface UseInfiniteListUrlOptions {
  pageSize?: number
  searchParam?: string
  pageParam?: string
}

export function useInfiniteListUrl(
  fetcher: (page: number, pageSize: number, search?: string) => Promise<AssetListResponse>,
  options: UseInfiniteListUrlOptions = {}
) {
  const { pageSize = 20, searchParam = 'q', pageParam = 'page' } = options
  const route = useRoute()
  const router = useRouter()

  const items = ref<AssetListResponse['data']>([])
  const isLoading = ref(false)
  const isPageLoading = ref(false)
  const isError = ref(false)
  const error = ref<Error | null>(null)
  const hasMore = ref(true)
  const total = ref(0)
  const requestToken = ref(0)
  const lastLoadedKey = ref<string>('')

  const getQueryString = (key: string) => (route.query[key] as string) || ''
  const getQueryNumber = (key: string) => {
    const value = Number(route.query[key])
    return Number.isFinite(value) ? value : 0
  }

  const currentPage = computed(() => {
    return Math.max(1, getQueryNumber(pageParam) || 1)
  })

  const searchQuery = computed(() => {
    return getQueryString(searchParam)
  })

  const isEmpty = computed(() => items.value.length === 0 && !isLoading.value && !isPageLoading.value)
  const isEndReached = computed(() => !hasMore.value && items.value.length > 0)
  const isInitialLoading = computed(() => isLoading.value && items.value.length === 0)

  const updateUrl = (updates: Record<string, string | number | null>) => {
    const query = { ...route.query }
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        delete query[key]
      } else {
        query[key] = String(value)
      }
    })
    router.replace({ query })
  }

  const loadPage = async (page: number, search?: string, isInitial = false) => {
    const token = ++requestToken.value

    if (isInitial) {
      isLoading.value = true
    } else {
      isPageLoading.value = true
    }
    isError.value = false
    error.value = null

    try {
      const response = await fetcher(page, pageSize, search)

      if (token !== requestToken.value) {
        return
      }

      if (page === 1) {
        items.value = response.data
      } else {
        items.value = [...items.value, ...response.data]
      }

      hasMore.value = response.hasMore
      total.value = response.total
      lastLoadedKey.value = `${page}|${search || ''}`
    } catch (err) {
      if (token !== requestToken.value) {
        return
      }

      const errorObj = err instanceof Error ? err : new Error(String(err))
      error.value = errorObj
      isError.value = true
    } finally {
      if (token === requestToken.value) {
        isLoading.value = false
        isPageLoading.value = false
      }
    }
  }

  const loadMore = () => {
    if (!hasMore.value || isLoading.value || isPageLoading.value) return
    const nextPage = currentPage.value + 1
    updateUrl({ [pageParam]: nextPage })
  }

  const search = (query: string) => {
    updateUrl({ [searchParam]: query || null, [pageParam]: null })
  }

  const retry = async () => {
    await loadPage(currentPage.value, searchQuery.value, currentPage.value === 1)
  }

  watch(
    () => [route.query[pageParam], route.query[searchParam]],
    async ([newPage, newSearch], oldValue) => {
      const [oldPage, oldSearch] = oldValue ?? []
      const page = Math.max(1, Number(newPage) || 1)
      const searchTerm = (newSearch as string) || ''
      const prevPage = Math.max(1, Number(oldPage) || 1)
      const prevSearch = (oldSearch as string) || ''
      const key = `${page}|${searchTerm}`

      if (key === lastLoadedKey.value) {
        return
      }

      if (searchTerm !== prevSearch) {
        requestToken.value++
        items.value = []
        hasMore.value = true
        await loadPage(1, searchTerm, true)
        return
      }

      if (page > prevPage && page === currentPage.value) {
        await loadPage(page, searchTerm, false)
      }
    },
    { immediate: true }
  )

  return {
    items,
    isLoading,
    isPageLoading,
    isInitialLoading,
    isError,
    error,
    hasMore,
    total,
    isEmpty,
    isEndReached,
    currentPage,
    searchQuery,
    loadMore,
    search,
    retry,
  }
}
