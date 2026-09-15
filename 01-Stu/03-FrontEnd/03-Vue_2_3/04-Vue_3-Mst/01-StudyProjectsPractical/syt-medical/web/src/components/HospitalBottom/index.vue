<template>
  <div class="page-bottom">
    <div class="content">
      <div class="left">京ICP备 13018369号 电话挂号:010-56253825</div>
      <div class="right">
        <span>联系我们</span>
        <span>合作伙伴</span>
        <span>用户协议</span>
        <span>隐私协议</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
// onMounted(() => {})
</script>

<style scoped lang="less">
.page-bottom {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  .content {
    width: 1200px;
    height: 100%;
    background-color: #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #bfbcbf;
    .left {
      margin: 8px;
    }
    .right {
      span {
        margin: 8px;
      }
      :hover {
        cursor: pointer;
        color: orange;
      }
    }
  }
}
</style>
