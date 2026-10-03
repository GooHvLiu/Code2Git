<template>
  <div class="page-wrap">
    <div class="top-tips"><h2>确认挂号信息</h2></div>
    <div class="middle-patientVistor">
      <el-card>
        <div class="tips-conform">
          <p class="tips">请点击选择就诊人</p>
          <el-button type="success"
            ><el-icon><User /></el-icon>
            <span>添加就诊人</span>
          </el-button>
        </div>
        <div class="line"></div>
        <div class="patient-card">
          <div class="cards" v-for="(card, index) in 2" :key="index"><Card /></div>
        </div>
      </el-card>
    </div>
    <!-- 挂号医院 、日期、医生、科室等信息展示 -->
    <div class="bottom-doctorInfo">
      <el-card>
        <p class="tips">挂号信息</p>
        <div class="line"></div>
        <el-descriptions :column="2" border>
          <el-icon><Minus /></el-icon>
          <el-descriptions-item label="就诊日期" label-align="center" align="center">
            {{ useHspDctStore.selectedDoctor?.workDate + " " + useHspDctStore.selectedDoctor?.dayOfWeek + " "
            }}{{ useHspDctStore.selectedDoctor?.workTime == 0 ? "上午" : "下午" }}
          </el-descriptions-item>
          <el-descriptions-item label="就诊医院" label-align="center" align="center">
            {{ useHspDctStore.hspDptSpcName?.hopName }}
          </el-descriptions-item>
          <el-descriptions-item label="就诊科室" label-align="center" align="center">
            {{ useHspDctStore.hspDptSpcName?.dptName }}
          </el-descriptions-item>
          <el-descriptions-item label="医生姓名" label-align="center" align="center">
            {{ useHspDctStore.selectedDoctor?.docname }}
          </el-descriptions-item>
          <el-descriptions-item label="医生职称" label-align="center" align="center">
            {{ useHspDctStore.selectedDoctor?.title }}
          </el-descriptions-item>
          <el-descriptions-item label="医生专长" label-align="center" align="center">
            {{ useHspDctStore.hspDptSpcName?.spcName }}
          </el-descriptions-item>
          <el-descriptions-item label="医事服务费" label-align="left" align="left">
            ￥ {{ useHspDctStore.selectedDoctor?.amount }} 元
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
    <!-- 页面最后的确认按钮 -->
    <div class="footer-btn">
      <el-button type="primary">确认挂号</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Patient" });
// 引入子组件
import Card from "./card/index.vue";
// 引入Pinia Store 已挂好医生的相关信息
import { useHospitalDetailStore, useHospitalDoctorStore } from "@/stores/index.ts";
const useHospitalStore = useHospitalDetailStore();
const useHspDctStore = useHospitalDoctorStore();

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
// onMounted(() => {})
// 生命周期
onMounted(() => {
  // 测试获取的数据
  console.log("医院数据：", useHspDctStore.hspDptSpcName, "医生数据：", useHspDctStore.selectedDoctor);
});
</script>

<style scoped lang="less">
.page-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  .top-tips {
    width: 100%;
    font-size: 1.2rem;
    font-weight: 600;
  }
  .middle-patientVistor {
    width: 100%;
    display: flex;
    flex-direction: column;
    .tips-conform {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .tips {
        font-size: 1.1rem;
      }
    }
    .line {
      width: 100%;
      height: 3px;
      background-color: @color-border;
      margin: 15px 0;
    }
    .patient-card {
      width: 100%;
      display: grid;
      /* Grid 列宽：重复：自动排列；排列宽度：单个最小宽度300px,最大占满剩余空间 */
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 15px;
    }
  }
  .bottom-doctorInfo {
    width: 100%;
    .tips {
      font-weight: 800;
    }
    .line {
      width: 100%;
      height: 3px;
      background-color: @color-border;
      margin: 15px 0;
    }
  }
}
</style>
