import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useClockStore = defineStore('clock', () => {
  // 缓存配置
  const clockConfig = ref(null)

  // 是否开启时钟
  const clockEnabled = computed(() => clockConfig.value?.clockEnabled)
  // 时钟大小占浏览器窗口的比例
  const sizeOfWindow = computed(() => clockConfig.value?.sizeOfWindow)

  return { clockConfig, clockEnabled, sizeOfWindow }
})
