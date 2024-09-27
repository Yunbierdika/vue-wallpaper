import { ref } from 'vue'
import { defineStore } from 'pinia'
import { petalFlakeConfig as config } from '@/constants'

export const usePetalFlakeStore = defineStore('petalFlake', () => {
  const petalFlakeEnabled = ref(config.petalFlakeEnabled)
  const petalMaxSize = ref(config.petalMaxSize)
  const petalWindSpeed = ref(config.petalWindSpeed)
  const petalWindAngle = ref(config.petalWindAngle)
  const petalFallSpeed = ref(config.petalFallSpeed)
  const petalOpacity = ref(config.petalOpacity)
  const petalCount = ref(config.petalCount)
  const petalShadowEnabled = ref(config.petalShadowEnabled)
  const petalShadowColor = ref(config.petalShadowColor)
  const petalShadowBlur = ref(config.petalShadowBlur)

  return {
    petalFlakeEnabled,
    petalMaxSize,
    petalWindSpeed,
    petalWindAngle,
    petalFallSpeed,
    petalOpacity,
    petalCount,
    petalShadowEnabled,
    petalShadowColor,
    petalShadowBlur
  }
})
