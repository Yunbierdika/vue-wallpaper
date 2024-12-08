<script setup>
import { onMounted, ref, watch } from 'vue'
import petalImage1src from '@/assets/images/petal/petal01.png'
import petalImage2src from '@/assets/images/petal/petal02.png'
import petalImage3src from '@/assets/images/petal/leaf01.png'
import petalImage4src from '@/assets/images/petal/leaf02.png'

import { usePetalFlakeStore } from '@/stores/petalFlakeStore'
import { useConfigStore } from '@/stores/configStore'
import { storeToRefs } from 'pinia'

const petalFlakeStore = usePetalFlakeStore()
const configStore = useConfigStore()
const { isAllLoaded } = storeToRefs(configStore)

const petalFakeCanvasRef = ref()
// 获取设备像素比
const pixelRatio = window.devicePixelRatio || 1
// 花瓣数组
const petalFlakes = ref([])

// 花瓣图片
const petalImage1 = new Image()
petalImage1.src = petalImage1src
const petalImage2 = new Image()
petalImage2.src = petalImage2src
const petalImage3 = new Image()
petalImage3.src = petalImage3src
const petalImage4 = new Image()
petalImage4.src = petalImage4src
const petalImages = [petalImage1, petalImage2, petalImage3, petalImage4]

onMounted(() => {
  const petalFakeCanvas = petalFakeCanvasRef.value
  if (!petalFakeCanvas) return

  const ctx = petalFakeCanvas.getContext('2d')

  // 定义花瓣的构造函数
  class PetalFlake {
    x
    y
    size
    velocity
    windSpeed
    windAngle
    rotation
    rotationDirection
    imgIndex

    constructor() {
      // 花瓣的x坐标，随机生成
      this.x = Math.random() * petalFakeCanvas.width
      // 花瓣的y坐标，随机生成
      this.y = Math.random() * petalFakeCanvas.height
      // 花瓣的尺寸
      this.size = petalFlakeStore.petalMaxSize * (0.5 + Math.random() * 0.5)
      // 花瓣的下落速度
      this.velocity = (this.size * petalFlakeStore.petalFallSpeed) / 100
      // 花瓣的风速
      this.windSpeed = petalFlakeStore.petalWindSpeed / this.size
      // 花瓣的风的角度
      this.windAngle = (Math.PI / 180) * petalFlakeStore.petalWindAngle
      // 花瓣的旋转角度，随机生成
      this.rotation = Math.random() * 360
      // 花瓣的旋转方向，随机生成 -1 或 1
      this.rotationDirection = Math.random() < 0.5 ? -1 : 1
      // 随机选择图片
      this.imgIndex = Math.floor(Math.random() * petalImages.length)
    }

    // 判断花瓣是否超出画布
    isOutsideCanvas() {
      return (
        this.x < -this.size ||
        this.x > petalFakeCanvas.width + this.size ||
        this.y > petalFakeCanvas.height + this.size
      )
    }

    // 重置花瓣的坐标
    reset() {
      // 超出画布后，重置花瓣的坐标
      if (this.y < petalFakeCanvas.height + this.size) {
        // 花瓣y坐标还没到达底部，但是x坐标已经超出画布
        // 判断风向是朝左吹还是朝右吹，然后进行选择性生成未到底部的花瓣的x坐标
        this.x =
          Math.cos(this.windAngle) < 0
            ? petalFakeCanvas.width + this.size
            : -this.size
      } else {
        // 花瓣y坐标已经到达底部的情况
        // 情况1（event === -1）：x坐标在画布中随机，y坐标为-this.size
        // 情况2（event === 1）：x坐标根据风向选择性在最左边和最右边，y坐标为Math.random() * (petalFakeCanvas!.height + this.size)
        let event = Math.random() < 0.5 ? -1 : 1
        this.x =
          event === -1
            ? Math.random() * (petalFakeCanvas.width + this.size)
            : Math.cos(this.windAngle) < 0
              ? petalFakeCanvas.width + this.size
              : -this.size
        this.y =
          event === -1
            ? -this.size
            : Math.random() * (petalFakeCanvas.height + this.size)
      }
    }

    // 更新花瓣的坐标
    update() {
      // x坐标为风向*风速（风向为角度的cos值，大于90度为向左飘，x值越来越小，反之x向右飘，x值越来越大）
      this.x += Math.cos(this.windAngle) * this.windSpeed
      // y坐标为速度，越来越大，向下飘
      this.y += Math.sin(this.windAngle) * this.velocity
      // 更新旋转角度，考虑旋转方向
      this.rotation += (this.rotationDirection * Math.random() * 50) / this.size

      if (this.isOutsideCanvas()) {
        this.reset()
      }
    }

    // 绘制花瓣
    draw() {
      ctx.beginPath()
      ctx.save()
      // 将透明度应用到绘制上下文
      ctx.globalAlpha = petalFlakeStore.petalOpacity

      // 将绘制原点移动到花瓣中心位置
      ctx.translate(this.x + this.size / 2, this.y + this.size / 2)
      // 应用旋转角度
      ctx.rotate((this.rotation * Math.PI) / 180)

      if (petalFlakeStore.petalShadowEnabled) {
        // 添加阴影效果
        ctx.shadowColor = petalFlakeStore.petalShadowColor
        ctx.shadowBlur = petalFlakeStore.petalShadowBlur
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
      }

      // 绘制花瓣
      ctx.drawImage(
        petalImages[this.imgIndex],
        -this.size / 2,
        -this.size / 2,
        this.size,
        this.size
      )
      ctx.restore()
      ctx.closePath()
    }
  }

  // 创建花瓣的函数
  const createPetalFlakes = () => {
    // 计算花瓣的数量，根据画布的宽高比计算
    /*const petalFlakesCount = Math.floor(
      (window.innerWidth * window.innerHeight) / 20000
    )*/

    // 循环创建花瓣的实例
    for (let i = 0; i < petalFlakeStore.petalCount; i++) {
      let petalFlake = new PetalFlake()
      petalFlakes.value.push(petalFlake)
    }
    // console.log('created = ', petalFlakes.value)
  }

  // 重置画布的函数
  const resizeCanvas = () => {
    // 获取画布的宽高
    const width = window.innerWidth
    const height = window.innerHeight
    // 设置画布宽高
    petalFakeCanvas.width = width * pixelRatio
    petalFakeCanvas.height = height * pixelRatio
    petalFakeCanvas.style.width = width + 'px'
    petalFakeCanvas.style.height = height + 'px'
    // 设置画布的缩放比例
    ctx.scale(pixelRatio, pixelRatio)
    // 清空花瓣的数组
    petalFlakes.value.length = 0
    // 重新创建花瓣的实例
    createPetalFlakes()
  }

  // 监听画布的resize事件,调用resizeCanvas函数
  window.addEventListener('resize', resizeCanvas)

  // 监听配置的变化并初始化配置
  watch(
    isAllLoaded,
    (val) => {
      if (val) {
        resizeCanvas()
      }
    },
    { immediate: true }
  )

  // 渲染函数
  const render = () => {
    requestAnimationFrame(render)

    // 清空画布
    ctx.clearRect(0, 0, petalFakeCanvas.width, petalFakeCanvas.height)
    // 遍历花瓣的数组,更新花瓣的坐标,绘制花瓣
    petalFlakes.value.forEach((PetalFlake) => {
      PetalFlake.update()
      PetalFlake.draw()
    })
  }

  // 开始渲染
  render()
})
</script>

<template>
  <canvas ref="petalFakeCanvasRef" id="PetalFakeCanvas"></canvas>
</template>

<style scoped>
#PetalFakeCanvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999; /* 确保这个数值比其他元素的z-index大 */
  pointer-events: none;
}
</style>
