<template>
  <AppContainer>
    <div class="py-6 space-y-6">
      <BackButton @click="goBack" />

      <div v-if="isLoading" class="space-y-6">
        <div class="flex items-center gap-4">
          <Skeleton width="w-16" height="h-16" class-name="rounded-full" />
          <div class="flex-1 space-y-2">
            <Skeleton width="w-32" height="h-6" />
            <Skeleton width="w-48" height="h-4" />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton width="w-full" height="h-24" />
          <Skeleton width="w-full" height="h-24" />
        </div>
      </div>

      <ErrorState v-else-if="error" :message="error.message || 'Erro ao carregar asset'" @retry="loadAsset" />

      <div v-else-if="asset" class="space-y-6">
        <div class="flex items-start justify-between">
          <AssetHeader :asset="asset" />
          <FavoriteButton :asset-id="asset.id" :is-favorite="isFavorite" @toggle="handleToggleFavorite" />
        </div>

        <AssetInfo :asset="asset" />

        <AddToPortfolioForm :asset-id="asset.id" @submit="handleAddToPortfolio" />
      </div>
    </div>
  </AppContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { assetsApi } from '../api/assets.api'
import { favoritesApi } from '../../favorites/api/favorites.api'
import { portfolioApi } from '../../portfolio/api/portfolio.api'
import type { Asset } from '../types'
import AppContainer from '../../../components/layout/AppContainer.vue'
import BackButton from '../components/BackButton.vue'
import AssetHeader from '../components/AssetHeader.vue'
import AssetInfo from '../components/AssetInfo.vue'
import FavoriteButton from '../components/FavoriteButton.vue'
import AddToPortfolioForm from '../components/AddToPortfolioForm.vue'
import Skeleton from '../../../components/ui/Skeleton.vue'
import ErrorState from '../../../components/ui/ErrorState.vue'

const route = useRoute()
const router = useRouter()

const asset = ref<Asset | null>(null)
const isLoading = ref(false)
const error = ref<Error | null>(null)
const isFavorite = ref(false)

const assetId = computed(() => route.params.id as string)

const loadAsset = async () => {
  isLoading.value = true
  error.value = null
  try {
    const data = await assetsApi.getAsset(assetId.value)
    if (!data) {
      error.value = new Error('Asset não encontrado')
      return
    }
    asset.value = data
    isFavorite.value = favoritesApi.isFavorite(data.id)
  } catch (err) {
    error.value = err instanceof Error ? err : new Error(String(err))
  } finally {
    isLoading.value = false
  }
}

const handleToggleFavorite = async () => {
  if (!asset.value) return

  const previousState = isFavorite.value
  isFavorite.value = !previousState

  try {
    isFavorite.value = await favoritesApi.toggleFavorite(asset.value.id)
  } catch (error) {
    isFavorite.value = previousState
    console.error('[handleToggleFavorite]', error)
  }
}

const handleAddToPortfolio = async (data: { quantity: number; avgPrice: number }) => {
  if (!asset.value) return
  try {
    await portfolioApi.addToPortfolio({
      assetId: asset.value.id,
      quantity: data.quantity,
      avgPrice: data.avgPrice,
    })
    alert('Adicionado ao portfólio com sucesso!')
  } catch (err) {
    alert('Erro ao adicionar ao portfólio')
    console.error(err)
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadAsset()
})
</script>
