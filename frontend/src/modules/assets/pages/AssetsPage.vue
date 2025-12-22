<template>
  <AppContainer>
    <div class="py-6 space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Assets</h1>
        <p class="text-gray-600 dark:text-gray-400">Explore e descubra criptoativos disponíveis</p>
      </div>

      <div class="max-w-md">
        <SearchInput
          :model-value="searchInput"
          @update:model-value="handleSearchInput"
          @search="handleSearch"
        />
      </div>

      <div v-if="isInitialLoading" class="space-y-4">
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
        v-else-if="isError"
        :message="error?.message || 'Erro ao carregar assets'"
        @retry="retry"
      />

      <EmptyState
        v-else-if="isEmpty"
        title="Nenhum asset encontrado"
        description="Tente ajustar sua busca ou filtros."
      />

      <div v-else class="space-y-4">
        <div v-for="asset in items" :key="asset.id">
          <AssetCard
            :asset="asset"
            :is-favorite="favoritesApi.isFavorite(asset.id)"
            @click="goToDetail(asset.id)"
            @favorite-toggle="toggleFavorite(asset.id)"
          />
        </div>

        <InfiniteScrollContainer
          :on-load-more="loadMore"
          :has-more="hasMore"
          :is-loading="isPageLoading"
        />
      </div>
    </div>
  </AppContainer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDebounce } from '../../../composables/useDebounce'
import { useInfiniteList } from '../../../composables/useInfiniteList'
import { assetsApi } from '../api/assets.api'
import { favoritesApi } from '../../favorites/api/favorites.api'
import AppContainer from '../../../components/layout/AppContainer.vue'
import SearchInput from '../components/SearchInput.vue'
import AssetCard from '../components/AssetCard.vue'
import InfiniteScrollContainer from '../components/InfiniteScrollContainer.vue'
import Skeleton from '../../../components/ui/Skeleton.vue'
import EmptyState from '../../../components/ui/EmptyState.vue'
import ErrorState from '../../../components/ui/ErrorState.vue'

const router = useRouter()
const route = useRoute()
const searchInput = ref((route.query.q as string) || '')

const {
  items,
  isPageLoading,
  isInitialLoading,
  isError,
  error,
  hasMore,
  isEmpty,
  searchQuery,
  search,
  loadMore,
  retry,
} = useInfiniteList((page, pageSize, q) => assetsApi.listAssets({ page, pageSize, q }), {
  pageSize: 20,
})

watch(
  () => route.query.q,
  q => {
    const next = (q as string) || ''
    if (next !== searchInput.value) searchInput.value = next
  },
  { immediate: true }
)

const debounced = useDebounce(searchInput, 500)
watch(debounced, value => {
  if (value !== searchQuery.value) {
    search(value)
  }
})

const handleSearchInput = (value: string) => {
  searchInput.value = value
}

const handleSearch = () => {
  search(searchInput.value)
}

const goToDetail = (id: string) => {
  router.push(`/assets/${id}`)
}

const toggleFavorite = async (assetId: string) => {
  await favoritesApi.toggleFavorite(assetId)
}
</script>
