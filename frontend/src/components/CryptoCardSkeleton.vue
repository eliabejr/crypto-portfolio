<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
  >
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <Skeleton width="w-12" height="h-12" class-name="rounded-full" />
        <div class="space-y-2">
          <Skeleton width="w-24" height="h-5" />
          <Skeleton width="w-16" height="h-4" />
        </div>
      </div>
      <Skeleton width="w-10" height="h-10" class-name="rounded-full" />
    </div>

    <div class="space-y-2">
      <div class="flex items-baseline justify-between">
        <Skeleton width="w-32" height="h-8" />
        <Skeleton width="w-16" height="h-6" />
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div class="space-y-1">
          <Skeleton width="w-20" height="h-4" />
          <Skeleton width="w-24" height="h-4" />
        </div>
        <div class="space-y-1">
          <Skeleton width="w-16" height="h-4" />
          <Skeleton width="w-12" height="h-4" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Skeleton from './ui/Skeleton.vue'
</script>
