import { http } from '../../../services/http'
import type { Asset, AssetListResponse } from '../types'
import type { CryptoCurrency } from '../../../types/crypto'
import { cryptoService } from '../../../services/cryptoService'

function mapCryptoToAsset(crypto: CryptoCurrency): Asset {
  return {
    id: crypto.id,
    symbol: crypto.symbol,
    name: crypto.name,
    image: crypto.image,
    status: crypto.market_cap_rank % 7 === 0 ? ('inactive' as const) : ('active' as const),
    current_price: crypto.current_price,
    price_change_percentage_24h: crypto.price_change_percentage_24h,
    market_cap_rank: crypto.market_cap_rank,
  }
}

export const assetsApi = {
  async listAssets(params: {
    page?: number
    pageSize?: number
    q?: string
  }): Promise<AssetListResponse> {
    try {
      const response = await http.get<AssetListResponse>('/assets', {
        params: {
          page: String(params.page || 1),
          page_size: String(params.pageSize || 20),
          search: params.q || '',
        },
      })
      return response
    } catch (error) {
      const mockResponse = await cryptoService.getCryptos({
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        search: params.q || '',
      })

      return {
        data: mockResponse.data.map(mapCryptoToAsset),
        page: mockResponse.page,
        pageSize: mockResponse.pageSize,
        total: mockResponse.total,
        hasMore: mockResponse.hasMore,
      }
    }
  },

  async getAsset(id: string): Promise<Asset | null> {
    try {
      const asset = await http.get<Asset>(`/assets/${id}`)
      return asset
    } catch (error) {
      const crypto = await cryptoService.getCryptoById(id)
      if (!crypto) return null
      return mapCryptoToAsset(crypto)
    }
  },
}
