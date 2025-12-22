import { ref, computed } from 'vue'
import type { CryptoListResponse } from '../types/crypto'

export interface UseInfiniteListOptions {
  pageSize?: number
  initialPage?: number
}

export function useInfiniteList(
  fetcher: (page: number, pageSize: number, search?: string) => Promise<CryptoListResponse>,
  options: UseInfiniteListOptions = {}
) {
  const { pageSize = 20, initialPage = 1 } = options

  const items = ref<CryptoListResponse['data']>([])
  const currentPage = ref(initialPage)
  const isLoading = ref(false)
  const isError = ref(false)
  const error = ref<Error | null>(null)
  const hasMore = ref(true)
  const total = ref(0)
  const searchQuery = ref('')

  const isEmpty = computed(() => items.value.length === 0 && !isLoading.value)
  const isEndReached = computed(() => !hasMore.value && items.value.length > 0)

  const loadPage = async (page: number, search?: string) => {
    if (isLoading.value) return

    isLoading.value = true
    isError.value = false
    error.value = null

    try {
      const response = await fetcher(page, pageSize, search)

      if (page === 1) {
        items.value = response.data
      } else {
        items.value = [...items.value, ...response.data]
      }

      hasMore.value = response.hasMore
      total.value = response.total
      currentPage.value = page
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err))
      error.value = errorObj
      isError.value = true
    } finally {
      isLoading.value = false
    }
  }

  const loadMore = async () => {
    if (!hasMore.value || isLoading.value) return
    await loadPage(currentPage.value + 1, searchQuery.value)
  }

  const search = async (query: string) => {
    searchQuery.value = query
    currentPage.value = 1
    hasMore.value = true
    items.value = []
    await loadPage(1, query)
  }

  const reset = () => {
    items.value = []
    currentPage.value = initialPage
    hasMore.value = true
    isLoading.value = false
    isError.value = false
    error.value = null
    searchQuery.value = ''
    total.value = 0
  }

  const retry = async () => {
    await loadPage(currentPage.value, searchQuery.value)
  }

  return {
    items,
    isLoading,
    isError,
    error,
    hasMore,
    total,
    isEmpty,
    isEndReached,
    loadMore,
    search,
    reset,
    retry,
    currentPage: computed(() => currentPage.value),
  }
}
