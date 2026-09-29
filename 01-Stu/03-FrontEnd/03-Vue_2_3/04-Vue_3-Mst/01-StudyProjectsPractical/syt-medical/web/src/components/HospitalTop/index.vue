<template>
  <div class="page-top">
    <div class="content">
      <div class="left">
        <img src="../../assets/images/logo.png" alt="logo" />
        <p @click="handleSelect">尚医通 - 预约挂号统一平台</p>
      </div>
      <div class="right">
        <p class="help-tips"><span>帮助中心</span></p>
        <p class="login-register" v-if="!userStore_Login.isLogin">
          <span @click="userRegister">注册</span> / <span @click="userLogin">登录</span>
        </p>
        <p class="user-info" v-if="userStore_Login.isLogin">
          <el-icon><User /></el-icon>
          <el-dropdown
            placement="bottom-end"
            @command="handleCommand"
            :popper-options="{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 25] // [水平偏移, 垂直偏移]，12px 向下偏移
                  }
                }
              ]
            }"
          >
            <span class="el-dropdown-link">
              <span>{{ userStore_Login.userInfo?.name }}</span>
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>实名认证</el-dropdown-item>
                <el-dropdown-item>挂号订单</el-dropdown-item>
                <el-dropdown-item>就诊管理</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </p>
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
// 引入 utils 工具箱
import { userInfoMethods } from "@/utils/localStorage";
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
// 点击用户下拉菜单时的方法
const handleCommand = (command: string | number | object) => {
  // 当用户点击的是退出登录按钮时
  if (command == "logout") {
    // 清空本地持久化存储
    userInfoMethods.clearLocalStorage();
    // 清除 Pinia Store 存储的 用户数据 信息
    userStore_Login.userInfo = {
      name: "",
      token: ""
    };
    // 跳转到主页 类似于刷新页面
    router.push(HOME_PATH);
  }
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
      }
      .help-tips:hover {
        color: orange;
        cursor: pointer;
      }
      .login-register {
        p {
          font-size: 1rem;
          color: #9e9e9e;
        }
        span:hover {
          color: orange;
          cursor: pointer;
        }
      }
      .user-info {
        .el-icon {
          color: orange;
        }
        .el-icon:last-child:hover {
          cursor: pointer;
        }
        span {
          margin: 0 5px;
        }
        :deep(.el-dropdown-menu) {
          margin-top: 40px;
        }
      }
    }
  }
}
</style>
