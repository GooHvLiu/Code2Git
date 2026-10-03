<template>
  <!-- 进入预约挂号的医院详情 和 科室选择界面 -->
  <div
    v-if="
      useDoctorStore.appointmentDoctor.appointmentDepartment == 1 && useDoctorStore.appointmentDoctor.doctorDetail == 0
    "
    class="appointment-department"
  >
    <!-- 医院预约前，对医院的详细介绍 -->
    <div class="description">
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
    <!-- 医院科室 组件 -->
    <Department @handleSelectDep="handleClickDep" />
  </div>
  <!-- 进入预约医生详情界面 -->
  <div
    v-if="
      useDoctorStore.appointmentDoctor.appointmentDepartment == 1 && useDoctorStore.appointmentDoctor.doctorDetail == 1
    "
    class="doctorDetail"
  >
    <DoctorDetail />
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Appointment" });

// 引入 医院科室 组件
import Department from "./department/index.vue";
import DoctorDetail from "./doctorDetail/index.vue";
//引入 Pinia Store
import { useHospitalDetailStore, useHospitalDoctorStore } from "@/stores/index";
const useDetailStore = useHospitalDetailStore();
const useDoctorStore = useHospitalDoctorStore();
// 导入路由组件
import { useRoute, useRouter } from "vue-router";
// 操作路由
const router = useRouter();
// 读取路由
const route = useRoute();

// 引入类型定义
import type { HospitalDepartmentChildren } from "@/types/hospitalDepartment/index.ts";

// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { onMounted } from "vue";

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
onMounted(() => {
  // 进入此组件，即代表已进入部门页面
  useDoctorStore.appointmentDoctor.appointmentDepartment = 1;
});
// 当用户点击科室内的具体科室触发
const handleClickDep = (activeDep: any, childDep: HospitalDepartmentChildren) => {
  // console.log("当前路由：", route.path, "当前常量：", HOSPITAL.CHILDREN.APPOINTMENT.CHILDREN.APPOINTMENT_DETAIL.path); // /hospital/appointment   appointmentDetail

  // 路由跳转到具体科室医生预约网址
  router.push({
    path: route.path,
    query: {
      // 医院代号
      hoscode: activeDep.hoscode,
      // 科室代号
      depcode: activeDep.depcode,
      // 专科门诊代号
      spccode: childDep.depcode
    }
  });
  // 控制页面展示
  useDoctorStore.appointmentDoctor.doctorDetail = 1;
  // 测试数据
  // console.log("当前已选大科室：", activeDep, "；当前已选小科室", childDep);
};
</script>

<style scoped lang="less">
.appointment-department {
  .description {
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
}
</style>
