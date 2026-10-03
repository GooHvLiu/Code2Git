<template>
  <div class="page-wrap">
    <!-- 医院名称及等级 -->
    <div class="top">
      <div class="left">{{ useDetailStore.hospitalDetailInfo?.hosname }}</div>
      <div class="right">
        <el-icon color="orange"><Opportunity /></el-icon>
        <span>{{ useDetailStore.hospitalDetailInfo?.hostypeString }}</span>
      </div>
    </div>
    <!-- 医院 Logo + 相关详细路线指南和预约规则 -->
    <div class="bottom">
      <div class="left">
        <img :src="useDetailStore.hospitalDetailInfo?.logoData" alt="医院图标" />
      </div>
      <div class="right">
        <span class="title">挂号规则</span>
        <span class="content"
          >预约周期：{{ useDetailStore.hospitalDetailInfo?.bookingRule.cycle }}天 放号时间：{{
            useDetailStore.hospitalDetailInfo?.bookingRule.releaseTime
          }}
          停挂时间：{{ useDetailStore.hospitalDetailInfo?.bookingRule.stopTime }}</span
        >
        <span class="content">具体地址：{{ useDetailStore.hospitalDetailInfo?.address }}</span>
        <span class="content">规划路线：{{ useDetailStore.hospitalDetailInfo?.route }}</span>
        <span class="content"
          >退号时间：就诊前一工作日{{ useDetailStore.hospitalDetailInfo?.bookingRule.quitTime }}前取消</span
        >
        <span class="title">预约规则</span>
        <ul>
          <li v-for="(value, index) in useDetailStore.hospitalDetailInfo?.bookingRule.rule" :key="index">
            {{ value }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "HospitalInfoShow" });

// import { ref, reactive, computed, watch, onMounted } from 'vue'

// import { useRouter } from 'vue-router'

//引入 Pinia Store
import { useHospitalDetailStore } from "@/stores/index";
const useDetailStore = useHospitalDetailStore();

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
  color: @color-text-primary;
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
  .bottom {
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
}
</style>
