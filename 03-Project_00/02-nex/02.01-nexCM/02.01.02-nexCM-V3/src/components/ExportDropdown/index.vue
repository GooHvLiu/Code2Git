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

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Message } from 'element-ui'
import { exportTable } from '@/utils/exportTable'
import { formatDate } from '@/utils/date'
import { getConfig } from '@/utils/config'
import { useI18n } from '@/composables/useI18n'

const { t: $t } = useI18n()

const props = defineProps({
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
})

// ===== 响应式数据 =====
// PDF 水印配置（从系统配置读取，支持实时更新）
const pdfWatermarkEnabled = ref(getConfig('pdfWatermarkEnabled', true))
const pdfWatermarkText = ref(getConfig('pdfWatermarkText', ''))

// ===== 计算属性 =====
const buttonText = computed(() => props.defaultFormat === 'pdf'
  ? $t('common.exportPdf')
  : $t('common.exportExcel'))

const hasSelected = computed(() => props.selected && props.selected.length > 0)

const finalTitle = computed(() => {
  if (hasSelected.value) {
    return `${props.title}(${$t('common.selected')})`
  }
  return props.title
})

const exportLabels = computed(() => $t('common.exportLabels') || {})

// 最终是否启用水印：优先使用 props，其次使用系统配置
const finalWatermark = computed(() => {
  if (props.watermark !== null) {
    return props.watermark
  }
  return pdfWatermarkEnabled.value
})

// 最终水印文字：优先使用 props，其次使用系统配置，最后使用导出人
const finalWatermarkText = computed(() => {
  if (props.watermarkText) {
    return props.watermarkText
  }
  if (pdfWatermarkText.value) {
    return pdfWatermarkText.value
  }
  return props.exporter || ''
})

// ===== 方法 =====
/**
 * PDF 水印配置变化时处理
 */
function handlePdfWatermarkConfigChanged(event) {
  if (event.detail?.enabled !== undefined) {
    pdfWatermarkEnabled.value = event.detail.enabled
  }
  if (event.detail?.text !== undefined) {
    pdfWatermarkText.value = event.detail.text
  }
}

function handleDefaultExport() {
  doExport(props.defaultFormat)
}

function handleExport(format) {
  doExport(format)
}

function doExport(format) {
  if (!props.data || props.data.length === 0) {
    Message.warning($t('common.noDataToExport'))
    return
  }
  // 自动添加时间戳到文件名
  const finalFilename = props.filename
    ? `${props.filename}_${formatDate(new Date(), 'YYYYMMDD_HHmmss')}`
    : `export_${formatDate(new Date(), 'YYYYMMDD_HHmmss')}`
  exportTable({
    data: props.data,
    columns: props.columns,
    title: finalTitle.value,
    filename: finalFilename,
    format,
    selected: hasSelected.value ? props.selected : null,
    exporter: props.exporter,
    watermark: finalWatermark.value,
    watermarkText: finalWatermarkText.value,
    labels: exportLabels.value
  })
}

// ===== 生命周期 =====
onMounted(() => {
  // 监听系统配置变化：PDF 水印配置改变时更新
  window.addEventListener('pdfWatermarkConfigChanged', handlePdfWatermarkConfigChanged)
})

onBeforeUnmount(() => {
  // 移除事件监听
  window.removeEventListener('pdfWatermarkConfigChanged', handlePdfWatermarkConfigChanged)
})
</script>

<style scoped lang="less">
/* 间距由父容器（如 TableToolbar 的 gap）控制，此处不设置 margin */
</style>
