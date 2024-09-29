<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useAudioVisualizationStore } from '@/stores/audioVisualizationStore'

const audioVisualizationStore = useAudioVisualizationStore()

const audioCanvasRef = ref(null)
// 线性插值函数
function lerp(start, end, factor) {
  return start + factor * (end - start)
}

let animationFrameId = null

onMounted(() => {
  const audioCanvas = audioCanvasRef.value
  if (!audioCanvas) return

  audioCanvas.width = window.innerWidth
  audioCanvas.height = window.innerHeight

  // 获取画布的2D上下文
  const ctx = audioCanvas.getContext('2d')

  // 保存前一帧的音频数据以进行插值
  let previousAudioArray = new Array(128).fill(0)

  function wallpaperAudioListener(audioArray) {
    if (!audioArray) return

    // 请求下一帧动画
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    animationFrameId = requestAnimationFrame(() => drawAudioBars(audioArray))
  }

  function drawAudioBars(audioArray) {
    // 清空画布但不设置任何颜色，从而保留背景图片
    ctx.clearRect(0, 0, audioCanvas.width, audioCanvas.height)

    const barWidth = Math.min((1.0 / 128.0) * audioCanvas.width)
    const halfCount = audioArray.length / 2

    // 设置音频条颜色
    ctx.fillStyle = audioVisualizationStore.barColor

    if (audioVisualizationStore.barShadowEnabled) {
      // 添加阴影效果
      ctx.shadowColor = audioVisualizationStore.barShadowColor
      ctx.shadowBlur = audioVisualizationStore.barShadowBlur
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    } else {
      ctx.shadowColor = null // 或者使用 'transparent'
      ctx.shadowBlur = 0
    }

    // 开始绘制左声道
    for (let i = 0; i < halfCount; ++i) {
      const lerpHeight =
        audioCanvas.height *
        Math.min(
          lerp(
            previousAudioArray[i],
            audioArray[i],
            audioVisualizationStore.lerpFactor
          ),
          1
        )

      let height =
        lerpHeight <=
        audioCanvas.height * audioVisualizationStore.barHeightLimit
          ? lerpHeight
          : audioCanvas.height * audioVisualizationStore.barHeightLimit

      ctx.fillRect(
        barWidth * i,
        audioCanvas.height -
          audioVisualizationStore.barYOffset -
          Math.max(height, audioVisualizationStore.barHeightInit),
        barWidth * audioVisualizationStore.barWidthMultiplier,
        Math.max(height, audioVisualizationStore.barHeightInit)
      )

      // 更新前一帧数据
      previousAudioArray[i] = audioArray[i]
    }

    // 绘制右声道
    for (let i = halfCount; i < audioArray.length; ++i) {
      const lerpHeight =
        audioCanvas.height *
        Math.min(
          lerp(
            previousAudioArray[i],
            audioArray[191 - i],
            audioVisualizationStore.lerpFactor
          ),
          1
        )

      let height =
        lerpHeight <=
        audioCanvas.height * audioVisualizationStore.barHeightLimit
          ? lerpHeight
          : audioCanvas.height * audioVisualizationStore.barHeightLimit

      ctx.fillRect(
        barWidth * i,
        audioCanvas.height -
          audioVisualizationStore.barYOffset -
          Math.max(height, audioVisualizationStore.barHeightInit),
        barWidth * audioVisualizationStore.barWidthMultiplier,
        Math.max(height, audioVisualizationStore.barHeightInit)
      )

      // 更新前一帧数据
      previousAudioArray[i] = audioArray[191 - i]
    }
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
  <canvas id="AudioCanvas" ref="audioCanvasRef"></canvas>
</template>

<style scoped>
#AudioCanvas {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
