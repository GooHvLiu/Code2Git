<template>
  <div class="page-wrap">
    <div class="input">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleFormRef">
        <el-form-item prop="phoneNumber">
          <el-input
            v-model="ruleForm.phoneNumber"
            style="width: 280px"
            prefix-icon="User"
            placeholder="请输入手机号码"
          />
        </el-form-item>
        <el-form-item prop="captchaCode">
          <el-input
            v-model="ruleForm.captchaCode"
            style="width: 280px"
            prefix-icon="Lock"
            placeholder="请输入手机验证码"
          />
        </el-form-item>
      </el-form>
      <div class="get-captcha">
        <el-button :disabled="disabled" @click="handleGetCaptcha"
          >获取验证码<span v-show="disabled">(0{{ captchaTimer }})</span></el-button
        >
      </div>
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
// 引入 element-plu 相关
import { ElMessage } from "element-plus";
// 引入 用户/登录/验证码 数据类型
import type { ResponseData } from "@/types/api";
import type { CaptchaItem, ResLoginItem } from "@/types/userLogin/index";
// 引入 Pinia Store 存储 定义对应变量名称
import { useUserStore } from "@/stores/index";
// 登录界面显示 / 隐藏的相关变量控制
const userStore_Login = useUserStore();
// 引入网络请求 验证码获取 / 用户登录 API
import { reqLoginCapcha, reqLogin } from "@/api/user/index";
// 引入 Element-Plus 图标元素
import { ChatDotRound } from "@element-plus/icons-vue";
// 引入 手机号码 验证工具
import { verifyPhoneNumber, verifyCaptchCode } from "@/utils";
// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ref, reactive } from "vue";

// import { useRouter } from 'vue-router'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})
// 用户输入 手机号码 的变量存储
// 获取验证码按钮是否可用 disabled=true 表示不可用
let disabled = ref<boolean>(false);
// 获取验证码按钮不可用倒计时
let captchaTimer = ref<number>(5);
// 表单内的数据变量
const ruleForm = reactive({
  phoneNumber: "",
  captchaCode: ""
});

// 需要校验的表格别名
const ruleFormRef = ref<any>();
// 表单验证规则
const rules = {
  phoneNumber: [
    {
      trigger: "blur",
      validator: (rule: any, value: string, callback: any) => {
        // 如果为空，不报错，直接放行
        if (!value) return callback();
        if (!verifyPhoneNumber(value)) {
          return callback(new Error("手机号格式不正确"));
        }
        callback();
      }
    }
  ],
  captchaCode: [
    {
      trigger: "blur",
      validator: (rule: any, value: string, callback: any) => {
        // 如果为空，不报错，直接放行
        if (!value) return callback();
        if (!verifyCaptchCode(value)) {
          return callback(new Error("验证码必须是6位数字"));
        }
        callback();
      }
    }
  ]
};

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
// 点击 获取验证码 按钮
const handleGetCaptcha = async () => {
  if (verifyPhoneNumber(ruleForm.phoneNumber)) {
    try {
      const result = (await reqLoginCapcha(ruleForm.phoneNumber)) as ResponseData<CaptchaItem>;

      if (result.code == 200) {
        // 将获取到的 验证码 数据给到 InputVerifyCode
        ruleForm.captchaCode = result.data.code;
        ElMessage.success({
          message: "验证码发送成功",
          placement: "top",
          offset: 100
        });
        // 倒计时 5 秒 获取验证码按钮无法使用
        // 重置一下倒计时数值
        captchaTimer.value = 5;
        // 将获取 验证码 按钮的变量变为 true
        disabled.value = true;
        const timer = setInterval(() => {
          // 倒计时减一，直到为0时
          captchaTimer.value--;
          if (captchaTimer.value <= 0) {
            // 完成循环后清除定时器
            clearInterval(timer);
            // 重置一下倒计时数值
            captchaTimer.value = 5;
            // 将获取 验证码 按钮的变量变为 true
            disabled.value = false;
          }
        }, 1000);
      } else {
        ElMessage.success({
          message: result.message,
          placement: "top",
          offset: 100
        });
      }
    } catch (error: any) {
      // 响应拦截器 reject 后走到这里
      ElMessage.error({
        message: error.message || "获取验证码失败",
        placement: "top",
        offset: 100
      });
    }
  } else {
    ElMessage({
      message: "输入的手机号码格式不正确，请重新输入",
      placement: "top",
      offset: 100
    });
    ruleForm.phoneNumber = "";
  }
};
// 用户点击 登录按钮
const handleUserLoginBtn = async () => {
  // 如果需要验证的值有空的 则返回
  if (!ruleFormRef.value) return;
  try {
    // 输入验证全部通过后再执行
    await ruleFormRef.value.validate();
    // 只有全部校验成功，才走到这里
    const result = (await reqLogin({
      phone: ruleForm.phoneNumber,
      code: ruleForm.captchaCode
    })) as ResponseData<ResLoginItem>;
    // 当返回的 code=200
    if (result.code === 200) {
      // console.log("用户信息：", result.data);
      // 将用户信息存储到 Pinia Store 变量内
      userStore_Login.setUserInfo(result.data);
      // 修改登录窗口显示与否变量，将窗口关闭
      userStore_Login.userLoginVisible = false;
      // 登录后即可清空相关数据
      resetVerify();
    }
  } catch (error) {
    // 校验失败会进这里，不会执行上面的log
    ElMessage({
      message: "表单校验不通过:" + error,
      placement: "top",
      offset: 100
    });
  }
};
// 触发校验重置和输入框内容清空
const resetVerify = () => {
  // 清空校验提示内容和输入框内容
  ruleFormRef.value.resetFields();
};
// 把方法暴露给父组件
defineExpose({
  resetVerify
});
</script>

<style scoped lang="less">
.page-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  .input {
    .el-form {
      margin-top: 25px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      margin-bottom: 5px;
    }
    .get-captcha {
      margin-bottom: 10px;
      span {
        margin-left: 5px;
      }
    }
  }
  .scan {
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      margin-top: 15px;
    }
    .el-button {
      margin-top: 10px;
    }
  }
}
</style>
