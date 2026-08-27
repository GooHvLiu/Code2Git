/**
 * ==========================================
 * 表格导出工具模块（Excel / PDF）
 * ==========================================
 * 纯前端生成，支持全部导出和选中导出，样式美观
 * 支持 PDF 水印（当前用户名）、导出人信息、国际化标题
 *
 * 用法：
 * import { exportTable, exportExcel, exportPdf } from '@/utils/exportTable'
 *
 * // 统一入口
 * exportTable({
 *   data: tableData,           // 数据数组
 *   columns: columns,           // 列配置 [{label, prop, width, formatter}]
 *   title: '用户列表',          // 导出标题（国际化后传入）
 *   filename: '用户列表',       // 文件名（不含扩展名，国际化后传入）
 *   format: 'excel',           // 'excel' | 'pdf'
 *   selected: selectedRows,    // 可选，选中行数据，传了则只导出选中
 *   exporter: 'admin',         // 可选，导出人（当前用户名），PDF 副标题显示
 *   watermark: true,           // 可选，PDF 是否启用水印，默认 true
 *   watermarkText: 'admin'     // 可选，水印文字，默认用 exporter
 * })
 */

import * as XLSX from 'xlsx'
import { createPdfContainer, createWatermarkLayer, generatePdfFromElement, cleanupPdfContainer } from './pdfGenerator'
import { showSuccess, showError, showWarning } from './message'

/**
 * 处理列配置，提取 label 和 prop，支持 formatter
 */
function getRowValues(columns, row) {
  return columns.map(col => {
    if (col.formatter) {
      return col.formatter(row, col)
    }
    const value = row[col.prop]
    if (value === null || value === undefined || value === '') {
      return '--'
    }
    return value
  })
}

/**
 * 过滤有效列（排除没有 prop 的操作列等）
 */
function filterExportColumns(columns) {
  return columns.filter(col => col.prop && col.export !== false)
}

/**
 * 格式化当前时间
 */
function formatNow() {
  const now = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

/**
 * 导出 Excel
 * @param {Array} data 数据数组
 * @param {Array} columns 列配置
 * @param {Object} options 配置 { title, filename, sheetName }
 */
export function exportExcel(data, columns, options = {}) {
  const {
    filename = '导出数据',
    sheetName = 'Sheet1'
  } = options

  const exportColumns = filterExportColumns(columns)

  if (!exportColumns.length) {
    showError('没有可导出的列')
    return
  }

  if (!data || !data.length) {
    showWarning('没有可导出的数据')
    return
  }

  // 构建表头
  const headers = exportColumns.map(col => col.label)

  // 构建数据行
  const rows = data.map(row => getRowValues(exportColumns, row))

  // 创建工作簿
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])

  // 设置列宽
  worksheet['!cols'] = exportColumns.map(col => ({
    wch: col.width ? Math.max(col.width / 8, 10) : 15
  }))

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  // 导出文件
  XLSX.writeFile(workbook, `${filename}.xlsx`)

  showSuccess(`成功导出 ${data.length} 条数据`)
}

/**
 * 导出 PDF（使用 html2canvas + jsPDF，完美支持中文）
 * @param {Array} data 数据数组
 * @param {Array} columns 列配置
 * @param {Object} options 配置 { title, filename, exporter, watermark, watermarkText }
 */
export function exportPdf(data, columns, options = {}) {
  const {
    title = '导出数据',
    filename = '导出数据',
    exporter = '',
    watermark = true,
    watermarkText = '',
    labels = {}
  } = options

  // 国际化标签（默认中文，调用方可传入英文等）
  const i18nLabels = {
    exporter: labels.exporter || '导出人',
    time: labels.time || '导出时间',
    countPrefix: labels.countPrefix || '共',
    countSuffix: labels.countSuffix || '条记录'
  }

  const exportColumns = filterExportColumns(columns)

  if (!exportColumns.length) {
    showError('没有可导出的列')
    return
  }

  if (!data || !data.length) {
    showWarning('没有可导出的数据')
    return
  }

  // 使用通用工具创建 PDF 容器
  const { outer, container } = createPdfContainer({
    width: 1100,
    minHeight: 1556,
    padding: '40px 30px'
  })

  // 水印层（覆盖整个内层容器）
  if (watermark) {
    const wmText = watermarkText || exporter || 'NEX'
    container.appendChild(createWatermarkLayer(wmText, { rows: 12, fontSize: '15px', opacity: '0.12' }))
  }

  // 内容层（在水印之上）
  const content = document.createElement('div')
  content.style.position = 'relative'
  content.style.zIndex = '1'

  // 标题
  const titleEl = document.createElement('div')
  titleEl.style.textAlign = 'center'
  titleEl.style.fontSize = '22px'
  titleEl.style.fontWeight = 'bold'
  titleEl.style.color = '#303133'
  titleEl.style.marginBottom = '8px'
  titleEl.textContent = title
  content.appendChild(titleEl)

  // 副标题（导出人 + 导出时间 + 记录数）- 支持国际化
  const subEl = document.createElement('div')
  subEl.style.textAlign = 'center'
  subEl.style.fontSize = '12px'
  subEl.style.color = '#909399'
  subEl.style.marginBottom = '20px'
  const parts = []
  if (exporter) {
    parts.push(`${i18nLabels.exporter}：${exporter}`)
  }
  parts.push(`${i18nLabels.time}：${formatNow()}`)
  parts.push(`${i18nLabels.countPrefix} ${data.length} ${i18nLabels.countSuffix}`)
  subEl.textContent = parts.join('  |  ')
  content.appendChild(subEl)

  // 表格
  const table = document.createElement('table')
  table.style.width = '100%'
  table.style.borderCollapse = 'collapse'
  table.style.fontSize = '13px'
  table.style.color = '#606266'

  // 表头
  const thead = document.createElement('thead')
  const headerRow = document.createElement('tr')
  headerRow.style.background = '#f5f7fa'
  exportColumns.forEach(col => {
    const th = document.createElement('th')
    th.style.border = '1px solid #ebeef5'
    th.style.padding = '10px 12px'
    th.style.textAlign = 'center'
    th.style.fontWeight = '600'
    th.style.color = '#303133'
    th.style.whiteSpace = 'nowrap'
    th.textContent = col.label
    headerRow.appendChild(th)
  })
  thead.appendChild(headerRow)
  table.appendChild(thead)

  // 表体
  const tbody = document.createElement('tbody')
  data.forEach((row, index) => {
    const tr = document.createElement('tr')
    tr.style.background = index % 2 === 0 ? '#fff' : '#fafafa'
    const values = getRowValues(exportColumns, row)
    values.forEach((value, colIndex) => {
      const td = document.createElement('td')
      td.style.border = '1px solid #ebeef5'
      td.style.padding = '8px 12px'
      td.style.textAlign = exportColumns[colIndex].align || 'center'
      td.style.maxWidth = exportColumns[colIndex].width ? `${exportColumns[colIndex].width}px` : 'none'
      td.style.wordBreak = 'break-all'
      td.textContent = String(value)
      tr.appendChild(td)
    })
    tbody.appendChild(tr)
  })
  table.appendChild(tbody)
  content.appendChild(table)

  container.appendChild(content)

  // 使用通用工具生成 PDF
  generatePdfFromElement(container, {
    filename,
    successMessage: `成功导出 ${data.length} 条数据`,
    errorMessage: 'PDF 导出失败，请重试',
    onBeforeCleanup: () => {
      cleanupPdfContainer(outer)
    }
  }).catch(() => {
    cleanupPdfContainer(outer)
  })
}

/**
 * 统一导出入口
 * @param {Object} config 配置
 * @param {Array} config.data 全部数据
 * @param {Array} config.columns 列配置
 * @param {String} config.title 标题（国际化后传入）
 * @param {String} config.filename 文件名（国际化后传入）
 * @param {String} config.format 格式 'excel' | 'pdf'
 * @param {Array} [config.selected] 选中行数据，传了则只导出选中
 * @param {String} [config.exporter] 导出人（当前用户名），PDF 副标题显示
 * @param {Boolean} [config.watermark] PDF 是否启用水印，默认 true
 * @param {String} [config.watermarkText] 水印文字，默认用 exporter
 */
export function exportTable(config) {
  const {
    data,
    columns,
    title = '导出数据',
    filename = '导出数据',
    format = 'excel',
    selected = null,
    exporter = '',
    watermark = true,
    watermarkText = '',
    labels = {}
  } = config

  // 确定导出数据
  let exportData = data
  if (selected && selected.length > 0) {
    exportData = selected
  }

  if (!exportData || !exportData.length) {
    showWarning('没有可导出的数据')
    return
  }

  const options = { title, filename, exporter, watermark, watermarkText, labels }

  if (format === 'excel') {
    exportExcel(exportData, columns, options)
  } else if (format === 'pdf') {
    exportPdf(exportData, columns, options)
  } else {
    showError('不支持的导出格式')
  }
}

export default {
  exportTable,
  exportExcel,
  exportPdf
}
