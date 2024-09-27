import { ref } from 'vue'
import { defineStore } from 'pinia'
import { audioVisualizationConfig as config } from '@/constants.js'

export const useAudioVisualizationStore = defineStore(
  'audioVisualization',
  () => {
    // 是否开启音频可视化
    const audioVisualizationEnabled = ref(config.audioVisualizationEnabled)
    // 音频条颜色
    const barColor = ref(config.barColor)
    // 左声道颜色
    // const barColorLeft = ref(config.barColorLeft)
    // 右声道颜色
    // const barColorRight = ref(config.barColorRight)
    // 是否开启音频条阴影
    const barShadowEnabled = ref(config.barShadowEnabled)
    // 音频条阴影颜色
    const barShadowColor = ref(config.barShadowColor)
    // 音频条的阴影宽度
    const barShadowBlur = ref(config.barShadowBlur)
    // 音频条的宽度
    const barWidthMultiplier = ref(config.barWidthMultiplier)
    // 音频条的初始高度
    const barHeightInit = ref(config.barHeightInit)
    // 音频条限制高度（限制值为屏幕高度X此数）
    const barHeightLimit = ref(config.barHeightLimit)
    // 音频条Y轴偏移量
    const barYOffset = ref(config.barYOffset)
    // 插值因子（推荐0.0~0.5之间，越大越平滑）
    const lerpFactor = ref(config.lerpFactor)

    return {
      audioVisualizationEnabled,
      barColor,
      // barColorLeft,
      // barColorRight,
      barShadowEnabled,
      barShadowColor,
      barShadowBlur,
      barWidthMultiplier,
      barHeightInit,
      barHeightLimit,
      barYOffset,
      lerpFactor
    }
  }
)
