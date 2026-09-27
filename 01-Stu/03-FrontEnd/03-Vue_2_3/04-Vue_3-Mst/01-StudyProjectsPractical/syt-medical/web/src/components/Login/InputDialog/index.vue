<template>
  <div class="page-wrap">
    <div class="input">
      <el-input v-model="InputPhoneNumber" style="width: 280px" prefix-icon="User" placeholder="请输入手机号码" />
      <el-input v-model="InputVerifyCode" style="width: 280px" prefix-icon="Lock" placeholder="请输入手机验证码" />
      <el-button @click="handleGetCaptcha">获取验证码</el-button>
      <div class="user-login-button">
        <el-button type="primary" target="_blank" style="width: 280px" @click="handleUserLoginBtn">
          用户登录
        </el-button>
      </div>
    </div>
    <div class="scan">
      <p>微信扫码登录</p>
      <el-button type="danger" :icon="ChatDotRound" circle @click="handleChatClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "InputDialog" });
import { ElMessage } from "element-plus";
// 引入 用户/登录/验证码 数据类型
import type { ResponseData } from "@/types/api";
import type { CaptchaItem } from "@/types/userLogin/index";
// 引入 Pinia Store 存储 定义对应变量名称
import { useUserStore } from "@/stores/index";
// 登录界面显示 / 隐藏的相关变量控制
const userStore_Login = useUserStore();
// 引入网络请求 验证码获取 API
import { reqLoginCapcha } from "@/api/user/index";
// 引入 Element-Plus 图标元素
import { ChatDotRound } from "@element-plus/icons-vue";

// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ref } from "vue";

// import { useRouter } from 'vue-router'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})
// 用户输入 手机号码 的变量存储
let InputPhoneNumber = ref<string>("");
// 用户输入 验证码 的变量存储
let InputVerifyCode = ref<string>("");

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
// 用户点击微信扫码登录 按钮
const handleChatClick = () => {
  userStore_Login.userLoginMethods_Input = false;
};
// 获取 验证码
const handleGetCaptcha = async () => {
  try {
    const result = (await reqLoginCapcha(InputPhoneNumber.value)) as ResponseData<CaptchaItem>;
    if (result.code == 200) {
      // 将获取到的 验证码 数据给到 InputVerifyCode
      InputVerifyCode.value = result.data.code;
      ElMessage.success("验证码发送成功");
    } else {
      ElMessage.success(result.message);
    }
  } catch (error: any) {
    // 响应拦截器 reject 后走到这里
    ElMessage.error(error.message || "获取验证码失败");
  }
};
// 用户点击 登录按钮
const handleUserLoginBtn = async () => {};
</script>

<style scoped lang="less">
.page-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  .input {
    .el-input,
    .el-button {
      margin-left: 20px;
      margin-top: 20px;
      :deep(.el-input__inner) {
        padding-top: 3px;
      }
    }
  }
  .scan {
    p {
      margin-top: 15px;
    }
    .el-button {
      margin-top: 10px;
    }
  }
}
</style>
