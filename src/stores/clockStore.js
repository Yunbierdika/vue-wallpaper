import { ref } from 'vue'
import { defineStore } from 'pinia'
import { clockConfig as config } from '@/constants'

export const useClockStore = defineStore('clock', () => {
  const clockEnabled = ref(config.clockEnabled)
  const sizeOfWindow = ref(config.sizeOfWindow)

  return { clockEnabled, sizeOfWindow }
})
