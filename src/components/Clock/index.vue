<script setup>
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { getCurrentTime } from '@/utils'
import Column from './components/Column.vue'
import { useClockStore } from '@/stores/clockStore'

// 获取配置
const clockStore = useClockStore()

// 获取时钟节点
const clockRef = ref(null)

const circleRef = ref(null)

// 用 ref([]) 创建数组来存储每个列和冒号的节点引用
const colonRefs = ref([])
const columnRefs = ref([])

// 定时器id
let intervalId = null

// 字体大小计算方式
const fontSize = computed(
  () => (window.innerHeight * clockStore.sizeOfWindow) / 7,
)

function drawAudioCircle(audioArray) {
  const minSize = fontSize.value * 7

  // 计算量太大，消耗性能
  // const audioAvgValue = 1000 * (audioArray.reduce((acc, cur) => acc + cur, 0) / audioArray.length)

  const audioAvgValue = Math.max(...audioArray.map(Number)) * 100

  const size = Math.round(Math.max(minSize, minSize + audioAvgValue)) // 根据音频点数据计算大小
  circleRef.value.style.width = `${size}px`
  circleRef.value.style.height = `${size}px`
  circleRef.value.style.transition = 'width 0.1s, height 0.1s'
}

onMounted(() => {
  const clock = clockRef.value
  const colons = colonRefs.value
  const columns = columnRefs.value

  if (!(clock && colons && columns)) return

  const updateClockStyles = () => {
    // 设置时钟大小
    const size = fontSize.value

    circleRef.value.style.width = size * 7 + 'px'
    circleRef.value.style.height = size * 7 + 'px'
    // 设置时钟背景颜色及透明度
    circleRef.value.style.backgroundColor = `rgba(${clockStore.clockBackgroundColor}, ${clockStore.clockBackgroundOpacity})`
    circleRef.value.style.boxShadow = `0 0 ${clockStore.clockShadowBlur}px ${clockStore.clockShadowSpread}px ${clockStore.clockShadowColor}`

    clock.style.width = size * 7 + 'px'
    clock.style.height = size * 7 + 'px'
    clock.style.paddingTop = (size / 2) * 6 + 'px'
    // 设置时钟字体间距计算方式
    clock.style.letterSpacing = size / 10 + 'px'

    if (clockStore.clockBackdropFilterEnabled) {
      circleRef.value.style.backdropFilter = `blur(${clockStore.clockBackdropFilterBlur}px)`
    } else {
      circleRef.value.style.backdropFilter = 'none'
    }

    // 设置冒号的样式
    colons.forEach((ele) => {
      ele.style.color = clockStore.clockFontColor
      ele.style.fontSize = size + 'px'
      ele.style.lineHeight = size + 'px'
      ele.style.textShadow = `0 0 ${clockStore.clockFontShadowBlur}px ${clockStore.clockFontShadowColor}`
    })
  }

  // 初始化样式
  updateClockStyles()

  // 监听 fontSize 的变化
  watch(clockStore.clockConfig, updateClockStyles)

  intervalId = setInterval(() => {
    // 获取时间
    let currentTime = getCurrentTime(true)

    // 遍历所有.column
    columns.forEach((column, index) => {
      let number = parseInt(currentTime[index])
      let offset = -number * fontSize.value
      column.setOffset(offset, number)
    })
  }, 1000)
})

onUnmounted(() => {
  // 清除定时器，避免内存泄漏
  if (intervalId) {
    clearInterval(intervalId)
  }
})

defineExpose({
  drawAudioCircle,
})
</script>

<template>
  <div class="clockContainer">
    <div class="circle" ref="circleRef">
      <div class="clock" ref="clockRef">
        <!-- 小时部分 -->
        <Column :ref="(el) => (columnRefs[0] = el)" :numLength="3" />
        <Column :ref="(el) => (columnRefs[1] = el)" :numLength="10" />

        <!-- 冒号 -->
        <div :ref="(el) => (colonRefs[0] = el)" class="colon"></div>

        <!-- 分钟部分 -->
        <Column :ref="(el) => (columnRefs[2] = el)" :numLength="6" />
        <Column :ref="(el) => (columnRefs[3] = el)" :numLength="10" />

        <!-- 冒号 -->
        <div :ref="(el) => (colonRefs[1] = el)" class="colon"></div>

        <!-- 秒数部分 -->
        <Column :ref="(el) => (columnRefs[4] = el)" :numLength="6" />
        <Column :ref="(el) => (columnRefs[5] = el)" :numLength="10" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.clockContainer {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.15);
  overflow: hidden;
}

.clock {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: start;
  transform: translate(-50%, -50%);
}

.colon {
  display: inline-block;
  font-family: 'Verdana';
  vertical-align: top;
  transform: translateY(-10px);
  transition: all 0.5s ease;

  &::after {
    content: ':';
  }
}
</style>
