<template>
  <div class="i18n-input-wrapper">
    <!-- 中文输入 -->
    <div class="i18n-input-item">
      <span class="i18n-input-label">{{ zhLabel }}</span>
      <el-input
        v-if="type === 'input'"
        :value="zhValue"
        :placeholder="zhPlaceholder"
        :disabled="disabled"
        :maxlength="maxlength"
        show-word-limit
        @input="handleZhInput"
      />
      <el-input
        v-else
        :value="zhValue"
        type="textarea"
        :placeholder="zhPlaceholder"
        :disabled="disabled"
        :rows="rows"
        :maxlength="maxlength"
        show-word-limit
        @input="handleZhInput"
      />
    </div>
    <!-- 英文输入 -->
    <div class="i18n-input-item">
      <span class="i18n-input-label">{{ enLabel }}</span>
      <el-input
        v-if="type === 'input'"
        :value="enValue"
        :placeholder="enPlaceholder"
        :disabled="disabled"
        :maxlength="maxlength"
        show-word-limit
        @input="handleEnInput"
      />
      <el-input
        v-else
        :value="enValue"
        type="textarea"
        :placeholder="enPlaceholder"
        :disabled="disabled"
        :rows="rows"
        :maxlength="maxlength"
        show-word-limit
        @input="handleEnInput"
      />
    </div>
  </div>
</template>

<script>
/**
 * 通用多语言输入组件
 * 支持中英文双输入框，v-model 绑定返回 JSON 格式的多语言对象
 * 格式：{ "zh-CN": "中文值", "en-US": "English value" }
 */
export default {
  name: 'I18nInput',
  props: {
    // v-model 值，JSON 格式的多语言对象
    value: {
      type: [Object, String],
      default: () => ({})
    },
    // 输入类型：input / textarea
    type: {
      type: String,
      default: 'input',
      validator: val => ['input', 'textarea'].includes(val)
    },
    // 中文标签
    zhLabel: {
      type: String,
      default: '中文'
    },
    // 英文标签
    enLabel: {
      type: String,
      default: 'English'
    },
    // 中文占位符
    zhPlaceholder: {
      type: String,
      default: '请输入中文'
    },
    // 英文占位符
    enPlaceholder: {
      type: String,
      default: 'Please enter English'
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 最大长度
    maxlength: {
      type: Number,
      default: 200
    },
    // textarea 行数
    rows: {
      type: Number,
      default: 2
    }
  },
  computed: {
    // 中文值
    zhValue() {
      if (typeof this.value === 'string') return this.value
      return this.value?.['zh-CN'] || ''
    },
    // 英文值
    enValue() {
      if (typeof this.value === 'string') return ''
      return this.value?.['en-US'] || ''
    }
  },
  methods: {
    // 中文输入处理
    handleZhInput(val) {
      this.updateValue(val, this.enValue)
    },
    // 英文输入处理
    handleEnInput(val) {
      this.updateValue(this.zhValue, val)
    },
    // 更新值
    updateValue(zh, en) {
      const result = {
        'zh-CN': zh || '',
        'en-US': en || zh || '' // 英文为空时默认用中文
      }
      this.$emit('input', result)
      this.$emit('change', result)
    }
  }
}
</script>

<style scoped lang="less">
.i18n-input-wrapper {
  width: 100%;

  .i18n-input-item {
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }

    .i18n-input-label {
      display: inline-block;
      font-size: 12px;
      color: #909399;
      margin-bottom: 4px;
    }
  }
}
</style>
