import { http } from '../../../services/http'
import type { Portfolio, PortfolioItem } from '../types'

const PORTFOLIO_KEY = 'crypto_portfolio'

function getPortfolioFromStorage(): PortfolioItem[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(PORTFOLIO_KEY)
  return stored ? JSON.parse(stored) : []
}

function savePortfolioToStorage(items: PortfolioItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('portfolio-changed'))
}

export const portfolioApi = {
  async getPortfolio(): Promise<Portfolio> {
    try {
      const portfolio = await http.get<Portfolio>('/portfolio')
      return portfolio
    } catch (error) {
      const items = getPortfolioFromStorage()
      const totalValue = items.reduce(
        (sum, item) => sum + (item.totalValue || item.quantity * item.avgPrice),
        0
      )
      return { items, totalValue }
    }
  },

  async addToPortfolio(data: {
    assetId: string
    quantity: number
    avgPrice: number
  }): Promise<PortfolioItem> {
    try {
      const item = await http.post<PortfolioItem>('/portfolio', data)
      return item
    } catch (error) {
      const items = getPortfolioFromStorage()
      const existingIndex = items.findIndex((item) => item.asset.id === data.assetId)

      const newItem: PortfolioItem = {
        id: `portfolio_${Date.now()}`,
        asset: {
          id: data.assetId,
          symbol: '',
          name: '',
          image: '',
          status: 'active',
        },
        quantity: data.quantity,
        avgPrice: data.avgPrice,
        totalValue: data.quantity * data.avgPrice,
      }

      if (existingIndex >= 0) {
        const existing = items[existingIndex]
        const totalQuantity = existing.quantity + data.quantity
        const totalCost = existing.quantity * existing.avgPrice + data.quantity * data.avgPrice
        items[existingIndex] = {
          ...existing,
          quantity: totalQuantity,
          avgPrice: totalCost / totalQuantity,
          totalValue: totalCost,
        }
      } else {
        items.push(newItem)
      }

      savePortfolioToStorage(items)
      return newItem
    }
  },

  async removeFromPortfolio(itemId: string): Promise<void> {
    try {
      await http.delete(`/portfolio/${itemId}`)
    } catch (error) {
      const items = getPortfolioFromStorage()
      const filtered = items.filter((item) => item.id !== itemId)
      savePortfolioToStorage(filtered)
    }
  },
}
