// 音频可视化配置
export const audioVisualizationConfig = {
  // 是否开启音频可视化
  audioVisualizationEnabled: true,
  // 左声道颜色
  barColorLeft: '#fff',
  // 右声道颜色
  barColorRight: '#fff',
  // 音频条阴影颜色
  barShadowColor: 'rgba(255, 128, 192, 1)',
  // 音频条的阴影宽度
  barShadowBlur: 50,
  // 音频条的宽度
  barWidthMultiplier: 0.8,
  // 音频条的初始高度
  barHeightInit: 2,
  // 音频条限制高度（限制值为屏幕高度X此数）
  barHeightLimit: 0.5,
  // 音频条Y轴偏移量
  barYOffset: 60,
  // 插值因子（推荐0.0~0.5之间，越大越平滑）
  lerpFactor: 0.5
}

// 时钟配置
export const clockConfig = {
  // 是否开启时钟
  clockEnabled: true,
  // 时钟大小占浏览器窗口的比例
  sizeOfWindow: 0.6
}

// 花瓣飘落效果配置
export const petalFlakeConfig = {
  // 花瓣的最大尺寸（实际尺寸为：这个值 * 0.5到1的随机数）
  size: 30,
  // 花瓣的风速（实际速度为：这个值 / 尺寸）
  windSpeed: 50,
  // 花瓣飘落角度（90度为垂直向下）
  windAngle: 45,
  // 花瓣的下落速度（实际速度为：尺寸 * 这个值）
  fallSpeed: 10,
  // 花瓣的透明度
  opacity: 0.5,
  // 花瓣的数量
  count: 20,
  // 是否开启花瓣阴影效果
  shadowEnabled: true,
  // 花瓣的阴影颜色及透明度
  // shadowColor: 'rgba(255, 128, 192, 1.0)',
  shadowColor: 'rgba(255, 140, 0, 1.0)',
  // 花瓣阴影的扩散程度(Blur)
  shadowBlur: 10
}
