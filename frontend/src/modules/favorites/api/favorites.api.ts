import { http } from '../../../services/http'
import type { Asset } from '../../assets/types'
import { cryptoService } from '../../../services/cryptoService'

export const favoritesApi = {
  async listFavorites(): Promise<Asset[]> {
    try {
      const assets = await http.get<Asset[]>('/favorites')
      return assets
    } catch (error) {
      const watchlistCryptos = await cryptoService.getWatchlistCryptos()

      return watchlistCryptos.map((crypto) => ({
        id: crypto.id,
        symbol: crypto.symbol,
        name: crypto.name,
        image: crypto.image,
        status: 'active' as const,
        current_price: crypto.current_price,
        price_change_percentage_24h: crypto.price_change_percentage_24h,
        market_cap_rank: crypto.market_cap_rank,
      }))
    }
  },

  async toggleFavorite(assetId: string): Promise<boolean> {
    try {
      const isFavorite = await http.post<{ isFavorite: boolean }>(`/favorites/${assetId}/toggle`)
      return isFavorite.isFavorite
    } catch (error) {
      const isInWatchlist = cryptoService.isInWatchlist(assetId)
      if (isInWatchlist) {
        cryptoService.removeFromWatchlist(assetId)
        return false
      } else {
        cryptoService.addToWatchlist(assetId)
        return true
      }
    }
  },

  isFavorite(assetId: string): boolean {
    return cryptoService.isInWatchlist(assetId)
  },
}
