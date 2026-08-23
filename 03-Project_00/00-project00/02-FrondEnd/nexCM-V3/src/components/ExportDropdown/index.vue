<template>
  <el-dropdown
    split-button
    type="success"
    size="small"
    icon="el-icon-download"
    @click="handleDefaultExport"
    @command="handleExport"
  >
    {{ buttonText }}
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="pdf" icon="el-icon-document">
        {{ $t('common.exportPdf') }}
      </el-dropdown-item>
      <el-dropdown-item command="excel" icon="el-icon-document-copy">
        {{ $t('common.exportExcel') }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { exportTable } from '@/utils/exportTable'
import { formatDate } from '@/utils/date'
import { getConfig } from '@/utils/config'

export default {
  name: 'ExportDropdown',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    filename: {
      type: String,
      default: ''
    },
    selected: {
      type: Array,
      default: null
    },
    exporter: {
      type: String,
      default: ''
    },
    watermark: {
      type: Boolean,
      default: null // 为 null 时使用系统配置
    },
    watermarkText: {
      type: String,
      default: '' // 为空时使用系统配置或当前用户名
    },
    defaultFormat: {
      type: String,
      default: 'pdf'
    }
  },
  data() {
    return {
      // PDF 水印配置（从系统配置读取，支持实时更新）
      pdfWatermarkEnabled: getConfig('pdfWatermarkEnabled', true),
      pdfWatermarkText: getConfig('pdfWatermarkText', '')
    }
  },
  created() {
    // 监听系统配置变化：PDF 水印配置改变时更新
    window.addEventListener('pdfWatermarkConfigChanged', this.handlePdfWatermarkConfigChanged)
  },
  beforeDestroy() {
    // 移除事件监听
    window.removeEventListener('pdfWatermarkConfigChanged', this.handlePdfWatermarkConfigChanged)
  },
  computed: {
    buttonText() {
      return this.defaultFormat === 'pdf'
        ? this.$t('common.exportPdf')
        : this.$t('common.exportExcel')
    },
    hasSelected() {
      return this.selected && this.selected.length > 0
    },
    finalTitle() {
      if (this.hasSelected) {
        return `${this.title}(${this.$t('common.selected')})`
      }
      return this.title
    },
    exportLabels() {
      return this.$t('common.exportLabels') || {}
    },
    // 最终是否启用水印：优先使用 props，其次使用系统配置
    finalWatermark() {
      if (this.watermark !== null) {
        return this.watermark
      }
      return this.pdfWatermarkEnabled
    },
    // 最终水印文字：优先使用 props，其次使用系统配置，最后使用导出人
    finalWatermarkText() {
      if (this.watermarkText) {
        return this.watermarkText
      }
      if (this.pdfWatermarkText) {
        return this.pdfWatermarkText
      }
      return this.exporter || ''
    }
  },
  methods: {
    /**
     * PDF 水印配置变化时处理
     */
    handlePdfWatermarkConfigChanged(event) {
      if (event.detail?.enabled !== undefined) {
        this.pdfWatermarkEnabled = event.detail.enabled
      }
      if (event.detail?.text !== undefined) {
        this.pdfWatermarkText = event.detail.text
      }
    },
    handleDefaultExport() {
      this.doExport(this.defaultFormat)
    },
    handleExport(format) {
      this.doExport(format)
    },
    doExport(format) {
      if (!this.data || this.data.length === 0) {
        this.$message.warning(this.$t('common.noDataToExport'))
        return
      }
      // 自动添加时间戳到文件名
      const finalFilename = this.filename
        ? `${this.filename}_${formatDate(new Date(), 'YYYYMMDD_HHmmss')}`
        : `export_${formatDate(new Date(), 'YYYYMMDD_HHmmss')}`
      exportTable({
        data: this.data,
        columns: this.columns,
        title: this.finalTitle,
        filename: finalFilename,
        format,
        selected: this.hasSelected ? this.selected : null,
        exporter: this.exporter,
        watermark: this.finalWatermark,
        watermarkText: this.finalWatermarkText,
        labels: this.exportLabels
      })
    }
  }
}
</script>

<style scoped lang="less">
/* 间距由父容器（如 TableToolbar 的 gap）控制，此处不设置 margin */
</style>
