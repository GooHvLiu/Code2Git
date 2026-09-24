<!--
  - @Description: 登录注册页面（登录 / 注册双面板 + 忘记密码弹窗）
  - @Author: GooHv
-->
<template>
  <div class="auth-page">
    <div class="auth-container" :class="{ 'right-panel-active': isRegister }">
      <!-- 注册表单 -->
      <div class="form-container register-container">
        <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" class="auth-form register-form">
          <h2 class="form-title">{{ t('layout.login.registerTitle') }}</h2>
          <el-form-item prop="username">
            <el-input v-model="registerForm.username" :placeholder="t('layout.login.username')">
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="registerForm.email" :placeholder="t('layout.login.email')">
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              show-password
              :placeholder="t('layout.login.password')"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              show-password
              :placeholder="t('layout.login.confirmPassword')"
              @keyup.enter="handleRegister"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-button type="primary" class="submit-btn" :loading="loading" @click="handleRegister">
            {{ t('layout.login.registerBtn') }}
          </el-button>
        </el-form>
      </div>

      <!-- 登录表单 -->
      <div class="form-container login-container">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="auth-form login-form">
          <h2 class="form-title">{{ t('layout.login.title') }}</h2>
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" :placeholder="t('layout.login.username')">
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="ruleForm.password"
              type="password"
              show-password
              :placeholder="t('layout.login.password')"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="captchacode">
            <div class="captcha-box">
              <el-input
                v-model="ruleForm.captchacode"
                :placeholder="t('layout.login.captcha')"
                class="captcha-input"
                @keyup.enter="submitForm"
              >
                <template #prefix>
                  <el-icon><Key /></el-icon>
                </template>
              </el-input>
              <div class="captcha-img" @click="getCaptchaCode">
                <img v-if="captchaCodeSrc" :src="captchaCodeSrc" alt="captcha" />
                <span v-else class="captcha-loading">{{ t('layout.login.captchaLoading') }}</span>
              </div>
            </div>
          </el-form-item>
          <div class="forgot-password-link" @click="openForgotDialog">
            {{ t('layout.login.forgotPassword') }}
          </div>
          <el-button type="primary" class="submit-btn" :loading="loading" @click="submitForm">
            {{ t('layout.login.loginBtn') }}
          </el-button>
        </el-form>
      </div>

      <!-- 滑动覆盖层 -->
      <div class="overlay-container">
        <div class="overlay">
          <!-- 登录面板覆盖层（显示在右侧，注册时可见） -->
          <div class="overlay-panel overlay-left">
            <div class="overlay-logo">
              <img :src="logoWhite" alt="logo" />
            </div>
            <h2 class="overlay-title">{{ t('layout.login.loginNow') }}</h2>
            <p class="overlay-desc">{{ config.SYSTEM_NAME }}</p>
            <p class="overlay-tip">{{ t('layout.login.hasAccount') }}</p>
            <el-button class="ghost-btn" @click="switchPanel('login')">
              {{ t('layout.login.loginBtn') }}
            </el-button>
          </div>
          <!-- 注册面板覆盖层（显示在左侧，登录时可见） -->
          <div class="overlay-panel overlay-right">
            <div class="overlay-logo">
              <img :src="logoWhite" alt="logo" />
            </div>
            <h2 class="overlay-title">{{ t('layout.login.registerNow') }}</h2>
            <p class="overlay-desc">{{ config.SYSTEM_DESC }}</p>
            <p class="overlay-tip">{{ t('layout.login.noAccount') }}</p>
            <el-button class="ghost-btn" @click="switchPanel('register')">
              {{ t('layout.login.registerBtn') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端切换按钮 -->
    <div class="mobile-switch">
      <el-button v-if="!isRegister" type="text" class="switch-btn" @click="switchPanel('register')">
        {{ t('layout.login.registerNow') }}
      </el-button>
      <el-button v-else type="text" class="switch-btn" @click="switchPanel('login')">
        {{ t('layout.login.loginNow') }}
      </el-button>
    </div>

    <!-- 忘记密码弹窗 -->
    <el-dialog
      v-model="forgotVisible"
      :title="t('layout.login.forgotPasswordDialog.title')"
      width="560px"
      :close-on-click-modal="false"
      @close="resetForgotForm"
    >
      <el-steps :active="activeStep" finish-status="success" align-center class="reset-steps">
        <el-step :title="t('layout.login.forgotPasswordDialog.stepVerify')" />
        <el-step :title="t('layout.login.forgotPasswordDialog.stepReset')" />
        <el-step :title="t('layout.login.forgotPasswordDialog.stepDone')" />
      </el-steps>

      <!-- 第一步：验证身份 -->
      <el-form v-if="activeStep === 0" ref="forgotFormRef" :model="forgotForm" :rules="forgotRules" class="reset-form">
        <el-form-item :label="t('layout.login.username')" prop="username">
          <el-input
            v-model="forgotForm.username"
            :placeholder="t('layout.login.forgotPasswordDialog.usernamePlaceholder')"
          />
        </el-form-item>
        <el-form-item :label="t('layout.login.email')" prop="email">
          <el-input v-model="forgotForm.email" :placeholder="t('layout.login.forgotPasswordDialog.emailPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('layout.login.captcha')" prop="code">
          <el-input v-model="forgotForm.code" :placeholder="t('layout.login.forgotPasswordDialog.codePlaceholder')" />
        </el-form-item>
        <el-button
          type="primary"
          plain
          class="send-code-btn"
          :disabled="codeCountdown > 0"
          @click="handleSendResetCode"
        >
          {{
            codeCountdown > 0
              ? t('layout.login.forgotPasswordDialog.resendCountdown', { seconds: codeCountdown })
              : t('layout.login.forgotPasswordDialog.sendCode')
          }}
        </el-button>
      </el-form>

      <!-- 第二步：重置密码 -->
      <el-form v-if="activeStep === 1" ref="resetFormRef" :model="forgotForm" :rules="resetRules" class="reset-form">
        <el-form-item :label="t('layout.login.password')" prop="newPassword">
          <el-input
            v-model="forgotForm.newPassword"
            type="password"
            show-password
            :placeholder="t('layout.login.forgotPasswordDialog.newPasswordPlaceholder')"
          />
        </el-form-item>
        <el-form-item :label="t('layout.login.confirmPassword')" prop="confirmPassword">
          <el-input
            v-model="forgotForm.confirmPassword"
            type="password"
            show-password
            :placeholder="t('layout.login.forgotPasswordDialog.confirmPasswordPlaceholder')"
          />
        </el-form-item>
      </el-form>

      <!-- 第三步：完成 -->
      <div v-if="activeStep === 2" class="reset-success">
        <el-icon class="success-icon"><CircleCheckFilled /></el-icon>
        <h3>{{ t('layout.login.forgotPasswordDialog.resetSuccess') }}</h3>
        <p>{{ t('layout.login.forgotPasswordDialog.resetSuccessTip') }}</p>
        <el-button type="primary" @click="goToLogin">
          {{ t('layout.login.forgotPasswordDialog.goLogin') }}
        </el-button>
      </div>

      <template #footer>
        <el-button v-if="activeStep === 0" @click="forgotVisible = false">
          {{ t('layout.login.forgotPasswordDialog.cancelBtn') }}
        </el-button>
        <el-button v-if="activeStep === 0" type="primary" @click="handleVerifyIdentity">
          {{ t('layout.login.forgotPasswordDialog.nextStep') }}
        </el-button>
        <el-button v-if="activeStep === 1" type="primary" @click="handleResetPassword">
          {{ t('layout.login.forgotPasswordDialog.confirmReset') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 登录 / 注册 / 忘记密码
 * - 验证码由后端返回 SVG 文本，前端需拼装 data URI 后再交给 <img>
 * - 登录字段契约：{ username, password, code, uuid, deviceId, deviceName }
 * - 登录/注册失败的错误提示由 request 响应拦截器统一弹出（后端 msg），此处不重复弹
 */
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { User, Lock, Message, Key, CircleCheckFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { requestCaptchaCodeApi, requestLoginApi, requestRegisterApi } from '@/api/login'
import { requestSendResetCodeApi, requestResetPasswordByCodeApi } from '@/api/user'
import { setToken } from '@/utils/auth/auth'
import { getLocalStorage, setLocalStorage, removeLocalStorage, removeSessionStorage } from '@/utils/data/storage'
import { LOCALSTORAGE_KEYS, SESSIONSTORAGE_KEYS } from '@/utils/data/storageKey'
import { validateUsername, validatePassword, validateConfirmPassword, validateEmail } from '@/utils/data/validate'
import { showSuccess, showWarning } from '@/utils/ui/feedback'
import { useUserStore } from '@/store/modules/user'
import { ROUTE_PATHS } from '@/router/constant/pathConstants'
import ws from '@/utils/request/websocket'
import config from '@/config'
import logoWhite from '@/assets/images/logo-white.png'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

/** 是否处于注册面板 */
const isRegister = ref<boolean>(false)
/** 登录按钮 loading */
const loading = ref<boolean>(false)
/** 验证码图片（data URI） */
const captchaCodeSrc = ref<string>('')

/** 登录表单 */
const ruleForm = reactive({
  username: '',
  password: '',
  captchacode: ''
})

/** 注册表单 */
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: ''
})

/** 表单引用 */
const ruleFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()

/** 忘记密码弹窗 */
const forgotVisible = ref<boolean>(false)
const activeStep = ref<number>(0)
const codeCountdown = ref<number>(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

/** 忘记密码表单 */
const forgotForm = reactive({
  username: '',
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})

const forgotFormRef = ref<FormInstance>()
const resetFormRef = ref<FormInstance>()

/** 登录校验规则 */
const rules = computed<FormRules>(() => ({
  username: [
    { required: true, message: t('layout.login.usernameRequired'), trigger: 'blur' },
    { validator: validateUsername, trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('layout.login.passwordRequired'), trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
  captchacode: [{ required: true, message: t('layout.login.captchaRequired'), trigger: 'blur' }]
}))

/** 注册校验规则 */
const registerRules = computed<FormRules>(() => ({
  username: [
    { required: true, message: t('layout.login.usernameRequired'), trigger: 'blur' },
    { validator: validateUsername, trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('layout.login.passwordRequired'), trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: t('layout.login.confirmPasswordRequired'), trigger: 'blur' },
    { validator: validateConfirmPassword(registerForm.password), trigger: 'blur' }
  ],
  email: [
    { required: true, message: t('layout.login.emailRequired'), trigger: 'blur' },
    { validator: validateEmail, trigger: 'blur' }
  ]
}))

/** 忘记密码第一步校验 */
const forgotRules = computed<FormRules>(() => ({
  username: [{ required: true, message: t('layout.login.usernameRequired'), trigger: 'blur' }],
  email: [
    { required: true, message: t('layout.login.emailRequired'), trigger: 'blur' },
    { validator: validateEmail, trigger: 'blur' }
  ],
  code: [{ required: true, message: t('layout.login.captchaRequired'), trigger: 'blur' }]
}))

/** 忘记密码第二步校验 */
const resetRules = computed<FormRules>(() => ({
  newPassword: [
    { required: true, message: t('layout.login.passwordRequired'), trigger: 'blur' },
    {
      validator: (_rule: unknown, value: string, callback: (e?: Error | string) => void) => {
        if (!value || value.length < 8) {
          callback(new Error(t('layout.login.resetPasswordMinLength') as string))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: t('layout.login.confirmPasswordRequired'), trigger: 'blur' },
    { validator: validateConfirmPassword(forgotForm.newPassword), trigger: 'blur' }
  ]
}))

/** 切换登录/注册面板 */
function switchPanel(type: 'login' | 'register'): void {
  isRegister.value = type === 'register'
}

/**
 * 获取图形验证码
 * 后端返回的 img 是 SVG 文本，需编码为 data URI 才能被 <img> 渲染
 */
async function getCaptchaCode(): Promise<void> {
  try {
    captchaCodeSrc.value = ''
    const res = (await requestCaptchaCodeApi()) as {
      data: { img: string; uuid: string }
    }
    if (res.data) {
      const svgText = res.data.img
      captchaCodeSrc.value = `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`
      if (res.data.uuid) {
        setLocalStorage(LOCALSTORAGE_KEYS.CAPTCHA_UUID, res.data.uuid)
      }
    }
  } catch (error) {
    console.error('获取验证码失败:', error)
  }
}

/** 登录提交 */
function submitForm(): void {
  ruleFormRef.value?.validate(async valid => {
    if (!valid) return
    loading.value = true
    try {
      const payload = {
        username: ruleForm.username,
        password: ruleForm.password,
        code: ruleForm.captchacode,
        uuid: getLocalStorage<string>(LOCALSTORAGE_KEYS.CAPTCHA_UUID),
        deviceId: ws.getDeviceId(),
        deviceName: navigator.userAgent
      }
      const res = (await requestLoginApi(payload)) as {
        data: {
          token?: string
          permissions?: string[]
          permissionVersion?: string | number
        }
      }
      if (res.data?.token) {
        setToken(res.data.token)
      }
      // 登录接口若直接返回权限列表则先行缓存（用户信息/动态路由仍由路由守卫统一获取）
      if (Array.isArray(res.data?.permissions)) {
        userStore.setPermissions(res.data.permissions)
      }
      if (res.data?.permissionVersion) {
        userStore.setPermissionVersion(res.data.permissionVersion)
      }
      removeLocalStorage(LOCALSTORAGE_KEYS.CAPTCHA_UUID)
      removeSessionStorage(SESSIONSTORAGE_KEYS.TAG_LIST)
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ROUTE_PATHS.HOME
      router.push(redirect)
    } catch (error) {
      console.error('登录失败:', error)
      ruleFormRef.value?.resetFields()
      getCaptchaCode()
    } finally {
      loading.value = false
    }
  })
}

/** 注册提交 */
function handleRegister(): void {
  registerFormRef.value?.validate(async valid => {
    if (!valid) return
    loading.value = true
    try {
      const res = (await requestRegisterApi({ ...registerForm })) as {
        data?: { username?: string }
      }
      showSuccess(
        t('layout.login.registerSuccess', {
          username: res.data?.username || registerForm.username
        })
      )
      registerFormRef.value?.resetFields()
      switchPanel('login')
    } catch (error) {
      console.error('注册失败:', error)
    } finally {
      loading.value = false
    }
  })
}

/** 打开忘记密码弹窗并重置状态 */
function openForgotDialog(): void {
  forgotVisible.value = true
  activeStep.value = 0
}

/** 重置忘记密码表单 */
function resetForgotForm(): void {
  forgotFormRef.value?.resetFields()
  resetFormRef.value?.resetFields()
  activeStep.value = 0
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  codeCountdown.value = 0
}

/** 发送重置密码验证码 */
function handleSendResetCode(): void {
  forgotFormRef.value?.validateField(['username', 'email'], async valid => {
    if (!valid) return
    try {
      await requestSendResetCodeApi({
        username: forgotForm.username,
        email: forgotForm.email
      })
      showSuccess(t('layout.login.resetCodeSent'))
      codeCountdown.value = 60
      countdownTimer = setInterval(() => {
        codeCountdown.value--
        if (codeCountdown.value <= 0 && countdownTimer) {
          clearInterval(countdownTimer)
          countdownTimer = null
        }
      }, 1000)
    } catch (error) {
      console.error('发送验证码失败:', error)
    }
  })
}

/** 第一步：校验验证码并进入下一步 */
function handleVerifyIdentity(): void {
  forgotFormRef.value?.validateField(['code'], valid => {
    if (!valid) {
      showWarning(t('layout.login.fillCompleteInfo'))
      return
    }
    activeStep.value = 1
  })
}

/** 第二步：提交重置密码 */
function handleResetPassword(): void {
  resetFormRef.value?.validate(async valid => {
    if (!valid) return
    if (forgotForm.newPassword.length < 8) {
      showWarning(t('layout.login.resetPasswordMinLength'))
      return
    }
    try {
      await requestResetPasswordByCodeApi({
        username: forgotForm.username,
        email: forgotForm.email,
        code: forgotForm.code,
        newPassword: forgotForm.newPassword
      })
      activeStep.value = 2
    } catch (error) {
      console.error('重置密码失败:', error)
    }
  })
}

/** 重置完成后回到登录 */
function goToLogin(): void {
  forgotVisible.value = false
  switchPanel('login')
}

onMounted(() => {
  getCaptchaCode()
})
</script>

<style scoped lang="less">
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  background: @bg-page;
  position: relative;
  overflow: hidden;
}

.auth-container {
  position: relative;
  width: @auth-card-width;
  min-height: @auth-card-height;
  background: @bg-white;
  border-radius: @auth-card-radius;
  box-shadow: @auth-card-shadow;
  overflow: hidden;

  * {
    box-sizing: border-box;
  }
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all @auth-transition-duration @transition-timing;
}

.login-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.register-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.auth-container.right-panel-active .login-container {
  transform: translateX(100%);
  opacity: 0;
  z-index: 1;
}

.auth-container.right-panel-active .register-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: showForm 0.6s;
}

@keyframes showForm {
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }
  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}

.auth-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 @auth-padding;
  text-align: center;
  background: @bg-white;
}

.form-title {
  margin: 0 0 @spacing-xl;
  font-size: @font-size-xxl;
  font-weight: 600;
  color: @text-primary;
}

.auth-form :deep(.el-form-item) {
  width: 100%;
  /* 加大行间距，为输入框下方的校验错误提示预留空间 */
  margin-bottom: 24px;
}

.auth-form :deep(.el-input__wrapper) {
  border-radius: @border-radius-base;
  /* 与验证码图片等高（40px），统一所有输入框高度 */
  min-height: 40px;
  height: 40px;
  /* 增大左右内边距：prefix 图标为 wrapper flex 流子项，整体随 wrapper 内边距右移，
     避免图标与输入文字紧贴左侧边框 */
  padding-top: 1px;
  padding-bottom: 1px;
  padding-left: 15px;
  padding-right: 15px;
}

.auth-form :deep(.el-input__inner) {
  height: 40px;
  line-height: 40px;
}

/* 校验错误提示与输入框、下一行保持合适间距 */
.auth-form :deep(.el-form-item__error) {
  padding-top: 4px;
  font-size: @font-size-xs;
}

.submit-btn {
  width: 100%;
  height: 40px;
  margin-top: @spacing-sm;
  border-radius: @border-radius-base;
  letter-spacing: 2px;
}

.forgot-password-link {
  width: 100%;
  text-align: right;
  font-size: @font-size-xs;
  color: @text-secondary;
  cursor: pointer;
  margin-bottom: @spacing-md;
  transition: color @transition-duration @transition-timing;

  &:hover {
    color: @primary-color;
  }
}

.captcha-box {
  display: flex;
  gap: @spacing-sm;
  width: 100%;
  align-items: center;
}

.captcha-input {
  flex: 1;
}

.captcha-img {
  width: 120px;
  height: 40px;
  flex-shrink: 0;
  border: 1px solid @border-base;
  border-radius: @border-radius-base;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: @bg-gray;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .captcha-loading {
    font-size: @font-size-xs;
    color: @text-secondary;
  }
}

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

.auth-container.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.overlay {
  position: relative;
  left: -100%;
  width: 200%;
  height: 100%;
  background: @auth-overlay-gradient;
  color: #fff;
  transform: translateX(0);
  transition: transform @auth-transition-duration @transition-timing;
}

.auth-container.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 50%;
  padding: 0 @spacing-xl;
  text-align: center;
  transition: transform @auth-transition-duration @transition-timing;
}

.overlay-left {
  transform: translateX(-20%);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.auth-container.right-panel-active .overlay-left {
  transform: translateX(0);
}

.auth-container.right-panel-active .overlay-right {
  transform: translateX(20%);
}

.overlay-logo {
  width: 56px;
  height: 56px;
  margin-bottom: @spacing-lg;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.overlay-title {
  margin: 0 0 @spacing-md;
  font-size: @font-size-xl;
  font-weight: 600;
  color: #fff;
}

.overlay-desc {
  margin: 0 0 @spacing-sm;
  font-size: @font-size-base;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.6;
}

.overlay-tip {
  margin: 0 0 @spacing-xl;
  font-size: @font-size-sm;
  color: @auth-overlay-tip;
}

.ghost-btn {
  width: 140px;
  border: 1px solid #fff;
  background: transparent;
  color: #fff;
  border-radius: @auth-ghost-radius;
  letter-spacing: 2px;

  &:hover,
  &:focus {
    background: rgba(255, 255, 255, 0.16);
    border-color: #fff;
    color: #fff;
  }
}

.mobile-switch {
  display: none;
  margin-top: @spacing-lg;
}

.reset-steps {
  margin-bottom: @spacing-xl;
}

.reset-form {
  .send-code-btn {
    width: 100%;
    margin-top: @spacing-xs;
  }
}

.reset-success {
  text-align: center;
  padding: @spacing-lg 0;

  .success-icon {
    font-size: 60px;
    color: @success-color;
    margin-bottom: @spacing-md;
  }

  h3 {
    margin: 0 0 @spacing-sm;
    color: @text-primary;
    font-size: @font-size-md;
  }

  p {
    margin: 0 0 @spacing-lg;
    color: @text-secondary;
    font-size: @font-size-sm;
  }
}

@media (max-width: @screen-xxs) {
  .auth-container {
    width: calc(100vw - @spacing-xl);
    min-height: auto;
  }

  .overlay-container {
    display: none;
  }

  .form-container {
    position: relative;
    width: 100%;
    height: auto;
    padding: @spacing-xl 0;
  }

  .login-container,
  .register-container {
    display: none;
  }

  .auth-container.right-panel-active .register-container,
  .auth-container:not(.right-panel-active) .login-container {
    display: block;
    transform: none;
    opacity: 1;
  }

  .mobile-switch {
    display: block;
  }
}

@media (min-width: @screen-xxs) and (max-width: @screen-xs) {
  .auth-container {
    width: 90vw;
  }

  .auth-form {
    padding: 0 @spacing-lg;
  }
}
</style>
