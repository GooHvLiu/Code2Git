<template>
  <el-form :model="modelValue" label-width="160px" size="default" class="config-form">
    <el-row :gutter="20">
      <el-col v-for="field in schema" :key="field.key" :span="field.span || 12">
        <el-form-item>
          <template #label>
            <span>{{ field.label }}</span>
            <span v-if="field.required" style="color: #f56c6c; margin-left: 2px">*</span>
            <el-tooltip v-if="field.tip" :content="field.tip" placement="top">
              <el-icon class="label-tip"><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>

          <!-- 文本 -->
          <el-input
            v-if="field.type === 'string' || field.type === 'path'"
            v-model="modelValue[field.key]"
            :placeholder="field.placeholder || ''"
            clearable
          />

          <!-- 密码/密文（token、密钥） -->
          <el-input
            v-else-if="field.type === 'password'"
            v-model="modelValue[field.key]"
            type="password"
            show-password
            :placeholder="field.placeholder || ''"
          />

          <!-- 多行文本 -->
          <el-input
            v-else-if="field.type === 'textarea'"
            v-model="modelValue[field.key]"
            type="textarea"
            :rows="field.rows || 3"
            :placeholder="field.placeholder || ''"
          />

          <!-- 数字 -->
          <el-input-number
            v-else-if="field.type === 'number'"
            v-model="modelValue[field.key]"
            :min="field.min"
            :max="field.max"
            :step="field.step || 1"
            controls-position="right"
            style="width: 100%"
          />

          <!-- 开关 -->
          <el-switch
            v-else-if="field.type === 'boolean'"
            v-model="modelValue[field.key]"
          />

          <!-- 下拉选择 -->
          <el-select
            v-else-if="field.type === 'select'"
            v-model="modelValue[field.key]"
            :placeholder="field.placeholder || '请选择'"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="opt in normalizeOptions(field.options)"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>

          <!-- 多选 -->
          <el-select
            v-else-if="field.type === 'multiselect'"
            v-model="modelValue[field.key]"
            multiple
            collapse-tags
            :placeholder="field.placeholder || '请选择'"
            style="width: 100%"
          >
            <el-option
              v-for="opt in normalizeOptions(field.options)"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>

          <!-- 兜底：文本 -->
          <el-input v-else v-model="modelValue[field.key]" :placeholder="field.placeholder || ''" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  schema: { type: Array, default: () => [] },
  modelValue: { type: Object, required: true }
})
const emit = defineEmits(['update:modelValue'])

// 兼容 options 为字符串数组或 {label,value} 数组
function normalizeOptions(options) {
  if (!Array.isArray(options)) return []
  return options.map(o => (typeof o === 'string' ? { label: o, value: o } : o))
}

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style scoped>
.config-form {
  width: 100%;
}
</style>
