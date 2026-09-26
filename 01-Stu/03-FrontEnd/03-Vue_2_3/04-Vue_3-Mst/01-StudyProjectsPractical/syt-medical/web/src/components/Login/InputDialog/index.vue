<template>
  <div class="page-wrap">
    <div class="input">
      <el-input v-model="InputPhoneNumber" style="width: 280px" prefix-icon="User" placeholder="请输入手机号码" />
      <el-input v-model="InputVerifyCode" style="width: 280px" prefix-icon="Lock" placeholder="请输入手机验证码" />
      <el-button>获取验证码</el-button>
      <div class="user-login-button">
        <el-button type="primary" target="_blank" style="width: 280px"> 用户登录 </el-button>
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
// 引入 Pinia Store 存储 定义对应变量名称
import { useUserStore } from "@/stores/index";
// 登录界面显示 / 隐藏的相关变量控制
const userStore_Login = useUserStore();
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
