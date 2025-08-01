<script setup>
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { getCurrentTime } from '@/utils'
import { useClockStore } from '@/stores/clockStore'
import Column from './components/Column.vue'

import { Application, Sprite, Container, Texture } from 'pixi.js'
import { ShockwaveFilter } from '@pixi/filter-shockwave'

// 获取配置
const clockStore = useClockStore()

// 总容器节点
const clockContainerRef = ref(null)

// 圆环节点
const circleRef = ref(null)

// 获取时钟节点
const clockRef = ref(null)

// 用 ref([]) 创建数组来存储每个列和冒号的节点引用
const colonRefs = ref([])
const columnRefs = ref([])

// 时钟定时器id
let intervalId = null

// 字体大小计算圆环和时钟的大小
const fontSize = computed(
  () => (window.innerHeight * clockStore.sizeOfWindow) / 7,
)

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
    circleRef.value.style.boxShadow = `0 0 ${clockStore.clockShadowBlur}px ${clockStore.clockShadowSpread}px rgb(${clockStore.clockShadowColor}), inset 0 0 ${clockStore.clockShadowBlur}px ${clockStore.clockShadowSpread}px rgb(${clockStore.clockShadowColor})`

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
      ele.style.color = `rgb(${clockStore.clockFontColor})`
      ele.style.fontSize = size + 'px'
      ele.style.lineHeight = size + 'px'
      ele.style.textShadow = `0 0 ${clockStore.clockFontShadowBlur}px rgb(${clockStore.clockFontShadowColor})`
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
  if (intervalId) clearInterval(intervalId)
})

// 使用pixijs制作水波效果
const pixiApp = new Application({
  backgroundAlpha: 0,
  resizeTo: window,
})
const container = new Container()

let sprite = null
let shockwaves = []
onMounted(async () => {
  clockContainerRef.value.appendChild(pixiApp.view)
  pixiApp.stage.addChild(container)

  // 加一个背景图或纹理
  const texture = Texture.from('bg.jpg')
  sprite = new Sprite(texture)
  sprite.width = window.innerWidth
  sprite.height = window.innerHeight
  // 初始化滤镜
  sprite.filters = []
  pixiApp.stage.addChild(sprite)

  // 水波纹动画播放器
  pixiApp.ticker.add((delta) => {
    // 更新水波纹动画
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const filter = shockwaves[i]
      // 水波动画速率
      filter.time += 0.03 * delta
      if (filter.time >= 2) {
        // 删除水波
        sprite.filters.splice(i, 1)
        shockwaves.splice(i, 1)
      }
    }
  })
})

// 添加水波纹
const addShockwave = () => {
  const shockwaveFilter = new ShockwaveFilter(
    [pixiApp.screen.width / 2, pixiApp.screen.height / 2],
    {
      radius: -1, // 初始半径
      wavelength: 150, // 波长
      amplitude: 30, // 振幅
      brightness: 1, // 亮度
      speed: 500, // 速度
    },
    0, // 初始时间
  )
  sprite.filters.push(shockwaveFilter)
  shockwaves.push(shockwaveFilter)
}

// 绘制时钟律动效果
function drawAudioCircle(audioArray) {
  const minSize = fontSize.value * 7

  // 取低频最大值
  const lowFreq = [...audioArray.slice(0, 16)]
  const lowAudioMaxValue = Math.max(...lowFreq) * 1000

  // 取高频平均值
  const highFreq = [...audioArray.slice(48, 64)]
  const highAudioAvgValue = Math.round(
    (highFreq.reduce((sum, value) => sum + value, 0) / 16) * 1000,
  )

  // 低频波纹、容器内阴影效果
  if (lowAudioMaxValue >= clockStore.clockMotionLowLimit) {
    // 波纹效果
    addShockwave()
  }

  // 高频圆环效果
  if (highAudioAvgValue >= clockStore.clockMotionHighLimit) {
    const highFreqSize = minSize + highAudioAvgValue / 10
    circleRef.value.style.width = `${highFreqSize}px`
    circleRef.value.style.height = `${highFreqSize}px`
    circleRef.value.style.transition = 'width 0.1s, height 0.1s'
  }
}

defineExpose({
  drawAudioCircle,
})
</script>

<template>
  <div class="clockContainer" ref="clockContainerRef">
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

.ripple-container {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ripple {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  animation: ripple 500ms ease-out forwards;
}

@keyframes ripple {
  to {
    transform: scale(1.5);
    opacity: 0;
  }
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
