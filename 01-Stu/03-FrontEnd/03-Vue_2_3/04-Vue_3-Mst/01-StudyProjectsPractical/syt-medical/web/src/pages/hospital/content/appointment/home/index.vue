<template>
  <div class="page-wrap">
    <!-- 医院预约前，对医院的详细介绍 -->
    <HospitalInfoShow />
    <!-- 医院科室 组件 -->
    <DepartmentSelect @handleSelectDep="handleClickDep" />
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Home" });

// 引入 医院信息展示 组件
import HospitalInfoShow from "./hspShow/index.vue";
// 引入 部门/科室 组件
import DepartmentSelect from "./dptSelect/index.vue";

// import { ref, reactive, computed, watch, onMounted } from 'vue'

// import { useRouter } from 'vue-router'
// 导入路由组件
import { useRoute, useRouter } from "vue-router";
// 操作路由
const router = useRouter();
// 读取路由
const route = useRoute();

//引入 Pinia Store
import { useHospitalDoctorStore } from "@/stores/index";
const useDoctorStore = useHospitalDoctorStore();

// 引入类型定义
import type { HospitalDepartmentChildren } from "@/types/hospitalDepartment/index.ts";

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
// onMounted(() => {});

// 当用户点击科室内的具体科室触发
const handleClickDep = (activeDep: any, childDep: HospitalDepartmentChildren) => {
  // console.log("当前路由：", route.path, "当前常量：", HOSPITAL.CHILDREN.APPOINTMENT.CHILDREN.APPOINTMENT_DETAIL.path); // /hospital/appointment   appointmentDetail

  // 路由跳转到具体 科室医生 预约网址
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
  // 控制页面展示 选择科室内具体医生页面
  useDoctorStore.appointmentOption = "dct";
  // 测试数据
  // console.log("当前已选大科室：", activeDep, "；当前已选小科室", childDep);
};
</script>

<style scoped lang="less"></style>
