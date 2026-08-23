/**
 * ==========================================
 * 文件导出/下载工具
 * ==========================================
 * 统一处理文件下载、导出 Excel、导出 CSV 等场景
 *
 * 用法：
 * import { downloadFile, exportExcel, exportCsv } from '@/utils/export'
 * downloadFile('/api/export', { type: 'excel' }, '数据.xlsx')
 */
import request from './request'
import { showError, showSuccess } from './message'

/**
 * 下载文件（通过后端接口）
 * @param {String} url 下载地址
 * @param {Object} params 请求参数
 * @param {String} filename 下载后的文件名（含扩展名）
 * @param {String} method 请求方式，默认 get
 * @returns {Promise}
 */
export async function downloadFile(url, params = {}, filename = '', method = 'get') {
  try {
    const response = await request({
      url,
      method,
      params: method === 'get' ? params : undefined,
      data: method === 'post' ? params : undefined,
      responseType: 'blob'
    })

    // 处理 blob 响应
    const blob = response instanceof Blob ? response : new Blob([response])

    // 从响应头中取文件名（如果后端设置了 Content-Disposition）
    if (!filename && response.headers) {
      const disposition = response.headers['content-disposition']
      if (disposition) {
        const match = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';\s]+)/i)
        if (match) {
          filename = decodeURIComponent(match[1])
        }
      }
    }

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || `download_${Date.now()}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    showSuccess('下载成功')
    return true
  } catch (error) {
    // 如果返回的是 JSON 错误信息，解析并提示
    if (error?.data instanceof Blob) {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const result = JSON.parse(reader.result)
          showError(result.msg || '下载失败')
        } catch {
          showError('下载失败')
        }
      }
      reader.readAsText(error.data)
    } else {
      showError('下载失败')
    }
    return false
  }
}

/**
 * 导出 Excel（封装 downloadFile）
 * @param {String} url 导出接口地址
 * @param {Object} params 导出参数
 * @param {String} filename 文件名（不含扩展名，自动加 .xlsx）
 * @returns {Promise}
 */
export function exportExcel(url, params = {}, filename = '导出数据') {
  return downloadFile(url, params, `${filename}.xlsx`, 'post')
}

/**
 * 导出 CSV（前端纯前端生成，不需要后端）
 * @param {Array} data 数据数组，如 [{name:'张三',age:18}]
 * @param {Array} columns 列配置，如 [{label:'姓名',prop:'name'},{label:'年龄',prop:'age'}]
 * @param {String} filename 文件名（不含扩展名）
 */
export function exportCsv(data, columns, filename = '导出数据') {
  if (!Array.isArray(data) || data.length === 0) {
    showError('没有可导出的数据')
    return
  }

  // 生成 CSV 内容
  const headers = columns.map(col => `"${col.label}"`).join(',')
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col.prop] ?? ''
      // 处理逗号、引号、换行
      return `"${String(value).replace(/"/g, '""')}"`
    }).join(',')
  })

  // 加 BOM 头，解决 Excel 打开中文乱码
  const csvContent = '\uFEFF' + [headers, ...rows].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)

  showSuccess('导出成功')
}

/**
 * 打印页面内容
 * @param {String} content HTML 内容或 DOM 选择器
 * @param {String} title 打印标题
 */
export function printContent(content, title = '') {
  const printWindow = window.open('', '_blank', 'width=800,height=600')
  if (!printWindow) {
    showError('请允许弹出窗口以进行打印')
    return
  }

  // 如果是选择器，取 DOM 内容
  let html = content
  if (typeof content === 'string' && content.startsWith('#')) {
    const el = document.querySelector(content)
    html = el ? el.innerHTML : content
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>${html}</body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
}
