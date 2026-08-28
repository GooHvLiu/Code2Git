/**
 * ==========================================
 * 通用 PDF 生成工具
 * ==========================================
 * 基于 html2canvas + jsPDF 生成 PDF
 * 提供统一的容器创建、水印生成、图片转换、分页、保存等功能
 *
 * 用法：
 * import { createPdfContainer, generatePdfFromElement, createWatermarkLayer } from '@/utils/pdfGenerator'
 *
 * // 1. 创建 PDF 容器
 * const { outer, container } = createPdfContainer({ width: 1100, minHeight: 1556 })
 *
 * // 2. 向 container 中添加内容
 * container.appendChild(yourContent)
 *
 * // 3. 生成 PDF
 * await generatePdfFromElement(container, {
 *   filename: '报告.pdf',
 *   successMessage: '生成成功',
 *   errorMessage: '生成失败'
 * })
 */

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { showSuccess, showError } from './message'

/**
 * 默认配置
 */
const DEFAULT_CONFIG = {
  // 容器宽度（px）
  width: 1100,
  // 容器最小高度（px）
  minHeight: 1556,
  // 容器内边距
  padding: '40px 35px',
  // 容器背景色
  background: '#fff',
  // 容器字体
  fontFamily: '"Microsoft YaHei", "PingFang SC", Arial, sans-serif',
  // 容器文字颜色
  color: '#303133',
  // html2canvas 缩放比例
  scale: 2,
  // 是否使用 CORS
  useCORS: true,
  // 背景色
  backgroundColor: '#ffffff',
  // PDF 页面宽度（mm），A4
  imgWidth: 210,
  // PDF 页面高度（mm），A4
  pageHeight: 297,
  // 分页阈值（mm），避免浮点数精度问题导致空白页
  pageThreshold: 1
}

/**
 * 创建 PDF 容器
 * @param {Object} options 配置选项
 * @param {number} options.width 容器宽度（px）
 * @param {number} options.minHeight 容器最小高度（px）
 * @param {string} options.padding 容器内边距
 * @param {string} options.background 容器背景色
 * @param {string} options.fontFamily 容器字体
 * @param {string} options.color 容器文字颜色
 * @returns {Object} { outer, container } outer 是外层容器（隐藏在视口外），container 是内层内容容器
 */
export function createPdfContainer(options = {}) {
  const config = { ...DEFAULT_CONFIG, ...options }

  // 外层容器（隐藏在视口外）
  const outer = document.createElement('div')
  outer.style.position = 'fixed'
  outer.style.left = '-9999px'
  outer.style.top = '0'
  outer.style.zIndex = '-1'

  // 内层报告容器（A4 比例）
  const container = document.createElement('div')
  container.style.position = 'relative'
  container.style.width = `${config.width}px`
  container.style.minHeight = `${config.minHeight}px`
  container.style.background = config.background
  container.style.padding = config.padding
  container.style.boxSizing = 'border-box'
  container.style.fontFamily = config.fontFamily
  container.style.color = config.color

  outer.appendChild(container)
  document.body.appendChild(outer)

  return { outer, container }
}

/**
 * 生成水印层（平铺旋转文字，覆盖整个容器）
 * @param {string} text 水印文字
 * @param {Object} options 配置选项
 * @param {number} options.cols 列数
 * @param {number} options.rows 行数
 * @param {string} options.fontSize 字体大小
 * @param {string} options.color 字体颜色
 * @param {number} options.opacity 透明度
 * @param {number} options.rotate 旋转角度
 * @returns {HTMLElement} 水印容器
 */
export function createWatermarkLayer(text, options = {}) {
  const config = {
    cols: 5,
    rows: 14,
    fontSize: '14px',
    color: '#909399',
    opacity: '0.1',
    rotate: -30,
    ...options
  }

  const layer = document.createElement('div')
  layer.style.position = 'absolute'
  layer.style.top = '0'
  layer.style.left = '0'
  layer.style.width = '100%'
  layer.style.height = '100%'
  layer.style.overflow = 'hidden'
  layer.style.pointerEvents = 'none'
  layer.style.zIndex = '10'

  for (let r = 0; r < config.rows; r++) {
    for (let c = 0; c < config.cols; c++) {
      const item = document.createElement('div')
      item.style.position = 'absolute'
      item.style.left = `${c * 20 + 2}%`
      item.style.top = `${r * 7 + 2}%`
      item.style.fontSize = config.fontSize
      item.style.color = config.color
      item.style.opacity = config.opacity
      item.style.transform = `rotate(${config.rotate}deg)`
      item.style.transformOrigin = 'center center'
      item.style.whiteSpace = 'nowrap'
      item.style.fontWeight = '600'
      item.style.letterSpacing = '2px'
      item.textContent = text
      layer.appendChild(item)
    }
  }

  return layer
}

/**
 * 从 DOM 元素生成 PDF
 * @param {HTMLElement} element 要生成 PDF 的 DOM 元素
 * @param {Object} options 配置选项
 * @param {string} options.filename 文件名（不含扩展名，自动加 .pdf）
 * @param {string} options.successMessage 成功提示消息
 * @param {string} options.errorMessage 失败提示消息
 * @param {number} options.scale html2canvas 缩放比例
 * @param {boolean} options.useCORS 是否使用 CORS
 * @param {string} options.backgroundColor 背景色
 * @param {number} options.imgWidth PDF 页面宽度（mm）
 * @param {number} options.pageHeight PDF 页面高度（mm）
 * @param {number} options.pageThreshold 分页阈值（mm）
 * @param {Function} options.onBeforeCleanup 清理 DOM 前的回调
 * @returns {Promise<void>}
 */
export function generatePdfFromElement(element, options = {}) {
  return new Promise((resolve, reject) => {
    const config = { ...DEFAULT_CONFIG, ...options }

    try {
      // 使用 html2canvas 转为图片
      html2canvas(element, {
        scale: config.scale,
        useCORS: config.useCORS,
        backgroundColor: config.backgroundColor
      }).then(canvas => {
        try {
          // 执行清理前回调
          if (typeof config.onBeforeCleanup === 'function') {
            config.onBeforeCleanup()
          }

          const imgData = canvas.toDataURL('image/png')
          const imgHeight = (canvas.height * config.imgWidth) / canvas.width
          let heightLeft = imgHeight
          let position = 0

          const pdf = new jsPDF('p', 'mm', 'a4')
          pdf.addImage(imgData, 'PNG', 0, position, config.imgWidth, imgHeight)
          heightLeft -= config.pageHeight

          // 分页逻辑：添加阈值避免浮点数精度问题导致多一页空白
          while (heightLeft > config.pageThreshold) {
            position = heightLeft - imgHeight
            pdf.addPage()
            pdf.addImage(imgData, 'PNG', 0, position, config.imgWidth, imgHeight)
            heightLeft -= config.pageHeight
          }

          const filename = config.filename.endsWith('.pdf') ? config.filename : `${config.filename}.pdf`
          pdf.save(filename)

          if (config.successMessage) {
            showSuccess(config.successMessage)
          }

          resolve()
        } catch (innerErr) {
          // eslint-disable-next-line no-console
          console.error('[PDF生成器] PDF生成阶段异常:', innerErr)
          if (config.errorMessage) {
            showError(config.errorMessage)
          }
          reject(innerErr)
        }
      }).catch(err => {
        // eslint-disable-next-line no-console
        console.error('[PDF生成器] html2canvas渲染失败:', err)
        if (config.errorMessage) {
          showError(config.errorMessage)
        }
        reject(err)
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[PDF生成器] 初始化阶段异常:', err)
      if (config.errorMessage) {
        showError(config.errorMessage)
      }
      reject(err)
    }
  })
}

/**
 * 清理 PDF 容器
 * @param {HTMLElement} outer 外层容器
 */
export function cleanupPdfContainer(outer) {
  if (outer && outer.parentNode) {
    document.body.removeChild(outer)
  }
}

export default {
  createPdfContainer,
  createWatermarkLayer,
  generatePdfFromElement,
  cleanupPdfContainer
}
