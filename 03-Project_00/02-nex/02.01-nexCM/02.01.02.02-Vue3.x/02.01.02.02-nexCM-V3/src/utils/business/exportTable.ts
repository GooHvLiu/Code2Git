/**
 * ==========================================
 * 表格导出工具（Excel / PDF）
 * ==========================================
 * 纯前端生成：Excel 用 xlsx；PDF 用 html2canvas + jsPDF（支持中文）。
 * 支持全部/选中导出、PDF 水印、导出人信息、国际化标签。
 *
 * 用法：
 *   import { exportTable } from '@/utils/business/exportTable'
 *   exportTable({ data, columns, title, filename, format: 'excel', exporter })
 * 作者：GooHv
 */
import * as XLSX from 'xlsx'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { showSuccess, showError, showWarning } from '@/utils/ui/feedback'

/** 列配置 */
export interface ExportColumn {
  label: string
  prop?: string
  width?: number
  align?: 'left' | 'center' | 'right' | string
  export?: boolean
  formatter?: (row: Record<string, unknown>, col?: ExportColumn) => unknown
}

/** 导出入口配置 */
export interface ExportTableOptions {
  data: Record<string, unknown>[]
  columns: ExportColumn[]
  title?: string
  filename?: string
  format?: 'excel' | 'pdf'
  selected?: Record<string, unknown>[] | null
  exporter?: string
  watermark?: boolean
  watermarkText?: string
  labels?: Record<string, string>
}

function getRowValues(columns: ExportColumn[], row: Record<string, unknown>): unknown[] {
  return columns.map((col) => {
    if (col.formatter) return col.formatter(row, col)
    const value = col.prop ? row[col.prop] : ''
    if (value === null || value === undefined || value === '') return '--'
    return value
  })
}

function filterExportColumns(columns: ExportColumn[]): ExportColumn[] {
  return columns.filter((col) => col.prop && col.export !== false)
}

function formatNow(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

/** 导出 Excel */
export function exportExcel(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  options: { filename?: string; sheetName?: string } = {}
): void {
  const { filename = 'export', sheetName = 'Sheet1' } = options
  const exportColumns = filterExportColumns(columns)
  if (!exportColumns.length) { showError('没有可导出的列'); return }
  if (!data || !data.length) { showWarning('没有可导出的数据'); return }

  const headers = exportColumns.map((col) => col.label)
  const rows = data.map((row) => getRowValues(exportColumns, row))
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
  worksheet['!cols'] = exportColumns.map((col) => ({
    wch: col.width ? Math.max(col.width / 8, 10) : 15
  }))
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  XLSX.writeFile(workbook, `${filename}.xlsx`)
  showSuccess(`成功导出 ${data.length} 条数据`)
}

/** 导出 PDF（html2canvas + jsPDF） */
export function exportPdf(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  options: {
    title?: string
    filename?: string
    exporter?: string
    watermark?: boolean
    watermarkText?: string
    labels?: Record<string, string>
  } = {}
): void {
  const {
    title = '导出数据',
    filename = 'export',
    exporter = '',
    watermark = true,
    watermarkText = '',
    labels = {}
  } = options

  const i18nLabels = {
    exporter: labels.exporter || '导出人',
    time: labels.time || '导出时间',
    countPrefix: labels.countPrefix || '共',
    countSuffix: labels.countSuffix || '条记录'
  }

  const exportColumns = filterExportColumns(columns)
  if (!exportColumns.length) { showError('没有可导出的列'); return }
  if (!data || !data.length) { showWarning('没有可导出的数据'); return }

  const container = document.createElement('div')
  container.style.width = '1040px'
  container.style.padding = '30px'
  container.style.position = 'relative'
  container.style.background = '#fff'

  if (watermark) {
    const wm = document.createElement('div')
    wm.style.cssText = 'position:absolute;inset:0;opacity:0.12;font-size:15px;word-break:break-all;line-height:80px;color:#909399;pointer-events:none;'
    wm.textContent = (watermarkText || exporter || 'NEX').repeat(60)
    container.appendChild(wm)
  }

  const content = document.createElement('div')
  content.style.position = 'relative'
  content.style.zIndex = '1'

  const titleEl = document.createElement('div')
  titleEl.style.cssText = 'text-align:center;font-size:22px;font-weight:bold;color:#303133;margin-bottom:8px;'
  titleEl.textContent = title
  content.appendChild(titleEl)

  const subEl = document.createElement('div')
  subEl.style.cssText = 'text-align:center;font-size:12px;color:#909399;margin-bottom:20px;'
  const parts: string[] = []
  if (exporter) parts.push(`${i18nLabels.exporter}：${exporter}`)
  parts.push(`${i18nLabels.time}：${formatNow()}`)
  parts.push(`${i18nLabels.countPrefix} ${data.length} ${i18nLabels.countSuffix}`)
  subEl.textContent = parts.join('  |  ')
  content.appendChild(subEl)

  const table = document.createElement('table')
  table.style.cssText = 'width:100%;border-collapse:collapse;font-size:13px;color:#606266;'
  const thead = document.createElement('thead')
  const headerRow = document.createElement('tr')
  headerRow.style.background = '#f5f7fa'
  exportColumns.forEach((col) => {
    const th = document.createElement('th')
    th.style.cssText = 'border:1px solid #ebeef5;padding:10px 12px;text-align:center;font-weight:600;color:#303133;white-space:nowrap;'
    th.textContent = col.label
    headerRow.appendChild(th)
  })
  thead.appendChild(headerRow)
  table.appendChild(thead)

  const tbody = document.createElement('tbody')
  data.forEach((row, index) => {
    const tr = document.createElement('tr')
    tr.style.background = index % 2 === 0 ? '#fff' : '#fafafa'
    getRowValues(exportColumns, row).forEach((value, _colIndex) => {
      const td = document.createElement('td')
      td.style.cssText = 'border:1px solid #ebeef5;padding:8px 12px;text-align:center;word-break:break-all;'
      td.textContent = String(value)
      tr.appendChild(td)
    })
    tbody.appendChild(tr)
  })
  table.appendChild(tbody)
  content.appendChild(table)
  container.appendChild(content)
  document.body.appendChild(container)

  html2canvas(container, { scale: 2, useCORS: true }).then((canvas) => {
    const img = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0
    pdf.addImage(img, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    while (heightLeft > 0) {
      position -= pageHeight
      pdf.addPage()
      pdf.addImage(img, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    pdf.save(`${filename}.pdf`)
    showSuccess(`成功导出 ${data.length} 条数据`)
  }).catch(() => {
    showError('PDF 导出失败，请重试')
  }).finally(() => {
    document.body.removeChild(container)
  })
}

/** 统一导出入口 */
export function exportTable(options: ExportTableOptions): void {
  const {
    data,
    columns,
    title = '导出数据',
    filename = 'export',
    format = 'excel',
    selected = null,
    exporter = '',
    watermark = true,
    watermarkText = '',
    labels = {}
  } = options

  const exportData = selected && selected.length > 0 ? selected : data
  if (!exportData || !exportData.length) {
    showWarning('没有可导出的数据')
    return
  }
  const opts = { title, filename, exporter, watermark, watermarkText, labels }
  if (format === 'excel') exportExcel(exportData, columns, opts)
  else if (format === 'pdf') exportPdf(exportData, columns, opts)
  else showError('不支持的导出格式')
}

export default { exportTable, exportExcel, exportPdf }

