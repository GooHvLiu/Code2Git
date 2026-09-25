<template>
  <div class="page-wrap">
    <!-- 预约须知的标题 -->
    <div class="title">
      <div>{{ useStore.hospitalDetailInfo?.hosname }}预约挂号须知</div>
    </div>
    <!-- 预约须知的内容 -->
    <div class="content">
      <div class="tips-tip">为方便您早日就医康复，请您认真阅读预约挂号须知:</div>
      <div class="tips-title">一、预约实名制:</div>
      <div class="tips-content">
        统一平台电话预约和网上预约挂号均采取实名制注册预约，请您如实提供就诊人员的真实姓名、有效证件号（身份证、护照）、性别、手机号码、社保卡号等基本信息。
      </div>
      <div class="tips-title">二、预约挂号:</div>
      <div class="tips-content">
        <div class="tips">按照北京市卫健委统一平台要求，预约挂号规则如下:</div>
        <div class="tips">在同一自然日，同一医院，同一科室，同一就诊单元，同一就诊人，可以预约最多1个号源;</div>
        <div class="tips">
          在同一自然周，同一就诊人，可以预约最多8个号源; 在同一自然月，同一就诊人，可以预约最多12个号源;
        </div>
        <div class="tips">在同一自然季度，同一就诊人，可以预约最多24个号源。</div>
      </div>
      <div class="tips-title">三、取消预约:</div>
      <div class="tips-content">
        已完成预约的号源，如需办理退号，至少在就诊前一工作日14:00前通过网站、微信公众号、114电话等平台预约渠道进行取消预约。
      </div>
      <div class="tips-title">四、爽约处理:</div>
      <div class="tips-content">
        <div class="tips">如预约成功后患者未能按时就诊且不办理取消预约号视为爽约，同一患者在自然年内爽约规则如下:</div>
        <div class="tips">累计爽约3次，自3次爽约日起，90天内不允许通过114平台进行预约挂号;</div>
        <div class="tips">累计爽约6次，自6次爽约日起，180天内不允许通过114平台进行预约挂号。</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Notice" });
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
  .content {
    display: flex;
    flex-direction: column;
    gap: 15px;
    .tips-title {
      font-weight: 800;
    }
    .tips-content {
      line-height: 1.8rem;
    }
  }
}
</style>
