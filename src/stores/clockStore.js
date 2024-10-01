import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useClockStore = defineStore('clock', () => {
  // 缓存配置
  const clockConfig = ref(null)

  // 是否开启时钟
  const clockEnabled = computed(() => clockConfig.value?.clockEnabled)
  // 时钟大小占浏览器窗口的比例
  const sizeOfWindow = computed(() => clockConfig.value?.sizeOfWindow)
  // 时钟字体颜色
  const clockFontColor = computed(() => clockConfig.value?.clockFontColor)
  // 时钟字体阴影颜色
  const clockFontShadowColor = computed(
    () => clockConfig.value?.clockFontShadowColor
  )
  // 时钟字体阴影扩散程度
  const clockFontShadowBlur = computed(
    () => clockConfig.value?.clockFontShadowBlur
  )
  // 是否开启时钟背景模糊效果
  const clockBackdropFilterEnabled = computed(
    () => clockConfig.value?.clockBackdropFilterEnabled
  )
  // 时钟背景模糊程度
  const clockBackdropFilterBlur = computed(
    () => clockConfig.value?.clockBackdropFilterBlur
  )

  return {
    clockConfig,
    clockEnabled,
    sizeOfWindow,
    clockFontColor,
    clockFontShadowColor,
    clockFontShadowBlur,
    clockBackdropFilterEnabled,
    clockBackdropFilterBlur
  }
})
