import { http } from '../../../services/http'
import type { Portfolio, PortfolioItem } from '../types'

const PORTFOLIO_KEY = 'crypto_portfolio'

type PortfolioItemDto = {
  id: string
  asset: PortfolioItem['asset']
  quantity: number
  avg_price: number
}

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

function notifyPortfolioChanged() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event('portfolio-changed'))
}

function mapDtoToItem(dto: PortfolioItemDto): PortfolioItem {
  return {
    id: dto.id,
    asset: dto.asset,
    quantity: dto.quantity,
    avgPrice: dto.avg_price,
    totalValue: dto.quantity * dto.avg_price,
  }
}

export const portfolioApi = {
  async getPortfolio(): Promise<Portfolio> {
    try {
      const items = await http.get<PortfolioItemDto[]>('/portfolio')
      const mapped = items.map(mapDtoToItem)
      const totalValue = mapped.reduce((sum, item) => sum + (item.totalValue || 0), 0)
      return { items: mapped, totalValue }
    } catch {
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
      const existing = await http.get<PortfolioItemDto[]>('/portfolio')
      const found = existing.find(i => i.asset.id === data.assetId)

      if (!found) {
        const created = await http.post<PortfolioItemDto>('/portfolio', {
          asset_id: data.assetId,
          quantity: data.quantity,
          avg_price: data.avgPrice,
        })
        notifyPortfolioChanged()
        return mapDtoToItem(created)
      }

      const currentQty = Number(found.quantity)
      const currentAvg = Number(found.avg_price)
      const addedQty = Number(data.quantity)
      const addedAvg = Number(data.avgPrice)

      const nextQty = currentQty + addedQty
      const nextAvg = nextQty > 0 ? (currentQty * currentAvg + addedQty * addedAvg) / nextQty : 0

      const updated = await http.put<PortfolioItemDto>(`/portfolio/${found.id}`, {
        quantity: nextQty,
        avg_price: nextAvg,
      })
      notifyPortfolioChanged()
      return mapDtoToItem(updated)
    } catch {
      const items = getPortfolioFromStorage()
      const existingIndex = items.findIndex(item => item.asset.id === data.assetId)

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
        if (!existing) {
          items.push(newItem)
        } else {
          const totalQuantity = existing.quantity + data.quantity
          const totalCost = existing.quantity * existing.avgPrice + data.quantity * data.avgPrice
          items[existingIndex] = {
            ...existing,
            quantity: totalQuantity,
            avgPrice: totalCost / totalQuantity,
            totalValue: totalCost,
          }
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
      notifyPortfolioChanged()
    } catch {
      const items = getPortfolioFromStorage()
      const filtered = items.filter(item => item.id !== itemId)
      savePortfolioToStorage(filtered)
    }
  },
}
