import type { Asset } from '../assets/types'

export interface PortfolioItem {
  id: string
  asset: Asset
  quantity: number
  avgPrice: number
  currentValue?: number
  totalValue?: number
}

export interface Portfolio {
  items: PortfolioItem[]
  totalValue?: number
}
