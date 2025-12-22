import type { CryptoCurrency, CryptoListResponse } from '../types/crypto'
import { allMockCryptos } from './mockData'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const WATCHLIST_KEY = 'crypto_watchlist'

const getWatchlist = (): string[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(WATCHLIST_KEY)
  return stored ? JSON.parse(stored) : []
}

const saveWatchlist = (ids: string[], skipEvent = false) => {
  if (typeof window === 'undefined') return
  const currentIds = getWatchlist()
  const newIds = [...new Set(ids)]
  
  const hasChanged = 
    currentIds.length !== newIds.length ||
    !currentIds.every(id => newIds.includes(id)) ||
    !newIds.every(id => currentIds.includes(id))
  
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(newIds))
  
  if (hasChanged && !skipEvent) {
    window.dispatchEvent(new Event('watchlist-changed'))
  }
}

export const cryptoService = {
  async getCryptos(params: {
    page?: number
    pageSize?: number
    search?: string
  }): Promise<CryptoListResponse> {
    await delay(300)

    const { page = 1, pageSize = 20, search = '' } = params
    let results = [...allMockCryptos]

    if (search.trim()) {
      const searchLower = search.toLowerCase().trim()
      results = results.filter(
        crypto =>
          crypto.name.toLowerCase().includes(searchLower) ||
          crypto.symbol.toLowerCase().includes(searchLower)
      )
    }

    results.sort((a, b) => a.market_cap_rank - b.market_cap_rank)

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginated = results.slice(start, end)
    const hasMore = end < results.length

    return {
      data: paginated,
      page,
      pageSize,
      total: results.length,
      hasMore,
    }
  },

  async getCryptoById(id: string): Promise<CryptoCurrency | null> {
    await delay(200)
    const crypto = allMockCryptos.find(c => c.id === id)
    return crypto || null
  },

  getWatchlist(): string[] {
    return getWatchlist()
  },

  setWatchlist(ids: string[], skipEvent = false): void {
    saveWatchlist([...new Set(ids)], skipEvent)
  },

  addToWatchlist(cryptoId: string): void {
    const watchlist = getWatchlist()
    if (!watchlist.includes(cryptoId)) {
      watchlist.push(cryptoId)
      saveWatchlist(watchlist)
    }
  },

  removeFromWatchlist(cryptoId: string): void {
    const watchlist = getWatchlist()
    const filtered = watchlist.filter(id => id !== cryptoId)
    saveWatchlist(filtered)
  },

  isInWatchlist(cryptoId: string): boolean {
    return getWatchlist().includes(cryptoId)
  },

  async getWatchlistCryptos(): Promise<CryptoCurrency[]> {
    await delay(200)
    const watchlistIds = getWatchlist()
    return allMockCryptos.filter(crypto => watchlistIds.includes(crypto.id))
  },
}
