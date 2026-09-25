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
// 引入路由和路由器
import { useRoute } from "vue-router";
const route = useRoute();

// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { onMounted } from "vue";
// 引入 Pinia Store
import { useHospitalDetailStore } from "@/stores/index.ts";
const useStore = useHospitalDetailStore();

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
onMounted(() => {
  // 获取当前网址中的 query 中的  hoscode 参数
  const hoscode = route.query.hoscode as string;
  // 页面挂载后即可获取 Store 数据
  useStore.getHospitalDetailInfo(hoscode);
});
</script>

<style scoped lang="less">
.page-wrap {
  display: grid;
  grid-template-columns: 1.5fr 8.5fr;
}
</style>
