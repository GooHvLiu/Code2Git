<template>
  <div class="page-wrap">
    <el-card>
      <div class="title">
        <div class="left-info">
          <span class="medical-card">医保</span>
          <span class="name-info">腾飞翔</span>
        </div>
        <div class="right-edit">
          <el-icon><Edit /></el-icon>
        </div>
      </div>
      <div class="patient-info">
        <p><span>证件类型：</span>身份证</p>
        <p><span>证件号码：</span>220687200310254069</p>
        <p><span>用户性别：</span>男</p>
        <p><span>出生日期：</span>2003-10-25</p>
        <p><span>手机号码：</span>18759874525</p>
        <p><span>婚姻状况：</span>已婚</p>
        <p><span>当前地址：</span>江苏省苏州市工业园区</p>
        <p><span>详细地址：</span>唯亭镇镇区203街道158号</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Card" });

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
  :deep(.el-card__body) {
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
    border-radius: 5px;
    .title {
      background-color: @color-bg-regular;
      border-radius: 5px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 80px;
      .left-info {
        .medical-card {
          background-color: @color-bg-white;
          padding: 5px;
          margin: 0 20px;
          border-radius: 15px;
        }
      }
      .right-edit {
        background-color: @color-bg-tips;
        padding: 10px;
        border-radius: 20px;
        margin-right: 20px;
      }
    }
    .patient-info {
      color: @color-text-regular;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
      padding: 15px;
      font-size: 0.85rem;
      p {
        span {
          font-weight: 800;
        }
      }
    }
  }
}
</style>
