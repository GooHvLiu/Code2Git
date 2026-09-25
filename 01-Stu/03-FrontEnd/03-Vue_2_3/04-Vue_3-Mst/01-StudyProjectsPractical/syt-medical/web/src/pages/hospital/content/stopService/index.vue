<template>
  <div class="page-wrap">
    <!-- 停诊信息的标题 -->
    <div class="title">
      <div>{{ useStore.hospitalDetailInfo?.hosname }}停诊信息</div>
    </div>
    <!-- 停诊信息的内容 -->
    <div class="content">
      <el-empty description="暂无信息" />
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "StopService" });
// 引入 Pinia Store
import { useHospitalDetailStore } from "@/stores/index";
const useStore = useHospitalDetailStore();

// import { ref, reactive, computed, watch, onMounted } from 'vue'

// import { useRouter } from 'vue-router'

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
  color: #717171;
  display: flex;
  flex-direction: column;
  gap: 15px;
  .title {
    display: flex;
    justify-content: center;
    font-weight: 800;
    font-size: 1.35rem;
    margin-right: 5px;
  }
}
</style>
