<template>
  <div class="page-top">
    <div class="content">
      <div class="left">
        <img src="../../assets/images/logo.png" alt="logo" />
        <p @click="handleSelect">尚医通 - 预约挂号统一平台</p>
      </div>
      <div class="right">
        <p class="help-tips"><span>帮助中心</span></p>
        <p class="login-register" v-if="!userLoginStore.isLogin">
          <span @click="userRegister">注册</span> / <span @click="userLogin">登录</span>
        </p>
        <p class="user-info" v-if="userLoginStore.isLogin">
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
              <span>{{ userLoginStore.userInfo?.nickName }}</span>
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
import { watch } from "vue";
// 导入路由并创建路由
import { useRouter } from "vue-router";
const router = useRouter();
// 导入路由常量管理文件
import { HOME } from "@/const/index";
// 通过网络请求获取相关数据
import { reqGetUserInfo } from "@/api/user/index";
// 引入数据类型定义
import type { ResponseData } from "@/types/api";
import type { ResUserInfo } from "@/types/userLogin/index";
// 引入Pinia Store 用户
import { useUserStore } from "@/stores/index";
const userLoginStore = useUserStore();
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
watch(
  // 监听用户是否已登录变量的值变化
  () => userLoginStore.isLogin,
  async () => {
    try {
      const userInfo = (await reqGetUserInfo()) as ResponseData<ResUserInfo>;
      // console.log("处理前用户数据：", userInfo);
      if (userInfo.code == 200) {
        userLoginStore.userInfo = userInfo.data;
        // console.log("用户数据：", userLoginStore.userInfo);
      }
    } catch (error) {
      console.log("错误：", error);
    }
  }
);

// 生命周期
// onMounted(() => {})

// 当用户点击时被触发
const handleSelect = () => {
  // 通过路由跳转到主页
  router.push({ path: HOME.path });
};
// 用户点击 注册 时
const userRegister = () => {
  console.log("用户点击了注册");
};
// 用户点击 登录 时
const userLogin = () => {
  // 点击登录时，将存储在 Store 中的用户登录变量结果进行更改显示
  userLoginStore.userLoginVisible = true;
};
// 点击用户下拉菜单时的方法
const handleCommand = (command: string | number | object) => {
  // 当用户点击的是退出登录按钮时
  if (command == "logout") {
    // 清空本地持久化存储
    userInfoMethods.clearLocalStorage();
    // 清除 Pinia Store 存储的 用户数据 信息
    userLoginStore.useTokenInfo = {
      name: "",
      token: ""
    };
    // 跳转到主页 类似于刷新页面
    router.push(HOME.path);
  }
};
</script>

<style scoped lang="less">
.page-top {
  width: 100%;
  height: 70px;
  position: fixed;
  z-index: 9999;
  background-color: @color-bg-white;
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
        color: @color-primary-light;
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
        color: @color-text-secondary;
      }
      .help-tips:hover {
        color: @color-text-hoverMainColor;
        cursor: pointer;
      }
      .login-register {
        p {
          font-size: 1rem;
          color: @color-text-secondary;
        }
        span:hover {
          color: @color-text-hoverMainColor;
          cursor: pointer;
        }
      }
      .user-info {
        .el-icon {
          color: @color-text-hoverMainColor;
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
