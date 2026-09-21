<template>
  <div class="container">
    <!-- 顶部全局组件 -->
    <HospitalTop />
    <!-- 中间的内容区域 -->
    <div class="content">
      <!-- 以下为通过 router 跳转部分 -->
      <router-view></router-view>
    </div>
    <!-- 底部全局组件 -->
    <HospitalBottom />
  </div>
</template>

<script setup lang="ts">
// 引入 Axios 二次封装的工具request
import request from "@/utils/request";
// 引入 vue 中页面挂载方法
import { onMounted } from "vue";
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
onMounted(() => {
  request
    .get("/hosp/hospital/findHospitalPage/1/10")
    .then((res) => {
      console.log("app组件展示获取的数据:", res);
    })
    .catch((err) => {
      console.error("请求失败：", err);
    });
});
</script>

<style scoped lang="less">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  .content {
    width: 1200px;
    margin-top: 70px;
    min-height: 700px;
  }
  .bottom {
    width: 1200px;
    height: 70px;
    background-color: orchid;
  }
}
</style>
