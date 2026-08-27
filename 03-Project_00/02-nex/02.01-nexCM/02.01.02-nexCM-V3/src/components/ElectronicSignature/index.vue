<template>
  <el-dialog
    :title="$t('common.electronicSignature')"
    :visible.sync="dialogVisible"
    width="480px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item :label="$t('common.operation')">
        <span>{{ operationDesc }}</span>
      </el-form-item>
      <el-form-item :label="$t('common.operator')">
        <span>{{ userName }}</span>
      </el-form-item>
      <el-form-item :label="$t('common.reason')" prop="reason">
        <el-input
          v-model="form.reason"
          type="textarea"
          :rows="3"
          :placeholder="$t('common.reasonPlaceholder')"
          maxlength="200"
          show-word-limit
          class="es-textarea"
        />
      </el-form-item>
      <el-form-item :label="$t('common.password')" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          :placeholder="$t('common.passwordPlaceholder')"
          show-password
          @keyup.enter.native="handleConfirm"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="loading" @click="handleConfirm">
        {{ $t('common.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup>
/**
 * 电子签名弹窗组件
 * GMP 21CFR Part 11 合规：关键操作需密码验证 + 操作原因
 *
 * 使用方法：
 *   <electronic-signature ref="esDialog" @confirm="handleWrite" />
 *
 *   esDialogRef.value.open({
 *     operation: '修改灌装体积',
 *     userName: 'admin',
 *     extraData: { tag: 'fillVolume', value: 150 }
 *   })
 *
 *   handleWrite({ password, reason, extraData }) { ... }
 */
import { ref, reactive, computed, nextTick } from 'vue'
import { Message } from 'element-ui'
import { useI18n } from '@/composables/useI18n'

const { t: $t } = useI18n()

const emit = defineEmits(['confirm'])

// ===== 响应式数据 =====
const dialogVisible = ref(false)
const loading = ref(false)
const formRef = ref(null)
const form = reactive({
  reason: '',
  password: ''
})
const operationDesc = ref('')
const userName = ref('')
const extraData = ref(null)

// ===== 计算属性 =====
/** 表单校验规则（与项目其他组件统一：computed + $t()） */
const rules = computed(() => ({
  reason: [
    { required: true, message: $t('common.reasonRequired'), trigger: 'blur' },
    { min: 2, message: $t('common.reasonMinLength'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: $t('common.passwordRequired'), trigger: 'blur' }
  ]
}))

// ===== 方法 =====
/**
 * 打开电子签名弹窗
 * @param {Object} options
 * @param {string} options.operation - 操作描述
 * @param {string} options.userName - 操作人
 * @param {Object} options.extraData - 额外数据，确认后原样返回
 */
function open(options = {}) {
  operationDesc.value = options.operation || ''
  userName.value = options.userName || ''
  extraData.value = options.extraData || null
  form.reason = ''
  form.password = ''
  dialogVisible.value = true
  nextTick(() => {
    formRef.value && formRef.value.clearValidate()
  })
}

/** 确认 */
function handleConfirm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      emit('confirm', {
        password: form.password,
        reason: form.reason.trim(),
        extraData: extraData.value
      })
    } catch (err) {
      Message.error(err.message || '操作失败')
    } finally {
      loading.value = false
    }
  })
}

/** 关闭 */
function handleClose() {
  dialogVisible.value = false
  form.reason = ''
  form.password = ''
  extraData.value = null
}

/** 外部调用关闭 */
function close() {
  dialogVisible.value = false
}

// 暴露方法给父组件
defineExpose({ open, close })
</script>

<style scoped lang="less">
/deep/ .el-dialog__body {
  padding-top: 10px;
}

/* 固定 textarea 高度，禁止拖拽调整大小，内容过多时显示滚动条 */
.es-textarea /deep/ .el-textarea__inner {
  resize: none;
  min-height: 80px !important;
  max-height: 80px !important;
  overflow-y: auto;
}
</style>
