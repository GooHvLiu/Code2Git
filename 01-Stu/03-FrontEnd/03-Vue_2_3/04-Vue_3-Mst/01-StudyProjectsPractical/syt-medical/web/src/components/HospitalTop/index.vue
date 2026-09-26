<template>
  <div class="page-top">
    <div class="content">
      <div class="left">
        <img src="../../assets/images/logo.png" alt="logo" />
        <p @click="handleSelect">尚医通 - 预约挂号统一平台</p>
      </div>
      <div class="right">
        <p>帮助中心</p>
        <p><span @click="userRegister">注册</span> / <span @click="userLogin">登录</span></p>
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
// 引入Pinia Store 用户
import { useUserStore } from "@/stores/index";
const userStore_Login = useUserStore();

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
// 用户点击 注册 时
const userRegister = () => {
  console.log("用户点击了注册");
};
// 用户点击 登录 时
const userLogin = () => {
  // 点击登录时，将存储在 Store 中的用户登录变量结果进行更改显示
  userStore_Login.userLoginVisible = true;
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
        span:hover {
          color: orange;
        }
      }
    }
  }
}
</style>
