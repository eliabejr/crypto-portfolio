<template>
  <AppContainer>
    <div class="py-6 space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Favorites</h1>
        <p class="text-gray-600 dark:text-gray-400">Seus ativos favoritos para acesso rápido</p>
      </div>

      <div v-if="isLoading" class="space-y-4">
        <div
          v-for="i in 5"
          :key="i"
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
        >
          <div class="flex items-center gap-3">
            <Skeleton width="w-10" height="h-10" class-name="rounded-full" />
            <div class="flex-1 space-y-2">
              <Skeleton width="w-24" height="h-4" />
              <Skeleton width="w-32" height="h-3" />
            </div>
          </div>
        </div>
      </div>

      <ErrorState
        v-else-if="error"
        :message="error.message || 'Erro ao carregar favoritos'"
        @retry="loadFavorites"
      />

      <EmptyState
        v-else-if="items.length === 0"
        title="Nenhum favorito ainda"
        description="Marque ativos como favoritos para acessá-los rapidamente aqui."
      >
        <template #action>
          <Button variant="primary" class="mt-4" @click="goToAssets"> Explorar Assets </Button>
        </template>
      </EmptyState>

      <div v-else class="space-y-4">
        <AssetCard
          v-for="asset in items"
          :key="asset.id"
          :asset="asset"
          :is-favorite="true"
          @click="goToDetail(asset.id)"
          @favorite-toggle="handleToggleFavorite(asset.id)"
        />
      </div>
    </div>
  </AppContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { favoritesApi } from '../api/favorites.api'
import type { Asset } from '../../assets/types'
import AssetCard from '../../assets/components/AssetCard.vue'
import AppContainer from '../../../components/layout/AppContainer.vue'
import Skeleton from '../../../components/ui/Skeleton.vue'
import EmptyState from '../../../components/ui/EmptyState.vue'
import ErrorState from '../../../components/ui/ErrorState.vue'
import Button from '../../../components/ui/Button.vue'

const router = useRouter()

const items = ref<Asset[]>([])
const isLoading = ref(false)
const error = ref<Error | null>(null)

const loadFavorites = async () => {
  isLoading.value = true
  error.value = null
  try {
    items.value = await favoritesApi.listFavorites()
  } catch (err) {
    error.value = err instanceof Error ? err : new Error(String(err))
  } finally {
    isLoading.value = false
  }
}

const handleToggleFavorite = async (assetId: string) => {
  await favoritesApi.toggleFavorite(assetId)
  items.value = items.value.filter(asset => asset.id !== assetId)
}

const goToDetail = (id: string) => {
  router.push(`/assets/${id}`)
}

const goToAssets = () => {
  router.push('/')
}

onMounted(() => {
  loadFavorites()

  if (typeof window !== 'undefined') {
    window.addEventListener('watchlist-changed', loadFavorites)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('watchlist-changed', loadFavorites)
  }
})
</script>
