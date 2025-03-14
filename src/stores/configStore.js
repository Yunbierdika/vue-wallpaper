import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import JSON5 from 'json5'

export const useConfigStore = defineStore('config', () => {
  // 配置缓存
  const config = ref(null)
  // 判断是否已缓存好配置
  const isLoaded = computed(
    () => config.value !== null && themeColor.value !== null,
  )
  // 判断各个store的配置是否缓存完毕
  const isAllLoaded = ref(false)
  // 主题色
  const themeColor = ref(null)

  //获取配置
  const getConfig = async () => {
    // 使用fetch读取配置文件
    const response = await fetch('configuration.json5')
    const text = await response.text()
    const data = JSON5.parse(text)
    config.value = data
  }

  return {
    config,
    isLoaded,
    isAllLoaded,
    themeColor,
    getConfig,
  }
})
