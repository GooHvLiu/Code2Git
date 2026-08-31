<template>
  <!--
    图片上传组件
    支持单图/多图、预览、删除、上传进度
    基于 Element UI el-upload 封装，配合 utils/upload.js 校验

    用法（单图）：
    <upload-image v-model="imageUrl" upload-url="/api/upload" />

    用法（多图）：
    <upload-image v-model="imageList" upload-url="/api/upload" :multiple="true" :limit="5" />
  -->
  <div class="upload-image">
    <el-upload
      :action="uploadUrl"
      :headers="headers"
      :name="fieldName"
      :multiple="multiple"
      :limit="limit"
      :file-list="fileList"
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
      <!-- 上传中显示进度 -->
      <div v-if="uploading" class="upload-loading">
        <i class="el-icon-loading"></i>
        <span class="upload-percent">{{ uploadPercent }}%</span>
      </div>
      <!-- 已上传图片预览 -->
      <div v-else-if="displayList.length > 0" class="preview-list">
        <div
          v-for="(item, index) in displayList"
          :key="index"
          class="preview-item"
        >
          <img :src="item.url || item" class="preview-img" />
          <div class="preview-mask">
            <i class="el-icon-zoom-in" @click.stop="handlePreview(item)" />
            <i class="el-icon-delete" @click.stop="handleRemove(index)" />
          </div>
        </div>
        <!-- 未达上限时显示添加按钮 -->
        <div v-if="!multiple || displayList.length < limit" class="upload-add">
          <i class="el-icon-plus"></i>
        </div>
      </div>
      <!-- 空状态 -->
      <div v-else class="upload-empty">
        <i class="el-icon-plus"></i>
        <div class="upload-text">{{ tipText }}</div>
      </div>
    </el-upload>

    <!-- 图片预览弹窗 -->
    <el-dialog :visible.sync="previewVisible" width="auto" :append-to-body="true" class="preview-dialog">
      <img :src="previewUrl" class="preview-dialog-img" />
    </el-dialog>
  </div>
</template>

<script setup>
/* eslint-disable vue/multi-word-component-names */
import { ref, computed } from 'vue'
import { validateImage, validateFileSize } from '@/utils/upload'
import { showError, showSuccess } from '@/utils/feedback'

const props = defineProps({
  /** 绑定值（单图传字符串，多图传数组） */
  value: {
    type: [String, Array],
    default: ''
  },
  /** 上传地址 */
  uploadUrl: {
    type: String,
    required: true
  },
  /** 是否多图 */
  multiple: {
    type: Boolean,
    default: false
  },
  /** 最大上传数量 */
  limit: {
    type: Number,
    default: 9
  },
  /** 最大文件大小（MB） */
  maxSize: {
    type: Number,
    default: 5
  },
  /** 接受的文件类型 */
  accept: {
    type: String,
    default: 'image/jpeg,image/png,image/gif,image/webp'
  },
  /** 文件字段名 */
  fieldName: {
    type: String,
    default: 'file'
  },
  /** 额外请求头 */
  headers: {
    type: Object,
    default: () => ({})
  },
  /** 是否拖拽上传 */
  drag: {
    type: Boolean,
    default: false
  },
  /** 提示文字 */
  tipText: {
    type: String,
    default: '上传图片'
  },
  /** 上传成功后从响应中取图片 URL 的字段路径 */
  urlField: {
    type: String,
    default: 'data.url'
  }
})

const emit = defineEmits(['input', 'success', 'error', 'remove'])

// ===== 响应式数据 =====
/** 是否正在上传 */
const uploading = ref(false)
/** 上传进度百分比 */
const uploadPercent = ref(0)
/** 预览弹窗显示 */
const previewVisible = ref(false)
/** 预览图片地址 */
const previewUrl = ref('')

// ===== 计算属性 =====
/** 展示用的图片列表（统一转数组） */
const displayList = computed(() => {
  if (Array.isArray(props.value)) {
    return props.value.map(item => {
      return typeof item === 'string' ? { url: item } : item
    })
  }
  return props.value ? [{ url: props.value }] : []
})
/** el-upload 需要的 file-list（空数组，因为用自定义预览） */
const fileList = computed(() => [])

// ===== 方法 =====
/**
 * 上传前校验
 */
function handleBeforeUpload(file) {
  if (!validateImage(file)) return false
  const maxSizeBytes = props.maxSize * 1024 * 1024
  if (!validateFileSize(file, maxSizeBytes)) return false
  return true
}

/**
 * 上传进度
 */
function handleProgress(event) {
  uploading.value = true
  uploadPercent.value = Math.round(event.percent)
}

/**
 * 上传成功
 */
function handleSuccess(response) {
  uploading.value = false
  uploadPercent.value = 0

  const url = getNestedValue(response, props.urlField)
  if (!url) {
    showError('上传成功但未获取到图片地址')
    return
  }

  if (props.multiple) {
    const list = [...(props.value || []), url]
    emit('input', list)
  } else {
    emit('input', url)
  }
  showSuccess('上传成功')
  emit('success', response, url)
}

/**
 * 上传失败
 */
function handleError(err) {
  uploading.value = false
  uploadPercent.value = 0
  showError('上传失败，请重试')
  emit('error', err)
}

/**
 * 超出数量限制
 */
function handleExceed() {
  showError(`最多只能上传 ${props.limit} 张图片`)
}

/**
 * 删除图片
 */
function handleRemove(index) {
  if (props.multiple) {
    const list = [...props.value]
    list.splice(index, 1)
    emit('input', list)
  } else {
    emit('input', '')
  }
  emit('remove', index)
}

/**
 * 预览图片
 */
function handlePreview(item) {
  previewUrl.value = item.url || item
  previewVisible.value = true
}

/**
 * 从嵌套对象中取值，支持 'data.url' 这种路径
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => {
    return acc && acc[key] !== undefined ? acc[key] : undefined
  }, obj)
}
</script>

<style scoped lang="less">
.upload-image {
  .upload-component {
    ::v-deep .el-upload {
      border: 1px dashed @border-base;
      border-radius: @border-radius-base;
      cursor: pointer;
      overflow: hidden;
      transition: border-color @transition-duration;

      &:hover {
        border-color: @primary-color;
      }
    }

    ::v-deep .el-upload--picture-card {
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

    .el-icon-loading {
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

      i {
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

    i {
      font-size: 24px;
      margin-bottom: @spacing-xs;
    }

    .upload-text {
      font-size: @font-size-sm;
    }
  }
}

.preview-dialog {
  ::v-deep .el-dialog__body {
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
