<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import AudioVisualization from '@/components/AudioVisualization/index.vue'
import PetalFlake from '@/components/PetalFlake/index.vue'
import Clock from '@/components/Clock/index.vue'
import { customColorAsCSS, setBackgroundSize, getThemeColor } from '@/utils'

// stores
import { storeToRefs } from 'pinia'
import { useAudioVisualizationStore } from '@/stores/audioVisualizationStore'
import { useClockStore } from '@/stores/clockStore'
import { usePetalFlakeStore } from '@/stores/petalFlakeStore'
import { useConfigStore } from '@/stores/configStore'

// 音频可视化store
const audioVisualizationStore = useAudioVisualizationStore()

// stores
const clockStore = useClockStore()
const petalFlakeStore = usePetalFlakeStore()

// 配置store
const configStore = useConfigStore()
const { config, isLoaded } = storeToRefs(configStore)

let animationFrameId = null

const clockRef = ref(null)
const audioVisualizationRef = ref(null)

onMounted(async () => {
  // 初始化配置
  configStore.getConfig()
  watch(isLoaded, (val) => {
    if (val) {
      // 初始化各个store的配置
      audioVisualizationStore.audioVisualizationConfig =
        config.value.audioVisualizationConfig
      petalFlakeStore.petalFlakeConfig = config.value.petalFlakeConfig
      clockStore.clockConfig = config.value.clockConfig

      configStore.isAllLoaded = true
    }
  })

  // 监听配置修改并更新store配置
  window.wallpaperPropertyListener = {
    applyUserProperties: function (properties) {
      ///////// 音频可视化相关配置 ////////

      // 音频可视化开关配置
      if (properties.audio_visualization_enabled) {
        audioVisualizationStore.audioVisualizationConfig.audioVisualizationEnabled =
          properties.audio_visualization_enabled.value
      }
      // 音频可视化颜色配置
      if (properties.audio_bar_color) {
        if (customColorAsCSS(properties.audio_bar_color.value))
          audioVisualizationStore.audioVisualizationConfig.barColor =
            customColorAsCSS(properties.audio_bar_color.value)
      }
      // 音频可视化透明度配置
      if (properties.audio_bar_opacity) {
        audioVisualizationStore.audioVisualizationConfig.barOpacity =
          properties.audio_bar_opacity.value
      }
      // 音频条阴影开关配置
      if (properties.audio_bar_shadow_enabled) {
        audioVisualizationStore.audioVisualizationConfig.barShadowEnabled =
          properties.audio_bar_shadow_enabled.value
      }
      // 音频可视化阴影颜色配置
      if (properties.audio_bar_shadow_color) {
        if (customColorAsCSS(properties.audio_bar_shadow_color.value))
          audioVisualizationStore.audioVisualizationConfig.barShadowColor =
            customColorAsCSS(properties.audio_bar_shadow_color.value)
      }
      // 音频响应条阴影宽度
      if (properties.audio_bar_shadow_blur) {
        audioVisualizationStore.audioVisualizationConfig.barShadowBlur =
          properties.audio_bar_shadow_blur.value
      }
      // 音频响应条宽度倍数
      if (properties.audio_bar_width_multiplier) {
        audioVisualizationStore.audioVisualizationConfig.barWidthMultiplier =
          properties.audio_bar_width_multiplier.value
      }
      // 音频响应条初始高度
      if (properties.audio_bar_height_init) {
        audioVisualizationStore.audioVisualizationConfig.barHeightInit =
          properties.audio_bar_height_init.value
      }
      // 音频条相对于画布高度限制的倍数
      if (properties.audio_bar_height_limit) {
        audioVisualizationStore.audioVisualizationConfig.barHeightLimit =
          properties.audio_bar_height_limit.value
      }
      // 音频响应条Y轴偏移
      if (properties.audio_bar_y_offset) {
        audioVisualizationStore.audioVisualizationConfig.barYOffset =
          properties.audio_bar_y_offset.value
      }
      // 音频响应条lerp速度
      if (properties.audio_lerp_factor) {
        audioVisualizationStore.audioVisualizationConfig.lerpFactor =
          properties.audio_lerp_factor.value
      }

      ///////// 花瓣飘落相关配置 ////////

      // 花瓣飘落开关配置
      if (properties.petal_flake_enabled) {
        petalFlakeStore.petalFlakeConfig.petalFlakeEnabled =
          properties.petal_flake_enabled.value
      }
      // 花瓣飘落飘落透明度配置
      if (properties.petal_flake_opacity) {
        petalFlakeStore.petalFlakeConfig.petalOpacity =
          properties.petal_flake_opacity.value
      }
      // 花瓣飘落阴影效果开启配置
      if (properties.petal_flake_shadow_enabled) {
        petalFlakeStore.petalFlakeConfig.petalShadowEnabled =
          properties.petal_flake_shadow_enabled.value
      }
      // 花瓣飘落阴影颜色配置
      if (properties.petal_flake_shadow_color) {
        if (customColorAsCSS(properties.petal_flake_shadow_color.value))
          petalFlakeStore.petalFlakeConfig.petalShadowColor = customColorAsCSS(
            properties.petal_flake_shadow_color.value,
          )
      }
      // 花瓣飘落阴影扩散程度配置
      if (properties.petal_flake_shadow_blur) {
        petalFlakeStore.petalFlakeConfig.petalShadowBlur =
          properties.petal_flake_shadow_blur.value
      }

      ///////// 时钟相关配置 ////////

      // 时钟开关配置
      if (properties.clock_enabled) {
        clockStore.clockConfig.clockEnabled = properties.clock_enabled.value
      }
      // 时钟大小配置
      if (properties.clock_size_of_window) {
        clockStore.clockConfig.sizeOfWindow =
          properties.clock_size_of_window.value
      }
      // 时钟字体颜色
      if (properties.clock_font_color) {
        if (customColorAsCSS(properties.clock_font_color.value))
          clockStore.clockConfig.clockFontColor = customColorAsCSS(
            properties.clock_font_color.value,
          )
      }
      // 时钟字体阴影颜色
      if (properties.clock_font_shadow_color) {
        if (customColorAsCSS(properties.clock_font_shadow_color.value))
          clockStore.clockConfig.clockFontShadowColor = customColorAsCSS(
            properties.clock_font_shadow_color.value,
          )
      }
      // 时钟字体阴影扩散程度
      if (properties.clock_font_shadow_blur) {
        clockStore.clockConfig.clockFontShadowBlur =
          properties.clock_font_shadow_blur.value
      }
      // 是否开启时钟背景模糊效果
      if (properties.clock_backdrop_filter_enabled) {
        clockStore.clockConfig.clockBackdropFilterEnabled =
          properties.clock_backdrop_filter_enabled.value
      }
      // 时钟背景模糊程度
      if (properties.clock_backdrop_filter_blur) {
        clockStore.clockConfig.clockBackdropFilterBlur =
          properties.clock_backdrop_filter_blur.value
      }
      // 时钟背景颜色
      if (properties.clock_background_color) {
        if (customColorAsCSS(properties.clock_background_color.value))
          clockStore.clockConfig.clockBackgroundColor = customColorAsCSS(
            properties.clock_background_color.value,
          )
      }
      // 时钟背景透明度
      if (properties.clock_background_opacity) {
        clockStore.clockConfig.clockBackgroundOpacity =
          properties.clock_background_opacity.value
      }
      // 时钟阴影颜色
      if (properties.clock_shadow_color) {
        if (customColorAsCSS(properties.clock_shadow_color.value))
          clockStore.clockConfig.clockShadowColor = customColorAsCSS(
            properties.clock_shadow_color.value,
          )
      }
      // 时钟阴影模糊半径
      if (properties.clock_shadow_blur) {
        clockStore.clockConfig.clockShadowBlur =
          properties.clock_shadow_blur.value
      }
      // 时钟阴影扩散半径
      if (properties.clock_shadow_spread) {
        clockStore.clockConfig.clockShadowSpread =
          properties.clock_shadow_spread.value
      }
      // 是否开启时钟律动效果
      if (properties.clock_motion_enabled) {
        clockStore.clockConfig.clockMotionEnabled =
          properties.clock_motion_enabled.value
      }
      // 低频律动限制值
      if (properties.clock_motion_low_limit) {
        clockStore.clockConfig.clockMotionLowLimit =
          properties.clock_motion_low_limit.value
      }
      // 高频律动限制值
      if (properties.clock_motion_high_limit) {
        clockStore.clockConfig.clockMotionHighLimit =
          properties.clock_motion_high_limit.value
      }
    },
  }

  // 获取宽度
  let windowWidth = window.innerWidth
  // 获取高度
  let windowHeight = window.innerHeight
  // 设置背景图片
  document.body.style.backgroundImage = 'url(bg.jpg)'
  // 获取并设置主题色
  const themeColor = await getThemeColor('bg.jpg')
  console.log('BackgroundThemeColor: ' + themeColor)
  configStore.themeColor = themeColor

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

  let audioCache01 = null

  function wallpaperAudioListener(audioArray) {
    if (!audioArray) return

    // 适当优化静止时的性能消耗
    if (audioCache01 == null) audioCache01 = audioArray[0]
    else if (audioCache01 == audioArray[0]) return

    // 请求下一帧动画
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    animationFrameId = requestAnimationFrame(() => {
      // 时钟律动动画绘制
      if (clockStore.clockEnabled && clockStore.clockMotionEnabled)
        clockRef.value.drawAudioCircle(audioArray)
      // 音频可视化动画绘制
      if (audioVisualizationStore.audioVisualizationEnabled)
        audioVisualizationRef.value.drawAudioBars(audioArray)
    })
  }

  // 注册由 Wallpaper Engine 提供的音频监听器
  window.wallpaperRegisterAudioListener(wallpaperAudioListener)
})

onBeforeUnmount(() => {
  // 清除动画帧
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div class="container">
    <!-- 时钟组件 -->
    <Clock v-if="clockStore.clockEnabled" ref="clockRef" />
    <!-- 音频可视化组件 -->
    <AudioVisualization
      v-if="audioVisualizationStore.audioVisualizationEnabled"
      ref="audioVisualizationRef"
    />
    <!-- 花瓣飘落组件 -->
    <PetalFlake v-if="petalFlakeStore.petalFlakeEnabled" />
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>
