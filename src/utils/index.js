export function getCurrentTime(is_24_hour_clock) {
  var nowTime = new Date()
  var hour =
    is_24_hour_clock == true
      ? nowTime.getHours()
      : nowTime.getHours() % 12 || 12
  hour = hour < 10 ? '0' + hour : hour
  var minute =
    nowTime.getMinutes() < 10
      ? '0' + nowTime.getMinutes()
      : nowTime.getMinutes()
  var second =
    nowTime.getSeconds() < 10
      ? '0' + nowTime.getSeconds()
      : nowTime.getSeconds()
  return hour + '' + minute + '' + second
}

export function customColorAsCSS(color) {
  let customColor = color.split(' ')
  customColor = customColor.map(function (c) {
    return Math.ceil(c * 255)
  })
  return customColor == 0 ? false : customColor
}

export function getCenterBackgroundSize(width, height) {
  if (width * 9 != height * 16) {
    if (width * 9 > height * 16) {
      //屏幕过宽
      let offsetWTop = ((width * 9) / 16 - height) / 2

      return {
        width: width,
        height: (width * 9) / 16,
        offsetX: '0',
        offsetY: `-${offsetWTop}px`,
      }
    } else if (width * 9 < height * 16) {
      //屏幕过高
      let offsetWLeft = ((height * 16) / 9 - width) / 2

      return {
        width: (height * 16) / 9,
        height: height,
        offsetX: `-${offsetWLeft}px`,
        offsetY: '0',
      }
    }
  } else {
    return {
      width: width,
      height: height,
      offsetX: '0',
      offsetY: '0',
    }
  }
}

export function setBackgroundSize(element, width, height) {
  //调整每张图片的大小
  const setStyle = (width, height) => {
    element.style.backgroundSize = `${width}px ${height}px`
  }

  if (width * 9 != height * 16) {
    if (width * 9 > height * 16) {
      //屏幕过宽
      setStyle(width, (width * 9) / 16)

      let offsetWTop = ((width * 9) / 16 - height) / 2
      element.style.backgroundPositionX = '0'
      element.style.backgroundPositionY = `-${offsetWTop}px`
    } else if (width * 9 < height * 16) {
      //屏幕过高
      setStyle((height * 16) / 9, height)

      let offsetWLeft = ((height * 16) / 9 - width) / 2
      element.style.backgroundPositionX = `-${offsetWLeft}px`
      element.style.backgroundPositionY = '0'
    }
  } else {
    setStyle(width, height)
    element.style.backgroundPositionX = '0'
    element.style.backgroundPositionY = '0'
  }
}

export async function getThemeColor(imgSrc) {
  let themeColor = '#ffffff'
  // 加载图片
  const img = new Image()
  img.src = imgSrc
  await new Promise((resolve) => {
    img.onload = resolve
  })
  // 图片缩小
  let shrinkFactor = 10
  if (img.width > 300) {
    shrinkFactor = img.width / 300
  }
  let height = img.height / shrinkFactor
  let width = img.width / shrinkFactor
  // 创建 canvas，并获取所有像素
  const canvas = document.createElement('canvas')
  canvas.setAttribute('width', `${width}px`)
  canvas.setAttribute('height', `${height}px`)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)
  let originalPiexls
  try {
    //保存像素
    originalPiexls = ctx.getImageData(0, 0, width, height).data
    const matrix = Array.from(originalPiexls)
    let colorArr = []
    let colorList = {}
    let i = 0
    while (i < matrix.length) {
      const r = matrix[i]
      const g = matrix[i + 1]
      const b = matrix[i + 2]
      // const a = matrix[i + 3]
      i = i + 4 // 最后 +4 比每次 i++ 快 10ms 左右性能
      // const key = [r, g, b, a].join(',')
      const key = [r, g, b].join(',')
      key in colorList ? ++colorList[key] : (colorList[key] = 1)
    }
    for (let key in colorList) {
      colorArr.push({
        // rgba: `rgba(${key})`,
        rgb: `${key}`,
        num: colorList[key],
      })
    }
    colorArr = colorArr.sort((a, b) => {
      return b.num - a.num
    })
    themeColor = colorArr[0].rgb
  } catch (error) {
    console.log(error)
  }
  return themeColor
}

export function getHexColor(color) {
  const [r, g, b] = color.split(',').map((s) => parseInt(s.trim(), 10))
  const hexColor = `0x${[r, g, b]
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`
  return hexColor
}
