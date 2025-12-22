<template>
  <div>
    <slot />
    <div v-if="hasMore" ref="sentinel" class="flex items-center justify-center py-8" aria-hidden="true">
      <Loader v-if="showLoader" size="md" />
      <div v-else class="h-1 w-1" />
    </div>

    <div v-if="showEndMessage" class="flex items-center justify-center py-8 text-sm text-gray-500 dark:text-gray-400">
      <span>Fim da lista</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import Loader from '../../../components/ui/Loader.vue'

interface Props {
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
  threshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  threshold: 200,
})

const sentinel = ref<HTMLElement | null>(null)
const showLoader = computed(() => props.isLoading && props.hasMore)
const showEndMessage = computed(() => !props.hasMore && !props.isLoading)

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  const entry = entries[0]
  if (!entry) return
  if (entry.isIntersecting && props.hasMore && !props.isLoading) {
    props.onLoadMore()
  }
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(handleIntersection, {
      rootMargin: `${props.threshold}px`,
    })
    if (sentinel.value) {
      observer.observe(sentinel.value)
    }
  }
})

onUnmounted(() => {
  if (observer && sentinel.value) {
    observer.unobserve(sentinel.value)
    observer.disconnect()
  }
})
</script>
