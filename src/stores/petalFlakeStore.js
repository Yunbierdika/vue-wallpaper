import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usePetalFlakeStore = defineStore('petalFlake', () => {
  // 缓存配置
  const petalFlakeConfig = ref(null)

  // 是否开启花瓣飘落效果
  const petalFlakeEnabled = computed(
    () => petalFlakeConfig.value?.petalFlakeEnabled
  )
  // 花瓣的最大尺寸（实际尺寸为：这个值 * 0.5到1的随机数）
  const petalMaxSize = computed(() => petalFlakeConfig.value?.petalMaxSize)
  // 花瓣的风速（实际速度为：这个值 / 尺寸）
  const petalWindSpeed = computed(() => petalFlakeConfig.value?.petalWindSpeed)
  // 花瓣飘落角度（90度为垂直向下）
  const petalWindAngle = computed(() => petalFlakeConfig.value?.petalWindAngle)
  // 花瓣的下落速度（实际速度为：尺寸 * 这个值）
  const petalFallSpeed = computed(() => petalFlakeConfig.value?.petalFallSpeed)
  // 花瓣的透明度
  const petalOpacity = computed(() => petalFlakeConfig.value?.petalOpacity)
  // 花瓣的数量
  const petalCount = computed(() => petalFlakeConfig.value?.petalCount)
  // 是否开启花瓣阴影效果
  const petalShadowEnabled = computed(
    () => petalFlakeConfig.value?.petalShadowEnabled
  )
  // 花瓣的阴影颜色及透明度
  const petalShadowColor = computed(
    () => petalFlakeConfig.value?.petalShadowColor
  )
  // 花瓣阴影的扩散程度(Blur)
  const petalShadowBlur = computed(
    () => petalFlakeConfig.value?.petalShadowBlur
  )

  return {
    petalFlakeConfig,
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
