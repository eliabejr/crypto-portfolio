export interface Asset {
  id: string
  symbol: string
  name: string
  image: string
  status: 'active' | 'inactive'
  current_price?: number
  price_change_percentage_24h?: number
  market_cap_rank?: number
}

export interface AssetListResponse {
  data: Asset[]
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}
