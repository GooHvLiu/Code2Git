<template>
  <el-dropdown
    split-button
    type="success"
    size="small"
    :icon="Download"
    @click="handleDefaultExport"
    @command="handleExport"
  >
    {{ buttonText }}
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="pdf" :icon="Document">
          {{ t('common.exportPdf') }}
        </el-dropdown-item>
        <el-dropdown-item command="excel" :icon="DocumentCopy">
          {{ t('common.exportExcel') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
/**
 * 导出下拉按钮（PDF / Excel）
 * 内部调用 @/utils/business/exportTable 完成纯前端导出。
 *
 * 用法：
 * <export-dropdown :data="list" :columns="cols" title="用户" filename="users"
 *   :selected="selectedRows" exporter="admin" />
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { Download, Document, DocumentCopy } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/data/date'
import { getConfig } from '@/utils/config/config'
import { showWarning } from '@/utils/ui/feedback'
import { exportTable, type ExportTableOptions } from '@/utils/business/exportTable'

defineOptions({ name: 'ExportDropdown' })

interface Props {
  /** 待导出数据 */
  data?: Record<string, unknown>[]
  /** 列定义 */
  columns?: ExportTableOptions['columns']
  /** 导出标题 */
  title?: string
  /** 文件名（自动追加时间戳） */
  filename?: string
  /** 选中行（非空时仅导出选中） */
  selected?: Record<string, unknown>[] | null
  /** 导出人署名 */
  exporter?: string
  /** 水印开关；null 时取系统配置 */
  watermark?: boolean | null
  /** 水印文字；空时取系统配置 / 导出人 */
  watermarkText?: string
  /** 默认导出格式 */
  defaultFormat?: 'pdf' | 'excel'
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  columns: () => [],
  title: '',
  filename: '',
  selected: null,
  exporter: '',
  watermark: null,
  watermarkText: '',
  defaultFormat: 'pdf'
})

const emit = defineEmits<{
  (e: 'exported', format: 'pdf' | 'excel'): void
}>()

const { t } = useI18n()

const pdfWatermarkEnabled = ref<boolean>(getConfig<boolean>('pdfWatermarkEnabled', true) as boolean)
const pdfWatermarkText = ref<string>(getConfig<string>('pdfWatermarkText', '') as string)

const buttonText = computed(() => (props.defaultFormat === 'pdf' ? t('common.exportPdf') : t('common.exportExcel')))

const hasSelected = computed(() => !!(props.selected && props.selected.length > 0))

const finalTitle = computed(() => props.title)

const finalWatermark = computed<boolean>(() => (props.watermark !== null ? props.watermark : pdfWatermarkEnabled.value))

const finalWatermarkText = computed(() => props.watermarkText || pdfWatermarkText.value || props.exporter || '')

function handlePdfWatermarkConfigChanged(event: Event): void {
  const detail = (event as CustomEvent<{ enabled?: boolean; text?: string }>).detail || {}
  if (detail.enabled !== undefined) pdfWatermarkEnabled.value = detail.enabled
  if (detail.text !== undefined) pdfWatermarkText.value = detail.text
}

function handleDefaultExport(): void {
  doExport(props.defaultFormat)
}

function handleExport(format: 'pdf' | 'excel'): void {
  doExport(format)
}

function doExport(format: 'pdf' | 'excel'): void {
  if (!props.data || props.data.length === 0) {
    showWarning(t('common.noDataToExport'))
    return
  }
  const finalFilename = props.filename
    ? `${props.filename}_${formatDate(new Date(), 'YYYYMMDD_HHmmss')}`
    : `export_${formatDate(new Date(), 'YYYYMMDD_HHmmss')}`

  exportTable({
    format,
    data: props.data,
    columns: props.columns as ExportTableOptions['columns'],
    title: finalTitle.value,
    filename: finalFilename,
    selected: hasSelected.value ? props.selected : null,
    exporter: props.exporter,
    watermark: finalWatermark.value,
    watermarkText: finalWatermarkText.value
  })
  emit('exported', format)
}

onMounted(() => {
  window.addEventListener('pdfWatermarkConfigChanged', handlePdfWatermarkConfigChanged)
})

onBeforeUnmount(() => {
  window.removeEventListener('pdfWatermarkConfigChanged', handlePdfWatermarkConfigChanged)
})
</script>
