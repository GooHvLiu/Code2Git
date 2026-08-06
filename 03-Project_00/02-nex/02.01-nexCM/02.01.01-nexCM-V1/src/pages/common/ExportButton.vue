<template>
  <el-button :type="type" :icon="icon" :loading="loading" :size="size" @click="handleClick">
    {{ text }}
  </el-button>
</template>

<script>
export default {
  name: "ExportButton",
  props: {
    text: {
      type: String,
      default: "导出"
    },
    type: {
      type: String,
      default: "success"
    },
    icon: {
      type: String,
      default: "el-icon-download"
    },
    size: {
      type: String,
      default: "small"
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      this.$emit("click");
    }
  }
};
</script>
