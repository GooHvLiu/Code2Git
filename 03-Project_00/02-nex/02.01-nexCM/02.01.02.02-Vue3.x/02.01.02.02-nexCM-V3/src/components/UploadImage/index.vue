<template>
  <!--
    图片上传组件（单图 / 多图、预览、删除、进度）
    单图：<upload-image v-model="imageUrl" upload-url="/api/upload" />
    多图：<upload-image v-model="imageList" upload-url="/api/upload" multiple :limit="5" />
  -->
  <div class="upload-image">
    <el-upload
      :action="uploadUrl"
      :headers="headers"
      :name="fieldName"
      :multiple="multiple"
      :limit="limit"
      :file-list="[]"
      :show-file-list="false"
      :before-upload="handleBeforeUpload"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-exceed="handleExceed"
      :accept="accept"
      :drag="drag"
      list-type="picture-card"
      class="upload-component"
    >
      <!-- 上传中 -->
      <div v-if="uploading" class="upload-loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span class="upload-percent">{{ uploadPercent }}%</span>
      </div>
      <!-- 已上传预览 -->
      <div v-else-if="displayList.length > 0" class="preview-list">
        <div v-for="(item, index) in displayList" :key="index" class="preview-item">
          <img :src="item.url" class="preview-img" />
          <div class="preview-mask">
            <el-icon @click.stop="handlePreview(item)"><ZoomIn /></el-icon>
            <el-icon @click.stop="handleRemove(index)"><Delete /></el-icon>
          </div>
        </div>
        <div v-if="!multiple || displayList.length < limit" class="upload-add">
          <el-icon><Plus /></el-icon>
        </div>
      </div>
      <!-- 空状态 -->
      <div v-else class="upload-empty">
        <el-icon><Plus /></el-icon>
        <div class="upload-text">{{ tipText || t('common.upload.tip') }}</div>
      </div>
    </el-upload>

    <!-- 图片预览弹窗 -->
    <el-dialog v-model="previewVisible" width="auto" :append-to-body="true" class="preview-dialog">
      <img :src="previewUrl" class="preview-dialog-img" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 图片上传组件
 * v-model 单图传字符串，多图传 string[]。
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Loading, ZoomIn, Delete, Plus } from '@element-plus/icons-vue'
import type { UploadFile, UploadRawFile } from 'element-plus'
import { showError, showSuccess } from '@/utils/ui/feedback'

defineOptions({ name: 'UploadImage' })

interface Props {
  /** 绑定值（单图 string / 多图 string[]） */
  modelValue?: string | string[]
  /** 上传地址 */
  uploadUrl: string
  /** 是否多图 */
  multiple?: boolean
  /** 最大上传数量 */
  limit?: number
  /** 最大文件大小（MB） */
  maxSize?: number
  /** 接受的文件类型 */
  accept?: string
  /** 文件字段名 */
  fieldName?: string
  /** 额外请求头 */
  headers?: Record<string, string>
  /** 是否拖拽上传 */
  drag?: boolean
  /** 提示文字 */
  tipText?: string
  /** 上传成功后从响应中取图片 URL 的字段路径 */
  urlField?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => '',
  multiple: false,
  limit: 9,
  maxSize: 5,
  accept: 'image/jpeg,image/png,image/gif,image/webp',
  fieldName: 'file',
  headers: () => ({}),
  drag: false,
  tipText: '',
  urlField: 'data.url'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[]): void
  (e: 'success', response: Record<string, unknown>, url: string): void
  (e: 'error', err: unknown): void
  (e: 'remove', index: number): void
}>()

const { t } = useI18n()

const uploading = ref(false)
const uploadPercent = ref(0)
const previewVisible = ref(false)
const previewUrl = ref('')

interface PreviewItem {
  url: string
  [key: string]: unknown
}

const displayList = computed<PreviewItem[]>(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.map(item => (typeof item === 'string' ? { url: item } : (item as unknown as PreviewItem)))
  }
  return props.modelValue ? [{ url: props.modelValue }] : []
})

/** 上传前类型校验（内联，替代 @/utils/business/upload） */
function validateImage(file: File): boolean {
  const type = (file.type || '').toLowerCase()
  if (!type.startsWith('image/')) {
    showError(t('common.upload.typeInvalid'))
    return false
  }
  return true
}

/** 上传前大小校验 */
function validateFileSize(file: File, maxSizeBytes: number): boolean {
  const size = file.size || 0
  if (size > maxSizeBytes) {
    showError(t('common.upload.sizeExceed', { size: props.maxSize }))
    return false
  }
  return true
}

function handleBeforeUpload(file: UploadRawFile): boolean {
  if (!validateImage(file)) return false
  const maxSizeBytes = props.maxSize * 1024 * 1024
  if (!validateFileSize(file, maxSizeBytes)) return false
  return true
}

function handleProgress(event: { percent?: number }): void {
  uploading.value = true
  uploadPercent.value = Math.round(event.percent || 0)
}

function handleSuccess(response: Record<string, unknown>): void {
  uploading.value = false
  uploadPercent.value = 0

  const url = getNestedValue(response, props.urlField)
  if (!url) {
    showError(t('common.upload.noUrl'))
    return
  }

  if (props.multiple) {
    const list = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    emit('update:modelValue', [...list, url])
  } else {
    emit('update:modelValue', url)
  }
  showSuccess(t('common.upload.success'))
  emit('success', response, url)
}

function handleError(err: unknown): void {
  uploading.value = false
  uploadPercent.value = 0
  showError(t('common.upload.failed'))
  emit('error', err)
}

function handleExceed(): void {
  showError(t('common.upload.exceed', { count: props.limit }))
}

function handleRemove(index: number): void {
  if (props.multiple && Array.isArray(props.modelValue)) {
    const list = [...props.modelValue]
    list.splice(index, 1)
    emit('update:modelValue', list)
  } else {
    emit('update:modelValue', '')
  }
  emit('remove', index)
}

function handlePreview(item: PreviewItem): void {
  previewUrl.value = item.url
  previewVisible.value = true
}

/** 从嵌套对象按 'a.b.c' 路径取值 */
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split('.').reduce<unknown>((acc, key) => {
    return acc && (acc as Record<string, unknown>)[key] !== undefined
      ? (acc as Record<string, unknown>)[key]
      : undefined
  }, obj) as string
}
</script>

<style scoped lang="less">
.upload-image {
  .upload-component {
    :deep(.el-upload) {
      border: 1px dashed @border-base;
      border-radius: @border-radius-base;
      cursor: pointer;
      overflow: hidden;
      transition: border-color @transition-duration;

      &:hover {
        border-color: @primary-color;
      }
    }

    :deep(.el-upload--picture-card) {
      width: 100px;
      height: 100px;
      line-height: normal;
    }
  }

  .upload-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: @primary-color;

    .el-icon {
      font-size: 24px;
      margin-bottom: @spacing-xs;
    }

    .upload-percent {
      font-size: @font-size-sm;
    }
  }

  .preview-list {
    display: flex;
    flex-wrap: wrap;
    gap: @spacing-sm;
  }

  .preview-item {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: @border-radius-base;
    overflow: hidden;

    .preview-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .preview-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: @spacing-lg;
      opacity: 0;
      transition: opacity @transition-duration;

      .el-icon {
        font-size: 18px;
        color: #fff;
        cursor: pointer;

        &:hover {
          color: @primary-color;
        }
      }
    }

    &:hover .preview-mask {
      opacity: 1;
    }
  }

  .upload-add {
    width: 100px;
    height: 100px;
    border: 1px dashed @border-base;
    border-radius: @border-radius-base;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: @text-placeholder;
    cursor: pointer;
    transition: all @transition-duration;

    &:hover {
      border-color: @primary-color;
      color: @primary-color;
    }
  }

  .upload-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: @text-placeholder;

    .el-icon {
      font-size: 24px;
      margin-bottom: @spacing-xs;
    }

    .upload-text {
      font-size: @font-size-sm;
    }
  }
}

.preview-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
    text-align: center;
  }

  .preview-dialog-img {
    max-width: 80vw;
    max-height: 80vh;
    display: block;
  }
}
</style>
