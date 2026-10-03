<template>
  <div class="page-wrap-detail">
    <!-- 医院名称及等级 -->
    <div class="top">
      <div class="left">{{ useHospitalStore.hospitalDetailInfo?.hosname }}</div>
      <div class="right">
        <el-icon color="orange"><Opportunity /></el-icon>
        <span>{{ useHospitalStore.hospitalDetailInfo?.hostypeString }}</span>
      </div>
    </div>
    <!-- 医院 Logo + 相关详细路线指南 -->
    <div class="middle">
      <div class="left">
        <img :src="useHospitalStore.hospitalDetailInfo?.logoData" alt="医院图标" />
      </div>
      <div class="right">
        <span class="content">具体地址：{{ useHospitalStore.hospitalDetailInfo?.address }}</span>
        <span class="content">规划路线：{{ useHospitalStore.hospitalDetailInfo?.route }}</span>
      </div>
    </div>
    <!-- 医院介绍 -->
    <div class="bottom">
      <span class="title">医院介绍</span>
      <span class="content">{{ useHospitalStore.hospitalDetailInfo?.intro }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Detail" });
// 引入 Pinia Store
import { useHospitalDetailStore } from "@/stores/index";
const useHospitalStore = useHospitalDetailStore();

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
.page-wrap-detail {
  color: @color-text-regular;
  display: flex;
  flex-direction: column;

  .top {
    display: flex;
    flex-direction: row;
    align-items: center;
    .left {
      color: @color-text-primary;
      font-weight: 800;
      font-size: 1.35rem;
      margin-right: 5px;
    }
    .right {
      display: flex;
      align-items: center;
      span {
        margin-left: 5px;
      }
    }
  }
  .middle {
    margin-top: 25px;
    display: grid;
    grid-template-columns: 10% 90%;
    .left {
      img {
        width: 80px;
        height: 80px;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      gap: 10px;
      .title {
        color: @color-text-primary;
        font-weight: 800;
      }
      .content {
        line-height: 1.5rem;
        margin-left: 10px;
      }
      ul {
        li {
          margin-top: 10px;
          margin-left: 10px;
        }
      }
    }
  }
  .bottom {
    margin-top: 25px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    .title {
      color: @color-text-primary;
      font-weight: 800;
    }
    .content {
      line-height: 1.5rem;
      margin-left: 10px;
    }
  }
}
</style>
