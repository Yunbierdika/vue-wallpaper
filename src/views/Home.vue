<script setup>
import { onMounted } from 'vue'
import AudioVisualization from '@/components/AudioVisualization/index.vue'
import PetalFlake from '@/components/PetalFlake/index.vue'
import Clock from '@/components/Clock/index.vue'
import { customColorAsCSS, setBackgroundSize } from '@/utils'

// stores
import { storeToRefs } from 'pinia'
import { useAudioVisualizationStore } from '@/stores/audioVisualizationStore'
import { useClockStore } from '@/stores/clockStore'
import { usePetalFlakeStore } from '@/stores/petalFlakeStore'

// 音频可视化store
const audioVisualizationStore = useAudioVisualizationStore()
const {
  audioVisualizationEnabled,
  barColor,
  // barColorLeft,
  // barColorRight,
  barShadowEnabled,
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

// 花瓣store
const petalFlakeStore = usePetalFlakeStore()
const {
  petalFlakeEnabled,
  petalOpacity,
  petalShadowEnabled,
  petalShadowColor,
  petalShadowBlur
} = storeToRefs(petalFlakeStore)

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
        // barColorLeft.value = customColorAsCSS(properties.audio_bar_color.value)
        // barColorRight.value = customColorAsCSS(properties.audio_bar_color.value)
        barColor.value = customColorAsCSS(properties.audio_bar_color.value)
      }
      // 音频条阴影开关配置
      updateProperty(properties.audio_bar_shadow_enabled, barShadowEnabled)
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

      // 花瓣飘落开关配置
      updateProperty(properties.petal_flake_enabled, petalFlakeEnabled)
      // 花瓣飘落飘落透明度配置
      updateProperty(properties.petal_flake_opacity, petalOpacity)
      // 花瓣飘落阴影效果开启配置
      updateProperty(properties.petal_flake_shadow_enabled, petalShadowEnabled)
      // 花瓣飘落阴影颜色配置
      if (properties.petal_flake_shadow_color) {
        petalShadowColor.value = customColorAsCSS(
          properties.petal_flake_shadow_color.value
        )
      }
      // 花瓣飘落阴影扩散程度配置
      updateProperty(properties.petal_flake_shadow_blur, petalShadowBlur)
    }
  }

  // 获取宽度
  let windowWidth = window.innerWidth
  // 获取高度
  let windowHeight = window.innerHeight
  // 设置背景图片
  document.body.style.backgroundImage = 'url(background.jpg)'
  // 设置背景图片大小
  setBackgroundSize(document.body, windowWidth, windowHeight)

  // 屏幕宽高改变时触发
  window.addEventListener('resize', () => {
    // 获取宽度
    let windowWidth = window.innerWidth
    // 获取高度
    let windowHeight = window.innerHeight
    // 修改背景图片大小
    setBackgroundSize(document.body, windowWidth, windowHeight)
  })
})
</script>

<template>
  <div class="container">
    <!-- 时钟组件 -->
    <Clock v-if="clockEnabled" />
    <!-- 音频可视化组件 -->
    <AudioVisualization v-if="audioVisualizationEnabled" />
    <!-- 花瓣飘落组件 -->
    <PetalFlake v-if="petalFlakeEnabled" />
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
