<template>
  <div class="page-top">
    <div class="content">
      <div class="left">
        <img src="../../assets/images/logo.png" alt="logo" />
        <p @click="handleSelect">尚医通 - 预约挂号统一平台</p>
      </div>
      <div class="right">
        <p>帮助中心</p>
        <p>注册/登录</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { ref, reactive, computed, watch, onMounted } from 'vue'
// 导入路由并创建路由
import { useRouter } from "vue-router";
const router = useRouter();
// 导入路由常量管理文件
import { HOME_PATH } from "@/const/index";

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

// 当用户点击时被触发
const handleSelect = () => {
  // 通过路由跳转到主页
  router.push({ path: HOME_PATH });
};
</script>

<style scoped lang="less">
.page-top {
  width: 100%;
  height: 70px;
  position: fixed;
  z-index: 9999;
  background-color: #fff;
  display: flex;
  justify-content: center;
  .content {
    width: 1200px;
    height: 70px;
    /* background-color: red; */
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      img {
        width: 50px;
        height: 50px;
      }
      p {
        font-size: 1.5rem;
        color: #5566cc;
        cursor: pointer;
      }
    }
    .right {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      p {
        font-size: 1rem;
        color: #9e9e9e;
        cursor: pointer;
      }
    }
  }
}
</style>
