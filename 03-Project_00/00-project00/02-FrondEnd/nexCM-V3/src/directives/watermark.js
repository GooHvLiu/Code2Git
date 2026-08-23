/**
 * ==========================================
 * 水印自定义指令
 * ==========================================
 * 在指定元素上添加文字水印，防止截图泄露
 * 支持自定义文字、颜色、透明度、旋转角度、间距
 *
 * 用法：
 * <div v-watermark="'用户名'">内容</div>
 * <div v-watermark="{ text: '用户名', color: 'rgba(0,0,0,0.1)', rotate: -30 }">内容</div>
 *
 * 也可在 App.vue 上全局使用：
 * <div id="app" v-watermark="watermarkText">
 */

/** 默认配置 */
const DEFAULT_OPTIONS = {
  /** 水印文字 */
  text: '',
  /** 文字颜色 */
  color: 'rgba(0, 0, 0, 0.08)',
  /** 字体大小 */
  fontSize: 14,
  /** 旋转角度 */
  rotate: -30,
  /** 水平间距 */
  gapX: 200,
  /** 垂直间距 */
  gapY: 150,
  /** z-index */
  zIndex: 9999
}

/**
 * 创建水印 canvas 并返回 base64 图片
 */
function createWatermarkImage(options) {
  const { text, color, fontSize, rotate, gapX, gapY } = options
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // canvas 大小 = 水印间距
  canvas.width = gapX
  canvas.height = gapY

  ctx.font = `${fontSize}px Arial`
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // 旋转
  ctx.translate(gapX / 2, gapY / 2)
  ctx.rotate((rotate * Math.PI) / 180)
  ctx.fillText(text, 0, 0)

  return canvas.toDataURL('image/png')
}

/**
 * 给元素添加水印
 */
function addWatermark(el, binding) {
  // 解析配置
  const options = {
    ...DEFAULT_OPTIONS,
    ...(typeof binding.value === 'string' ? { text: binding.value } : binding.value || {})
  }

  // 移除旧水印（无论是否有文字，都先移除，避免关闭水印时旧水印残留）
  removeWatermark(el)

  // 没有文字不显示
  if (!options.text) return

  // 创建水印层
  const watermarkDiv = document.createElement('div')
  watermarkDiv.className = 'v-watermark-layer'
  watermarkDiv.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: ${options.zIndex};
    background-image: url(${createWatermarkImage(options)});
    background-repeat: repeat;
  `

  // 确保父元素是定位元素
  const position = getComputedStyle(el).position
  if (position === 'static') {
    el.style.position = 'relative'
  }

  el.appendChild(watermarkDiv)
  el._watermarkDiv = watermarkDiv
}

/**
 * 移除水印
 */
function removeWatermark(el) {
  if (el._watermarkDiv && el._watermarkDiv.parentNode) {
    el._watermarkDiv.parentNode.removeChild(el._watermarkDiv)
  }
  el._watermarkDiv = null
}

export default {
  /** 绑定指令时 */
  bind(el, binding) {
    addWatermark(el, binding)
  },
  /** 指令值更新时 */
  update(el, binding) {
    if (binding.value !== binding.oldValue) {
      addWatermark(el, binding)
    }
  },
  /** 指令解绑时 */
  unbind(el) {
    removeWatermark(el)
  }
}
