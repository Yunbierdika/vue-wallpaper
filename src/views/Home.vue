<script setup>
import AudioVisualization from '@/components/AudioVisualization/index.vue'
// import PetalFlake from '@/components/PetalFlake/index.vue'
import Clock from '@/components/Clock/index.vue'
import { onMounted } from 'vue'
import { useAudioVisualizationStore } from '@/stores/audioVisualizationStore'
import { useClockStore } from '@/stores/clockStore'
import { storeToRefs } from 'pinia'
import { customColorAsCSS } from '@/utils'

// 音频可视化store
const audioVisualizationStore = useAudioVisualizationStore()
const {
  audioVisualizationEnabled,
  barColorLeft,
  barColorRight,
  barShadowColor,
  barShadowBlur,
  barHeightInit,
  barHeightLimit,
  barWidthMultiplier,
  barYOffset,
  lerpFactor
} = storeToRefs(audioVisualizationStore)

// 时钟store
const clockStore = useClockStore()
const { clockEnabled, sizeOfWindow } = storeToRefs(clockStore)

// 修改属性方法
const updateProperty = (property, ref) => {
  if (property) ref.value = property.value
}

onMounted(() => {
  window.wallpaperPropertyListener = {
    applyUserProperties: function (properties) {
      // 音频可视化开关配置
      updateProperty(
        properties.audio_visualization_enabled,
        audioVisualizationEnabled
      )

      // 音频可视化颜色配置
      if (properties.audio_bar_color) {
        barColorLeft.value = customColorAsCSS(properties.audio_bar_color.value)
        barColorRight.value = customColorAsCSS(properties.audio_bar_color.value)
      }

      // 音频可视化阴影颜色配置
      if (properties.audio_bar_shadow_color) {
        barShadowColor.value = customColorAsCSS(
          properties.audio_bar_shadow_color.value
        )
      }

      // 音频响应条阴影宽度
      updateProperty(properties.audio_bar_shadow_blur, barShadowBlur)
      // 音频响应条宽度倍数
      updateProperty(properties.audio_bar_width_multiplier, barWidthMultiplier)
      // 音频响应条初始高度
      updateProperty(properties.audio_bar_height_init, barHeightInit)
      // 音频条相对于画布高度限制的倍数
      updateProperty(properties.audio_bar_height_limit, barHeightLimit)
      // 音频响应条Y轴偏移
      updateProperty(properties.audio_bar_y_offset, barYOffset)
      // 音频响应条lerp速度
      updateProperty(properties.audio_lerp_factor, lerpFactor)

      // 时钟开关配置
      updateProperty(properties.clock_enabled, clockEnabled)
      // 时钟大小配置
      updateProperty(properties.clock_size_of_window, sizeOfWindow)
    }
  }
})
</script>

<template>
  <div class="container">
    <!-- 时钟组件 -->
    <Clock v-if="clockEnabled" />
    <!-- 音频可视化组件 -->
    <AudioVisualization v-if="audioVisualizationEnabled" />
    <!-- 花瓣飘落组件 -->
    <!-- <PetalFlake /> -->
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: transparent;
}
</style>
