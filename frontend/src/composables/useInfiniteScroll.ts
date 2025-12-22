import { onMounted, onUnmounted, type Ref } from 'vue'

export function useInfiniteScroll(
  callback: () => void,
  options: {
    threshold?: number
    enabled?: Ref<boolean> | (() => boolean)
  } = {}
) {
  const { threshold = 200, enabled } = options

  const handleScroll = () => {
    if (enabled) {
      const isEnabled = typeof enabled === 'function' ? enabled() : enabled.value
      if (!isEnabled) return
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    const distanceFromBottom = documentHeight - (scrollTop + windowHeight)

    if (distanceFromBottom < threshold) {
      callback()
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
}
