<script setup>
import { onMounted, ref } from 'vue'
import { useAudioVisualizationStore } from '@/stores/audioVisualizationStore'

const audioVisualizationStore = useAudioVisualizationStore()

const audioCanvasRef = ref(null)
// 线性插值函数
function lerp(start, end, factor) {
  return start + factor * (end - start)
}

// 保存前一帧的音频数据以进行插值
let previousAudioArray = new Array(128).fill(0)

function drawAudioBars(audioArray) {
  const audioCanvas = audioCanvasRef.value

  // 获取画布的2D上下文
  const ctx = audioCanvas.getContext('2d')
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

  const drawRect = (lerpHeight, i) => {
    let height =
      lerpHeight <= audioCanvas.height * audioVisualizationStore.barHeightLimit
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
  }

  // 绘制左声道
  for (let i = 0; i < audioArray.length; ++i) {
    const lerpHeight =
      audioCanvas.height *
      Math.min(
        lerp(
          previousAudioArray[i],
          i < halfCount ? audioArray[i] : previousAudioArray[191 - i],
          audioVisualizationStore.lerpFactor
        ),
        1
      )

    drawRect(lerpHeight, i)

    // 更新前一帧数据
    if (i < halfCount) previousAudioArray[i] = audioArray[i]
    else previousAudioArray[i] = audioArray[191 - i]
  }
}

onMounted(() => {
  audioCanvasRef.value.width = window.innerWidth
  audioCanvasRef.value.height = window.innerHeight
})

defineExpose({
  drawAudioBars
})
</script>

<template>
  <canvas id="AudioCanvas" ref="audioCanvasRef"></canvas>
</template>

<style scoped>
#AudioCanvas {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
