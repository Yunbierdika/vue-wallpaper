import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useClockStore = defineStore('clock', () => {
  const clockConfig = ref(null)
  const clockEnabled = computed(() => clockConfig.value?.clockEnabled)
  const sizeOfWindow = computed(() => clockConfig.value?.sizeOfWindow)

  return { clockConfig, clockEnabled, sizeOfWindow }
})
