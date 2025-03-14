import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useConfigStore } from './configStore'

export const useAudioVisualizationStore = defineStore(
  'audioVisualization',
  () => {
    const configStore = useConfigStore()

    // 缓存配置
    const audioVisualizationConfig = ref(null)

    // 是否开启音频可视化
    const audioVisualizationEnabled = computed(
      () => audioVisualizationConfig.value?.audioVisualizationEnabled,
    )
    // 音频条颜色
    const barColor = computed(
      () => audioVisualizationConfig.value?.barColor || configStore.themeColor,
    )
    // 音频条透明度
    const barOpacity = computed(
      () => audioVisualizationConfig.value?.barOpacity,
    )
    // 是否开启音频条阴影
    const barShadowEnabled = computed(
      () => audioVisualizationConfig.value?.barShadowEnabled,
    )
    // 音频条阴影颜色
    const barShadowColor = computed(
      () =>
        audioVisualizationConfig.value?.barShadowColor ||
        configStore.themeColor,
    )
    // 音频条的阴影扩散程度
    const barShadowBlur = computed(
      () => audioVisualizationConfig.value?.barShadowBlur,
    )
    // 音频条的宽度系数
    const barWidthMultiplier = computed(
      () => audioVisualizationConfig.value?.barWidthMultiplier,
    )
    // 音频条的初始高度
    const barHeightInit = computed(
      () => audioVisualizationConfig.value?.barHeightInit,
    )
    // 音频条限制高度（限制值为屏幕高度X此数）
    const barHeightLimit = computed(
      () => audioVisualizationConfig.value?.barHeightLimit,
    )
    // 音频条Y轴偏移量
    const barYOffset = computed(
      () => audioVisualizationConfig.value?.barYOffset,
    )
    // 插值因子（推荐0.0~0.5之间，越大越平滑）
    const lerpFactor = computed(
      () => audioVisualizationConfig.value?.lerpFactor,
    )

    return {
      audioVisualizationConfig,
      audioVisualizationEnabled,
      barColor,
      barOpacity,
      barShadowEnabled,
      barShadowColor,
      barShadowBlur,
      barWidthMultiplier,
      barHeightInit,
      barHeightLimit,
      barYOffset,
      lerpFactor,
    }
  },
)
