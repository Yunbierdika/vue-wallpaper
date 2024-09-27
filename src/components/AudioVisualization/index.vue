<template>
  <canvas id="AudioCanvas" ref="audioCanvasRef"></canvas>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useAudioVisualizationStore } from '@/stores/audioVisualizationStore'
import { storeToRefs } from 'pinia'

const audioVisualizationStore = useAudioVisualizationStore()
const {
  barColorLeft,
  barColorRight,
  barShadowColor,
  barShadowBlur,
  barWidthMultiplier,
  barHeightInit,
  barHeightLimit,
  barYOffset,
  lerpFactor
} = storeToRefs(audioVisualizationStore)

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
  // ctx.shadowColor = barShadowColor.value
  // ctx.shadowBlur = barShadowBlur.value

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

    // 开始绘制红色的左声道
    ctx.fillStyle = barColorLeft.value
    ctx.shadowColor = barShadowColor.value
    ctx.shadowBlur = barShadowBlur.value
    for (let i = 0; i < halfCount; ++i) {
      const lerpHeight =
        audioCanvas.height *
        Math.min(
          lerp(previousAudioArray[i], audioArray[i], lerpFactor.value),
          1
        )

      let height =
        lerpHeight <= audioCanvas.height * barHeightLimit.value
          ? lerpHeight
          : audioCanvas.height * barHeightLimit.value

      ctx.fillRect(
        barWidth * i,
        audioCanvas.height -
          barYOffset.value -
          Math.max(height, barHeightInit.value),
        barWidth * barWidthMultiplier.value,
        Math.max(height, barHeightInit.value)
      )

      // 更新前一帧数据
      previousAudioArray[i] = audioArray[i]
    }

    // 绘制蓝色的右声道
    ctx.fillStyle = barColorRight.value
    ctx.shadowColor = barShadowColor.value
    ctx.shadowBlur = barShadowBlur.value
    for (let i = halfCount; i < audioArray.length; ++i) {
      const lerpHeight =
        audioCanvas.height *
        Math.min(
          lerp(previousAudioArray[i], audioArray[191 - i], lerpFactor.value),
          1
        )

      let height =
        lerpHeight <= audioCanvas.height * barHeightLimit.value
          ? lerpHeight
          : audioCanvas.height * barHeightLimit.value

      ctx.fillRect(
        barWidth * i,
        audioCanvas.height -
          barYOffset.value -
          Math.max(height, barHeightInit.value),
        barWidth * barWidthMultiplier.value,
        Math.max(height, barHeightInit.value)
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

<style scoped>
#AudioCanvas {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
