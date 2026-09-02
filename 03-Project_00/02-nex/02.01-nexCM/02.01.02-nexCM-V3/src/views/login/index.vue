<template>
  <div class="auth-page">
    <div class="auth-container" :class="{ 'right-panel-active': isRegister }">
      <!-- ==================== 注册表单 ==================== -->
      <div class="form-container register-container">
        <el-form
          :model="registerForm"
          :rules="registerRules"
          ref="registerFormRef"
          class="auth-form"
        >
          <h2 class="form-title">{{ $t('login.registerTitle') }}</h2>
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              prefix-icon="el-icon-user"
              :placeholder="$t('login.username')"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              prefix-icon="el-icon-message"
              :placeholder="$t('login.email')"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              prefix-icon="el-icon-lock"
              :placeholder="$t('login.password')"
              show-password
            />
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              prefix-icon="el-icon-lock"
              :placeholder="$t('login.confirmPassword')"
              show-password
            />
          </el-form-item>
          <el-form-item prop="captchacode">
            <div class="captcha-box">
              <el-input
                v-model="registerForm.captchacode"
                prefix-icon="el-icon-key"
                :placeholder="$t('login.captcha')"
                @keyup.enter.native="handleRegister"
              />
              <img
                v-if="captchaCodeSrc"
                :src="captchaCodeSrc"
                class="captcha-img"
                @click="getCaptchaCode"
              />
              <div v-else class="captcha-loading">
                {{ config.LOGIN.CAPTCHA_LOADING }}
              </div>
            </div>
          </el-form-item>
          <el-button class="submit-btn" type="primary" :loading="loading" @click="handleRegister"
            >{{ $t('login.registerBtn') }}</el-button
          >
        </el-form>
      </div>

      <!-- ==================== 登录表单 ==================== -->
      <div class="form-container login-container">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleFormRef"
          class="auth-form"
        >
          <h2 class="form-title">{{ $t('login.title') }}</h2>
          <el-form-item prop="username">
            <el-input
              v-model="ruleForm.username"
              type="text"
              autocomplete="off"
              prefix-icon="el-icon-user"
              :placeholder="$t('login.username')"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="ruleForm.password"
              type="password"
              autocomplete="off"
              prefix-icon="el-icon-lock"
              :placeholder="$t('login.password')"
            />
          </el-form-item>
          <el-form-item prop="captchacode">
            <div class="captcha-box">
              <el-input
                v-model="ruleForm.captchacode"
                prefix-icon="el-icon-key"
                :placeholder="$t('login.captcha')"
                @keyup.enter.native="submitForm('ruleForm')"
              />
              <img
                v-if="captchaCodeSrc"
                :src="captchaCodeSrc"
                class="captcha-img"
                @click="getCaptchaCode"
              />
              <div v-else class="captcha-loading">
                {{ config.LOGIN.CAPTCHA_LOADING }}
              </div>
            </div>
          </el-form-item>
          <el-button
            class="submit-btn"
            type="primary"
            :loading="loading"
            @click="submitForm('ruleForm')"
            >{{ $t('login.loginBtn') }}</el-button
          >
          <div class="forgot-password-link">
            <a @click="showForgotPasswordDialog = true">{{ $t('login.forgotPassword') }}</a>
          </div>
        </el-form>
      </div>

      <!-- ==================== 滑动覆盖层 ==================== -->
      <div class="overlay-container">
        <div class="overlay">
          <!-- 左侧覆盖面板（注册状态显示） -->
          <div class="overlay-panel overlay-left">
            <img
              src="@/assets/images/logo-white.png"
              alt="logo"
              class="overlay-logo"
            />
            <h1 class="overlay-title">{{ config.SYSTEM_NAME }}</h1>
            <p class="overlay-desc">{{ config.SYSTEM_DESC }}</p>
            <p class="overlay-tip">{{ $t('login.hasAccount') }}</p>
            <button class="ghost-btn" @click="switchPanel('login')">
              {{ $t('login.loginNow') }}
            </button>
          </div>
          <!-- 右侧覆盖面板（登录状态显示） -->
          <div class="overlay-panel overlay-right">
            <img
              src="@/assets/images/logo-white.png"
              alt="logo"
              class="overlay-logo"
            />
            <h1 class="overlay-title">{{ config.SYSTEM_NAME }}</h1>
            <p class="overlay-desc">{{ config.SYSTEM_DESC }}</p>
            <p class="overlay-tip">{{ $t('login.noAccount') }}</p>
            <button class="ghost-btn" @click="switchPanel('register')">
              {{ $t('login.registerNow') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端底部切换链接 -->
    <div class="mobile-switch">
      <span v-if="!isRegister"
        >{{ $t('login.noAccount') }}<a @click="switchPanel('register')">{{ $t('login.registerNow') }}</a></span
      >
      <span v-else
        >{{ $t('login.hasAccount') }}<a @click="switchPanel('login')">{{ $t('login.loginNow') }}</a></span
      >
    </div>

    <!-- ==================== 忘记密码对话框 ==================== -->
    <el-dialog
      title="忘记密码"
      :visible.sync="showForgotPasswordDialog"
      width="420px"
      @close="resetForgotPasswordForm"
    >
      <el-steps :active="forgotStep" finish-status="success" align-center>
        <el-step title="验证身份" />
        <el-step title="重置密码" />
        <el-step title="完成" />
      </el-steps>

      <!-- 第一步：输入用户名和邮箱，发送验证码 -->
      <div v-if="forgotStep === 0" style="margin-top: 30px">
        <el-form :model="forgotForm" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="forgotForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="forgotForm.email" placeholder="请输入注册邮箱" />
          </el-form-item>
          <el-form-item label="验证码">
            <div style="display: flex; gap: 10px; width: 100%">
              <el-input v-model="forgotForm.code" placeholder="请输入验证码" style="flex: 1" />
              <el-button :disabled="codeCountdown > 0" @click="handleSendResetCode">
                {{ codeCountdown > 0 ? codeCountdown + 's后重发' : '发送验证码' }}
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <!-- 第二步：输入新密码 -->
      <div v-if="forgotStep === 1" style="margin-top: 30px">
        <el-form :model="forgotForm" label-width="80px">
          <el-form-item label="新密码">
            <el-input v-model="forgotForm.newPassword" type="password" placeholder="请输入新密码（至少8位）" show-password />
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input v-model="forgotForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
          </el-form-item>
        </el-form>
      </div>

      <!-- 第三步：完成 -->
      <div v-if="forgotStep === 2" style="margin-top: 30px; text-align: center">
        <i class="el-icon-success" style="font-size: 48px; color: #67c23a"></i>
        <p style="margin-top: 15px; font-size: 16px">密码重置成功！</p>
        <p style="color: #909399">请使用新密码登录</p>
      </div>

      <span slot="footer">
        <el-button v-if="forgotStep < 2" @click="showForgotPasswordDialog = false">取 消</el-button>
        <el-button v-if="forgotStep === 0" type="primary" @click="handleVerifyCode">下一步</el-button>
        <el-button v-if="forgotStep === 1" type="primary" @click="handleResetPassword">确认重置</el-button>
        <el-button v-if="forgotStep === 2" type="primary" @click="handleForgotPasswordComplete">去登录</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
/* eslint-disable vue/multi-word-component-names */
import { ref, reactive, computed, onMounted } from 'vue'
import { Message } from 'element-ui'
import {
  validateUsername,
  validatePassword,
  validateConfirmPassword,
  validateEmail,
} from "@/utils/validate";
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  removeSessionStorage,
} from "@/utils/storage";
import { LOCALSTORAGE_KEYS, SESSIONSTORAGE_KEYS } from "@/utils/storageKey";
import { requestCaptchaCodeApi, requestLoginApi, requestRegisterApi } from "@/api/login"
import { requestSendResetCodeApi, requestResetPasswordByCodeApi } from "@/api/user";
import { setToken } from "@/utils/auth";
import config from "@/config";
import router from '@/router'
import { useI18n } from '@/composables/useI18n'
import ws from '@/utils/websocket'
import store from '@/store'

const { t: $t } = useI18n()

// ===== 响应式数据 =====
const isRegister = ref(false)
const loading = ref(false)
const captchaCodeSrc = ref('')

// 登录表单
const ruleForm = reactive({
  username: "",
  password: "",
  captchacode: "",
})

// 注册表单
const registerForm = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  captchacode: "",
})

const ruleFormRef = ref(null)
const registerFormRef = ref(null)

// ===== 忘记密码相关 =====
const showForgotPasswordDialog = ref(false)
const forgotStep = ref(0)
const codeCountdown = ref(0)
let codeTimer = null
const forgotForm = reactive({
  username: '',
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})

// ===== 计算属性 =====
/** 登录表单校验规则（国际化） */
const rules = computed(() => ({
  username: [
    { required: true, message: $t('login.usernameRequired'), trigger: "blur" },
    { validator: validateUsername, trigger: "blur" },
  ],
  password: [
    { required: true, message: $t('login.passwordRequired'), trigger: "blur" },
  ],
  captchacode: [
    { required: true, message: $t('login.captchaRequired'), trigger: "blur" },
  ],
}))

/** 注册表单校验规则（国际化） */
const registerRules = computed(() => ({
  username: [
    { required: true, message: $t('login.usernameRequired'), trigger: "blur" },
    { validator: validateUsername, trigger: "blur" },
  ],
  email: [
    { required: true, message: $t('login.emailRequired'), trigger: "blur" },
    { validator: validateEmail, trigger: "blur" },
  ],
  password: [
    { required: true, message: $t('login.passwordRequired'), trigger: "blur" },
    { validator: validatePassword, trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: $t('login.confirmPasswordRequired'), trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        validateConfirmPassword(registerForm.password)(
          rule,
          value,
          callback
        );
      },
      trigger: "blur",
    },
  ],
  captchacode: [
    { required: true, message: $t('login.captchaRequired'), trigger: "blur" },
  ],
}))

// ===== 方法 =====
/** 切换登录/注册面板 */
function switchPanel(type) {
  isRegister.value = type === "register";
  // 切换浏览器标签页标题
  const pageName = isRegister.value
    ? $t('login.registerTitle')
    : $t('login.title');
  document.title = `${pageName} - ${config.SYSTEM_NAME}`;
}

/** 获取验证码（登录注册共用） */
async function getCaptchaCode() {
  try {
    const res = await requestCaptchaCodeApi();
    ruleForm.captchacode = "";
    registerForm.captchacode = "";
    const svgText = res.data.img;
    captchaCodeSrc.value = `data:image/svg+xml;utf8,${encodeURIComponent(
      svgText
    )}`;
    setLocalStorage(LOCALSTORAGE_KEYS.CAPTCHA_UUID, res.data.uuid);
  } catch (err) {
    captchaCodeSrc.value = "";
  }
}

/** 登录提交（原有逻辑不动） */
function submitForm(formName) {
  const formRef = formName === 'ruleForm' ? ruleFormRef.value : registerFormRef.value
  formRef.validate(async (valid) => {
    if (!valid) {
      formReset({
        isClearUsername: false,
        isClearPassword: true,
        isClearCode: true,
        isRefreshCaptcha: true,
      });
      return;
    }

    loading.value = true;
    try {
      const res = await requestLoginApi({
        username: ruleForm.username,
        password: ruleForm.password,
        code: ruleForm.captchacode,
        uuid: getLocalStorage(LOCALSTORAGE_KEYS.CAPTCHA_UUID),
        deviceId: ws.deviceId,
        deviceName: navigator.userAgent
      });

      formReset({
        isClearUsername: true,
        isClearPassword: true,
        isClearCode: true,
        isRefreshCaptcha: false,
      });
      removeLocalStorage(LOCALSTORAGE_KEYS.CAPTCHA_UUID);
      removeSessionStorage(SESSIONSTORAGE_KEYS.TAG_LIST);
      setToken(res.data.token);

      // 存储权限码列表和权限版本号（用于按钮/参数权限判断）
      if (Array.isArray(res.data.permissions)) {
        setLocalStorage(LOCALSTORAGE_KEYS.PERMISSIONS, res.data.permissions);
        // 关键修复：同时更新 store 中的 permissions，否则 v-permission 指令获取不到权限
        store.commit('user/SET_PERMISSIONS', res.data.permissions)
      }
      if (res.data.permissionVersion) {
        setLocalStorage(LOCALSTORAGE_KEYS.PERMISSION_VERSION, res.data.permissionVersion);
      }

      // 跳转：优先 redirect 参数，否则首页
      // 用户信息和动态路由由路由守卫统一获取
      const redirect = router.currentRoute.query.redirect || "/";
      router.push(redirect);
    } catch (err) {
      formReset({
        isClearUsername: false,
        isClearPassword: true,
        isClearCode: true,
        isRefreshCaptcha: true,
      });
    } finally {
      loading.value = false;
    }
  });
}

/** 注册提交 */
function handleRegister() {
  registerFormRef.value.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      await requestRegisterApi({
        username: registerForm.username,
        password: registerForm.password,
        email: registerForm.email,
        code: registerForm.captchacode,
        uuid: getLocalStorage(LOCALSTORAGE_KEYS.CAPTCHA_UUID),
      });
      Message.success($t('login.registerSuccess'));
      // 清空注册表单，切换到登录面板
      Object.assign(registerForm, {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        captchacode: "",
      });
      switchPanel("login");
    } catch (err) {
      // 注册失败，刷新验证码
      getCaptchaCode();
    } finally {
      loading.value = false;
    }
  });
}

/** 表单重置（原有逻辑不动） */
function formReset(clear = {}) {
  const {
    isClearUsername = false,
    isClearPassword = false,
    isClearCode = false,
    isRefreshCaptcha = false,
  } = clear;
  if (isClearUsername) ruleForm.username = "";
  if (isClearPassword) ruleForm.password = "";
  if (isClearCode) ruleForm.captchacode = "";
  if (isRefreshCaptcha) getCaptchaCode();
}

// ===== 生命周期 =====
onMounted(() => {
  getCaptchaCode();
})

// ===== 忘记密码相关方法 =====
function resetForgotPasswordForm() {
  forgotStep.value = 0
  forgotForm.username = ''
  forgotForm.email = ''
  forgotForm.code = ''
  forgotForm.newPassword = ''
  forgotForm.confirmPassword = ''
  if (codeTimer) {
    clearInterval(codeTimer)
    codeTimer = null
  }
  codeCountdown.value = 0
}

async function handleSendResetCode() {
  if (!forgotForm.username) {
    Message.warning('请输入用户名')
    return
  }
  if (!forgotForm.email) {
    Message.warning('请输入邮箱')
    return
  }
  try {
    await requestSendResetCodeApi({ username: forgotForm.username, email: forgotForm.email })
    Message.success('验证码已发送，请查收邮件')
    codeCountdown.value = 60
    codeTimer = setInterval(() => {
      codeCountdown.value--
      if (codeCountdown.value <= 0) {
        clearInterval(codeTimer)
        codeTimer = null
      }
    }, 1000)
  } catch (err) {
    Message.error('操作失败')
  }
}

function handleVerifyCode() {
  if (!forgotForm.username || !forgotForm.email || !forgotForm.code) {
    Message.warning('请填写完整信息')
    return
  }
  forgotStep.value = 1
}

async function handleResetPassword() {
  if (!forgotForm.newPassword || forgotForm.newPassword.length < 8) {
    Message.warning('密码长度不能少于8位')
    return
  }
  if (forgotForm.newPassword !== forgotForm.confirmPassword) {
    Message.warning('两次输入的密码不一致')
    return
  }
  try {
    await requestResetPasswordByCodeApi({
      username: forgotForm.username,
      email: forgotForm.email,
      code: forgotForm.code,
      newPassword: forgotForm.newPassword
    })
    forgotStep.value = 2
  } catch (err) {
    Message.error('操作失败')
  }
}

function handleForgotPasswordComplete() {
  showForgotPasswordDialog.value = false
  resetForgotPasswordForm()
}
</script>

<style scoped lang="less">
.forgot-password-link {
  text-align: right;
  margin-top: 10px;
  a {
    color: #409eff;
    cursor: pointer;
    font-size: 14px;
    &:hover {
      text-decoration: underline;
    }
  }
}
// ==================== 页面背景 ====================
.auth-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: @spacing-lg;
  background: @bg-page;
  box-sizing: border-box;
}

// ==================== 卡片容器 ====================
.auth-container {
  position: relative;
  width: @auth-card-width;
  max-width: 100%;
  min-height: @auth-card-height;
  background: @bg-white;
  border-radius: @auth-card-radius;
  overflow: hidden;
  box-shadow: @auth-card-shadow;

  // 注册状态：覆盖层滑到左侧
  &.right-panel-active {
    .login-container {
      transform: translateX(100%);
      opacity: 0;
      z-index: 1;
    }
    .register-container {
      transform: translateX(100%);
      opacity: 1;
      z-index: 5;
    }
    .overlay-container {
      transform: translateX(-100%);
    }
    .overlay {
      transform: translateX(50%);
    }
    .overlay-left {
      transform: translateX(0);
    }
    .overlay-right {
      transform: translateX(20%);
    }
  }
}

// ==================== 表单区域 ====================
.form-container {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 @auth-padding;
  box-sizing: border-box;
  transition: all @auth-transition-duration @transition-timing;
}

.login-container {
  left: 0;
  z-index: 2;
}

.register-container {
  left: 0;
  opacity: 0;
  z-index: 1;
}

.auth-form {
  width: 100%;

  .form-title {
    text-align: center;
    margin: 0 0 @spacing-xl;
    font-size: @font-size-xxl;
    font-weight: 600;
    color: @text-primary;
  }

  .submit-btn {
    width: 100%;
    margin-top: @spacing-sm;
    height: 42px;
    font-size: @font-size-md;
    letter-spacing: 4px;
    border-radius: @border-radius-base;
  }
}

// ==================== 验证码 ====================
.captcha-box {
  display: flex;
  gap: @spacing-sm;
  width: 100%;

  .captcha-img {
    height: 40px;
    width: 120px;
    cursor: pointer;
    border-radius: @border-radius-base;
    flex-shrink: 0;
    border: 1px solid @border-base;
  }

  .captcha-loading {
    width: 120px;
    height: 40px;
    background: @bg-gray;
    text-align: center;
    line-height: 40px;
    border-radius: @border-radius-base;
    color: @text-secondary;
    font-size: @font-size-sm;
    flex-shrink: 0;
  }
}

// ==================== 覆盖层 ====================
.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform @auth-transition-duration @transition-timing;
  z-index: @auth-z-overlay;
}

.overlay {
  position: relative;
  left: -100%;
  width: 200%;
  height: 100%;
  transform: translateX(0);
  transition: transform @auth-transition-duration @transition-timing;
  background: @auth-overlay-gradient;
  color: @bg-white;
}

.overlay-panel {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
  padding: 0 @auth-padding;
  box-sizing: border-box;
  text-align: center;
  transition: transform @auth-transition-duration @transition-timing;

  .overlay-logo {
    width: 64px;
    height: 64px;
    margin-bottom: @spacing-lg;
  }

  .overlay-title {
    font-size: @font-size-xl;
    font-weight: 600;
    margin: 0 0 @spacing-sm;
    letter-spacing: 1px;
  }

  .overlay-desc {
    font-size: @font-size-sm;
    color: @auth-overlay-text;
    margin: 10px 0 @spacing-xxl;
  }

  .overlay-tip {
    font-size: @font-size-base;
    color: @auth-overlay-tip;
    margin: 0 0 @spacing-lg;
  }
}

.overlay-left {
  left: 0;
  transform: translateX(-20%);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

// 覆盖层切换按钮（白色描边）
.ghost-btn {
  width: 140px;
  height: 40px;
  background: transparent;
  border: 1.5px solid @auth-overlay-tip;
  border-radius: @auth-ghost-radius;
  color: @bg-white;
  font-size: @font-size-base;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all @transition-duration;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: @bg-white;
  }
}

// ==================== 移动端切换链接 ====================
.mobile-switch {
  display: none;
  margin-top: @spacing-lg;
  font-size: @font-size-base;
  color: @text-secondary;

  a {
    color: @primary-color;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}

// ==================== 响应式：平板及以下 ====================
@media (max-width: @screen-xs) {
  .auth-container {
    width: 100%;
    max-width: 420px;
    min-height: auto;
  }

  // 移动端不滑动，直接切换显示
  .form-container {
    position: relative;
    width: 100%;
    height: auto;
    padding: 36px 32px;
  }

  .login-container {
    display: none;
  }
  .register-container {
    display: none;
    opacity: 1;
  }

  // 根据状态显示对应表单
  .auth-container:not(.right-panel-active) .login-container {
    display: flex;
    transform: none;
    opacity: 1;
  }
  .auth-container.right-panel-active .register-container {
    display: flex;
    transform: none;
    opacity: 1;
  }

  // 隐藏覆盖层
  .overlay-container {
    display: none;
  }

  // 显示底部切换链接
  .mobile-switch {
    display: block;
  }
}

// ==================== 响应式：手机 ====================
@media (max-width: @screen-xxs) {
  .auth-page {
    padding: @spacing-md;
  }

  .form-container {
    padding: 28px 20px;
  }

  .auth-form .form-title {
    font-size: @font-size-xl;
    margin-bottom: @spacing-lg;
  }

  .captcha-box {
    .captcha-img,
    .captcha-loading {
      width: 90px;
    }
  }
}
</style>
