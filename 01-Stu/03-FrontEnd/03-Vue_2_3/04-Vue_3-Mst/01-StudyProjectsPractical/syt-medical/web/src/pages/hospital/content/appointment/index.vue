<template>
  <!-- 进入预约挂号-- 部门/科室 选择 -->
  <div v-if="useDoctorStore.appointmentOption == 'dpt'">
    <Home />
  </div>
  <!-- 进入预约挂号-- 医生 选择 -->
  <div v-if="useDoctorStore.appointmentOption == 'dct'">
    <DoctorSelect />
  </div>
  <!-- 进入预约挂号 -- 就诊人 选择  -->
  <div v-if="useDoctorStore.appointmentOption == 'pat'">
    <Patient />
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Appointment" });

// 引入 医院科室 组件
import Home from "./home/index.vue";
import DoctorSelect from "./dctSelect/index.vue";
import Patient from "./patient/index.vue";
//引入 Pinia Store
import { useHospitalDoctorStore } from "@/stores/index";
const useDoctorStore = useHospitalDoctorStore();

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
  useDoctorStore.appointmentOption = "dpt";
});
</script>

<style scoped lang="less"></style>
