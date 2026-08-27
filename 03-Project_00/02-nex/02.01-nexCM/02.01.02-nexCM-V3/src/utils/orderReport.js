/**
 * ==========================================
 * 订单生产报告 PDF 生成工具
 * ==========================================
 * 基于 html2canvas + jsPDF 生成专业的订单生产报告
 * 支持根据系统配置动态包含/排除报告内容
 *
 * 用法：
 * import { generateOrderReport } from '@/utils/orderReport'
 * await generateOrderReport(order, config, t)
 */

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { showSuccess, showError } from './message'

/**
 * 生成水印层
 */
function createWatermarkLayer(text) {
  const layer = document.createElement('div')
  layer.style.position = 'absolute'
  layer.style.top = '0'
  layer.style.left = '0'
  layer.style.width = '100%'
  layer.style.height = '100%'
  layer.style.overflow = 'hidden'
  layer.style.pointerEvents = 'none'
  layer.style.zIndex = '10'

  const cols = 5
  const rows = 14
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const item = document.createElement('div')
      item.style.position = 'absolute'
      item.style.left = `${c * 20 + 2}%`
      item.style.top = `${r * 7 + 2}%`
      item.style.fontSize = '14px'
      item.style.color = '#909399'
      item.style.opacity = '0.1'
      item.style.transform = 'rotate(-30deg)'
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
 * 生成模拟报警明细数据
 */
function generateMockAlarms(order) {
  const alarmTemplates = [
    { code: 'E001', desc: '灌装轴位置异常', level: '严重' },
    { code: 'W002', desc: '真空度偏低预警', level: '警告' },
    { code: 'E003', desc: '加塞压力异常', level: '严重' },
    { code: 'W004', desc: '灌装温度波动', level: '警告' },
    { code: 'I005', desc: '设备启动自检', level: '信息' }
  ]
  const count = order.alarmCount || 0
  const alarms = []
  for (let i = 0; i < count; i++) {
    const tpl = alarmTemplates[i % alarmTemplates.length]
    alarms.push({
      time: `${order.startTime?.split(' ')[0] || '2026-08-25'} ${String(8 + i).padStart(2, '0')}:${String(i * 7 % 60).padStart(2, '0')}:00`,
      code: tpl.code,
      desc: tpl.desc,
      level: tpl.level,
      status: i < count - 1 ? '已处理' : '处理中'
    })
  }
  return alarms
}

/**
 * 生成模拟操作人员明细
 */
function generateMockOperators(order) {
  return [
    { name: order.operator || '张三', action: '订单开始', time: order.startTime || '--' },
    { name: order.operator || '张三', action: '参数确认', time: order.startTime || '--' },
    { name: '李四', action: '交接班', time: `${order.startTime?.split(' ')[0] || '2026-08-25'} 12:00:00` },
    { name: '李四', action: '订单完成确认', time: order.endTime || '--' }
  ]
}

/**
 * 生成订单报告 PDF
 * @param {Object} order 订单数据
 * @param {Object} config 配置 { exporter, watermark, watermarkText, includeAlarmDetail, includeOperatorDetail, includeDownloadCount }
 * @param {Function} t 国际化翻译函数
 */
export function generateOrderReport(order, config = {}, t = (key) => key) {
  return new Promise((resolve, reject) => {
    // 外层容器（隐藏在视口外）— 声明在 try 外，确保 catch 中可访问
    let outer = null
    try {
      const {
        exporter = 'admin',
        watermark = true,
        watermarkText = '',
        includeAlarmDetail = true,
        includeOperatorDetail = true,
        includeDownloadCount = true
      } = config

      outer = document.createElement('div')
      outer.style.position = 'fixed'
      outer.style.left = '-9999px'
      outer.style.top = '0'
      outer.style.zIndex = '-1'

      // 内层报告容器（A4 比例）
      const container = document.createElement('div')
      container.style.position = 'relative'
      container.style.width = '1100px'
      container.style.minHeight = '1556px'
      container.style.background = '#fff'
      container.style.padding = '40px 35px'
      container.style.boxSizing = 'border-box'
      container.style.fontFamily = '"Microsoft YaHei", "PingFang SC", Arial, sans-serif'
      container.style.color = '#303133'

      // 水印层
      if (watermark) {
        const wmText = watermarkText || exporter || 'NEX'
        container.appendChild(createWatermarkLayer(wmText))
      }

      // 内容层
      const content = document.createElement('div')
      content.style.position = 'relative'
      content.style.zIndex = '1'

      // ===== 报告标题 =====
      const titleSection = document.createElement('div')
      titleSection.style.textAlign = 'center'
      titleSection.style.marginBottom = '25px'
      titleSection.style.paddingBottom = '20px'
      titleSection.style.borderBottom = '2px solid #409eff'

      const title = document.createElement('h1')
      title.style.fontSize = '26px'
      title.style.fontWeight = 'bold'
      title.style.color = '#303133'
      title.style.margin = '0 0 8px 0'
      title.textContent = t('order.orderReport') || '订单生产报告'
      titleSection.appendChild(title)

      const subtitle = document.createElement('div')
      subtitle.style.fontSize = '13px'
      subtitle.style.color = '#909399'
      const now = new Date()
      const pad = n => String(n).padStart(2, '0')
      const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
      subtitle.textContent = `${t('order.reportGeneratedBy') || '报告生成人'}：${exporter}  |  ${t('order.reportGeneratedAt') || '报告生成时间'}：${timeStr}  |  ${t('order.orderNo') || '订单编号'}：${order.orderNo}`
      titleSection.appendChild(subtitle)

      content.appendChild(titleSection)

      // ===== 基本信息区域 =====
      const basicSection = document.createElement('div')
      basicSection.style.marginBottom = '25px'

      const basicTitle = document.createElement('div')
      basicTitle.style.fontSize = '16px'
      basicTitle.style.fontWeight = '600'
      basicTitle.style.color = '#409eff'
      basicTitle.style.marginBottom = '12px'
      basicTitle.style.paddingLeft = '10px'
      basicTitle.style.borderLeft = '3px solid #409eff'
      basicTitle.textContent = t('order.reportBasicInfo') || '基本信息'
      basicSection.appendChild(basicTitle)

      const basicTable = document.createElement('table')
      basicTable.style.width = '100%'
      basicTable.style.borderCollapse = 'collapse'
      basicTable.style.fontSize = '13px'

      const basicData = [
        [t('order.orderNo') || '订单编号', order.orderNo, t('order.productName') || '产品名称', order.productName],
        [t('order.recipeName') || '配方', order.recipeName, t('order.batchNo') || '批次号', order.batchNo],
        [t('order.operator') || '操作人员', order.operator || '--', t('order.status') || '订单状态', order.status === 'completed' ? (t('order.statusCompleted') || '已完成') : order.status === 'running' ? (t('order.statusRunning') || '生产中') : (t('order.statusPlanned') || '待生产')],
        [t('order.startTime') || '开始时间', order.startTime || '--', t('order.endTime') || '结束时间', order.endTime || order.estimatedEnd || '--']
      ]

      basicData.forEach(row => {
        const tr = document.createElement('tr')
        row.forEach((cell, i) => {
          const td = document.createElement('td')
          td.style.border = '1px solid #ebeef5'
          td.style.padding = '10px 14px'
          if (i % 2 === 0) {
            td.style.background = '#f5f7fa'
            td.style.fontWeight = '600'
            td.style.color = '#606266'
            td.style.width = '15%'
          } else {
            td.style.color = '#303133'
            td.style.width = '35%'
          }
          td.textContent = cell
          tr.appendChild(td)
        })
        basicTable.appendChild(tr)
      })
      basicSection.appendChild(basicTable)
      content.appendChild(basicSection)

      // ===== 生产统计区域 =====
      const prodSection = document.createElement('div')
      prodSection.style.marginBottom = '25px'

      const prodTitle = document.createElement('div')
      prodTitle.style.fontSize = '16px'
      prodTitle.style.fontWeight = '600'
      prodTitle.style.color = '#409eff'
      prodTitle.style.marginBottom = '12px'
      prodTitle.style.paddingLeft = '10px'
      prodTitle.style.borderLeft = '3px solid #409eff'
      prodTitle.textContent = t('order.reportProductionStats') || '生产统计'
      prodSection.appendChild(prodTitle)

      const prodGrid = document.createElement('div')
      prodGrid.style.display = 'grid'
      prodGrid.style.gridTemplateColumns = 'repeat(4, 1fr)'
      prodGrid.style.gap = '12px'

      const prodStats = [
        { label: t('order.targetQty') || '目标数量', value: order.targetQty, unit: '瓶', color: '#909399' },
        { label: t('order.completedQty') || '完成数量', value: order.completedQty, unit: '瓶', color: '#409eff' },
        { label: t('order.qualifiedQty') || '合格数量', value: order.qualifiedQty, unit: '瓶', color: '#67c23a' },
        { label: t('order.unqualifiedQty') || '不合格数量', value: order.unqualifiedQty, unit: '瓶', color: '#f56c6c' },
        { label: t('order.qualifiedRate') || '合格率', value: order.qualifiedRate + '%', unit: '', color: '#67c23a' },
        { label: t('order.runtime') || '运行时长', value: order.runtime ? order.runtime + 'h' : '--', unit: '', color: '#e6a23c' },
        { label: t('order.alarmCount') || '报警次数', value: order.alarmCount, unit: '次', color: order.alarmCount > 0 ? '#f56c6c' : '#909399' },
        { label: t('order.downloadCount') || '已下载次数', value: includeDownloadCount ? (order.downloadCount || 0) : '--', unit: '次', color: '#909399' }
      ]

      prodStats.forEach(stat => {
        const card = document.createElement('div')
        card.style.background = '#fafbfc'
        card.style.border = '1px solid #ebeef5'
        card.style.borderRadius = '6px'
        card.style.padding = '14px'
        card.style.textAlign = 'center'

        const val = document.createElement('div')
        val.style.fontSize = '20px'
        val.style.fontWeight = '700'
        val.style.color = stat.color
        val.style.marginBottom = '4px'
        val.textContent = stat.value + (stat.unit ? ' ' + stat.unit : '')
        card.appendChild(val)

        const lbl = document.createElement('div')
        lbl.style.fontSize = '12px'
        lbl.style.color = '#909399'
        lbl.textContent = stat.label
        card.appendChild(lbl)

        prodGrid.appendChild(card)
      })
      prodSection.appendChild(prodGrid)
      content.appendChild(prodSection)

      // ===== 报警明细（可选） =====
      if (includeAlarmDetail && order.alarmCount > 0) {
        const alarmSection = document.createElement('div')
        alarmSection.style.marginBottom = '25px'

        const alarmTitle = document.createElement('div')
        alarmTitle.style.fontSize = '16px'
        alarmTitle.style.fontWeight = '600'
        alarmTitle.style.color = '#f56c6c'
        alarmTitle.style.marginBottom = '12px'
        alarmTitle.style.paddingLeft = '10px'
        alarmTitle.style.borderLeft = '3px solid #f56c6c'
        alarmTitle.textContent = t('order.reportAlarmDetail') || '报警明细'
        alarmSection.appendChild(alarmTitle)

        const alarmTable = document.createElement('table')
        alarmTable.style.width = '100%'
        alarmTable.style.borderCollapse = 'collapse'
        alarmTable.style.fontSize = '12px'

        const alarmHeader = document.createElement('tr')
        alarmHeader.style.background = '#fef0f0'
        ;['时间', '报警代码', '报警描述', '级别', '状态'].forEach(h => {
          const th = document.createElement('th')
          th.style.border = '1px solid #fbc4c4'
          th.style.padding = '8px 10px'
          th.style.fontWeight = '600'
          th.style.color = '#f56c6c'
          th.textContent = h
          alarmHeader.appendChild(th)
        })
        alarmTable.appendChild(alarmHeader)

        const alarms = generateMockAlarms(order)
        alarms.forEach((alarm, i) => {
          const tr = document.createElement('tr')
          tr.style.background = i % 2 === 0 ? '#fff' : '#fef9f9'
          ;[alarm.time, alarm.code, alarm.desc, alarm.level, alarm.status].forEach(cell => {
            const td = document.createElement('td')
            td.style.border = '1px solid #fde2e2'
            td.style.padding = '7px 10px'
            td.style.textAlign = 'center'
            td.style.color = '#606266'
            if (cell === '严重') td.style.color = '#f56c6c'
            if (cell === '警告') td.style.color = '#e6a23c'
            if (cell === '已处理') td.style.color = '#67c23a'
            td.textContent = cell
            tr.appendChild(td)
          })
          alarmTable.appendChild(tr)
        })
        alarmSection.appendChild(alarmTable)
        content.appendChild(alarmSection)
      }

      // ===== 操作人员明细（可选） =====
      if (includeOperatorDetail) {
        const opSection = document.createElement('div')
        opSection.style.marginBottom = '25px'

        const opTitle = document.createElement('div')
        opTitle.style.fontSize = '16px'
        opTitle.style.fontWeight = '600'
        opTitle.style.color = '#67c23a'
        opTitle.style.marginBottom = '12px'
        opTitle.style.paddingLeft = '10px'
        opTitle.style.borderLeft = '3px solid #67c23a'
        opTitle.textContent = t('order.reportOperatorDetail') || '操作人员明细'
        opSection.appendChild(opTitle)

        const opTable = document.createElement('table')
        opTable.style.width = '100%'
        opTable.style.borderCollapse = 'collapse'
        opTable.style.fontSize = '12px'

        const opHeader = document.createElement('tr')
        opHeader.style.background = '#f0f9eb'
        ;['操作人员', '操作内容', '操作时间'].forEach(h => {
          const th = document.createElement('th')
          th.style.border = '1px solid #c2e7b0'
          th.style.padding = '8px 10px'
          th.style.fontWeight = '600'
          th.style.color = '#67c23a'
          th.textContent = h
          opHeader.appendChild(th)
        })
        opTable.appendChild(opHeader)

        const operators = generateMockOperators(order)
        operators.forEach((op, i) => {
          const tr = document.createElement('tr')
          tr.style.background = i % 2 === 0 ? '#fff' : '#f7faef'
          ;[op.name, op.action, op.time].forEach(cell => {
            const td = document.createElement('td')
            td.style.border = '1px solid #e1f3d8'
            td.style.padding = '7px 10px'
            td.style.textAlign = 'center'
            td.style.color = '#606266'
            td.textContent = cell
            tr.appendChild(td)
          })
          opTable.appendChild(tr)
        })
        opSection.appendChild(opTable)
        content.appendChild(opSection)
      }

      // ===== 页脚 =====
      const footer = document.createElement('div')
      footer.style.marginTop = '40px'
      footer.style.paddingTop = '15px'
      footer.style.borderTop = '1px solid #ebeef5'
      footer.style.textAlign = 'center'
      footer.style.fontSize = '11px'
      footer.style.color = '#c0c4cc'
      footer.textContent = '本报告由 nexCM 设备管理系统自动生成 · 数据仅供参考'
      content.appendChild(footer)

      container.appendChild(content)
      outer.appendChild(container)
      document.body.appendChild(outer)

      // 生成 PDF
      html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      }).then(canvas => {
        try {
          // 清理 DOM
          if (outer.parentNode) {
            document.body.removeChild(outer)
          }

          const imgData = canvas.toDataURL('image/png')
          const imgWidth = 210 // A4 宽度（mm）
          const pageHeight = 297 // A4 高度（mm）
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          let heightLeft = imgHeight
          let position = 0

          const pdf = new jsPDF('p', 'mm', 'a4')
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight

          while (heightLeft > 0) {
            position = heightLeft - imgHeight
            pdf.addPage()
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight
          }

          const filename = `${t('order.orderReport') || '订单生产报告'}_${order.orderNo}.pdf`
          pdf.save(filename)
          showSuccess(`${order.orderNo} 报告生成成功`)
          resolve()
        } catch (innerErr) {
          // eslint-disable-next-line no-console
          console.error('[订单报告] PDF生成阶段异常:', innerErr)
          if (outer.parentNode) {
            document.body.removeChild(outer)
          }
          showError('订单报告生成失败')
          reject(innerErr)
        }
      }).catch(err => {
        // eslint-disable-next-line no-console
        console.error('[订单报告] html2canvas渲染失败:', err)
        if (outer.parentNode) {
          document.body.removeChild(outer)
        }
        showError('订单报告生成失败')
        reject(err)
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[订单报告] 初始化阶段异常:', err)
      // 清理可能已添加的 DOM
      if (outer && outer.parentNode) {
        document.body.removeChild(outer)
      }
      showError('订单报告生成异常')
      reject(err)
    }
  })
}

export default { generateOrderReport }
