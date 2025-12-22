import { http } from '../../../services/http'
import type { Asset } from '../../assets/types'
import { cryptoService } from '../../../services/cryptoService'

type FavoriteDto = {
  id: string
  asset: Asset
}

let favoriteIdByAssetId = new Map<string, string>()

function syncWatchlistFromFavorites(favorites: FavoriteDto[]) {
  favoriteIdByAssetId = new Map(favorites.map(f => [f.asset.id, f.id]))
  cryptoService.setWatchlist(favorites.map(f => f.asset.id))
}

export const favoritesApi = {
  async listFavorites(): Promise<Asset[]> {
    try {
      const favorites = await http.get<FavoriteDto[]>('/favorites')
      syncWatchlistFromFavorites(favorites)
      return favorites.map(f => f.asset)
    } catch {
      const watchlistCryptos = await cryptoService.getWatchlistCryptos()

      return watchlistCryptos.map(crypto => ({
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
      const isInLocalWatchlist = cryptoService.isInWatchlist(assetId)

      if (isInLocalWatchlist && !favoriteIdByAssetId.has(assetId)) {
        const favorites = await http.get<FavoriteDto[]>('/favorites')
        syncWatchlistFromFavorites(favorites)
      }

      const knownFavoriteId = favoriteIdByAssetId.get(assetId)

      if (knownFavoriteId) {
        await http.delete(`/favorites/${knownFavoriteId}`)
        favoriteIdByAssetId.delete(assetId)
        cryptoService.removeFromWatchlist(assetId)
        return false
      }

      const created = await http.post<FavoriteDto>('/favorites', { asset_id: assetId })
      favoriteIdByAssetId.set(assetId, created.id)
      cryptoService.addToWatchlist(assetId)
      return true
    } catch {
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
