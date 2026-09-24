<template>
  <div class="page-wrap">
    <!-- 左侧为菜单栏 -->
    <div class="left-menu">
      <Menu />
    </div>
    <!-- 右侧为内容展示区 -->
    <div class="right-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名称
defineOptions({ name: "Hospital" });
// 引入 菜单 子组件
import Menu from "./menu/index.vue";

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
.page-wrap {
  display: grid;
  grid-template-columns: 1.5fr 8.5fr;
  .left-menu {
  }
  .right-content {
    background-color: orange;
  }
}
</style>
