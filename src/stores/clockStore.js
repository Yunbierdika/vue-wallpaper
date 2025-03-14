import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useConfigStore } from './configStore'

export const useClockStore = defineStore('clock', () => {
  const configStore = useConfigStore()

  // 缓存配置
  const clockConfig = ref(null)

  // 是否开启时钟
  const clockEnabled = computed(() => clockConfig.value?.clockEnabled)
  // 时钟大小占浏览器窗口的比例
  const sizeOfWindow = computed(() => clockConfig.value?.sizeOfWindow)
  // 时钟字体颜色
  const clockFontColor = computed(
    () => clockConfig.value?.clockFontColor || configStore.themeColor,
  )
  // 时钟字体阴影颜色
  const clockFontShadowColor = computed(
    () => clockConfig.value?.clockFontShadowColor || configStore.themeColor,
  )
  // 时钟字体阴影扩散程度
  const clockFontShadowBlur = computed(
    () => clockConfig.value?.clockFontShadowBlur,
  )
  // 是否开启时钟背景模糊效果
  const clockBackdropFilterEnabled = computed(
    () => clockConfig.value?.clockBackdropFilterEnabled,
  )
  // 时钟背景模糊程度
  const clockBackdropFilterBlur = computed(
    () => clockConfig.value?.clockBackdropFilterBlur,
  )
  // 时钟背景颜色
  const clockBackgroundColor = computed(
    () => clockConfig.value?.clockBackgroundColor || configStore.themeColor,
  )
  // 时钟背景透明度
  const clockBackgroundOpacity = computed(
    () => clockConfig.value?.clockBackgroundOpacity,
  )
  // 时钟阴影颜色
  const clockShadowColor = computed(
    () => clockConfig.value?.clockShadowColor || configStore.themeColor,
  )
  // 时钟阴影模糊半径
  const clockShadowBlur = computed(() => clockConfig.value?.clockShadowBlur)
  // 时钟阴影扩散半径
  const clockShadowSpread = computed(() => clockConfig.value?.clockShadowSpread)
  // 是否开启时钟律动效果
  const clockMotionEnabled = computed(
    () => clockConfig.value?.clockMotionEnabled,
  )
  // 低频律动限制值
  const clockMotionLowLimit = computed(
    () => clockConfig.value?.clockMotionLowLimit,
  )
  // 高频律动限制值
  const clockMotionHighLimit = computed(
    () => clockConfig.value?.clockMotionHighLimit,
  )

  return {
    clockConfig,
    clockEnabled,
    sizeOfWindow,
    clockFontColor,
    clockFontShadowColor,
    clockFontShadowBlur,
    clockBackdropFilterEnabled,
    clockBackdropFilterBlur,
    clockBackgroundColor,
    clockBackgroundOpacity,
    clockShadowColor,
    clockShadowBlur,
    clockShadowSpread,
    clockMotionEnabled,
    clockMotionLowLimit,
    clockMotionHighLimit,
  }
})
