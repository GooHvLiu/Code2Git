<template>
  <div class="page-home-search">
    <div class="search-bar">
      <el-autocomplete clearable class="search-form" placeholder="请输入医院名称" size="large" />
      <el-button type="primary" :icon="Search" size="large">搜索</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
// import { ref, reactive, computed, watch, onMounted } from 'vue'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
</script>

<style scoped lang="less">
.page-home-search {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .search-bar {
    width: 600px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
}
</style>
