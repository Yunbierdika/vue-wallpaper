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
  return 'rgb(' + customColor + ')'
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
  }
}
