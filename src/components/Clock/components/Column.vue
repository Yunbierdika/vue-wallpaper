<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useClockStore } from '@/stores/clockStore'

const clockStore = useClockStore()

const props = defineProps({
  numLength: Number
})

// 组件引用
const columnRef = ref(null)

// 所有可见度类型的数组
const class_list = ['visible', 'near', 'far', 'distant']
// 偏移量控制方法
const setOffset = (offset, number) => {
  if (!columnRef.value) return
  // 设置数字偏移量
  columnRef.value.style.transform = 'translateY(' + offset + 'px)'

  // 遍历所有子节点并调整样式
  Array.from(columnRef.value.children).forEach((numNode, index) => {
    // 设置每一位数的样式（透明度改变）
    numNode.className = 'num ' + getClass(number, index)
  })
}

// 获取对应的样式名
//findNumber：需要查找的数字, currentNumber：调用当前方法的数组的索引号
function getClass(findNumber, currentNumber) {
  return (
    class_list.find((_string, class_list_index) => {
      //查找当前数组，class_list_index为当前数组的索引号
      return (
        currentNumber - class_list_index === findNumber ||
        currentNumber + class_list_index === findNumber
      )
    }) || ''
  )
}

onMounted(() => {
  // 获取节点，并动态设置字体大小
  const column = columnRef.value
  if (!column) return

  const fontSize = computed(
    () => (window.innerHeight * clockStore.sizeOfWindow) / 7
  )

  const updateClockStyles = () => {
    // 更新字体大小
    const size = fontSize.value

    column.style.color = clockStore.clockFontColor
    column.style.fontSize = size + 'px'
    column.style.lineHeight = size + 'px'
    column.style.textShadow = `0 0 ${clockStore.clockFontShadowBlur}px ${clockStore.clockFontShadowColor}`
  }

  // 初始化样式
  updateClockStyles()

  // 监听 fontSize 的变化
  watch(clockStore.clockConfig, updateClockStyles)
})

// 向外暴露方法
defineExpose({ setOffset })
</script>

<template>
  <div class="column" ref="columnRef">
    <div v-for="(item, index) in props.numLength" :key="index" class="num">
      {{ index }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.column {
  display: inline-block;
  font-family: 'Verdana';
  vertical-align: top;
  transition: all 0.5s ease;

  .num {
    opacity: 0.1;
    transition: 0.5s;
  }

  .visible {
    opacity: 1;
  }

  .near {
    opacity: 0.75;
  }

  .far {
    opacity: 0.5;
  }

  .distant {
    opacity: 0.3;
  }
}
</style>
