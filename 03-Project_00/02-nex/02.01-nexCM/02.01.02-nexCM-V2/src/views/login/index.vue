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
          <h2 class="form-title">注册账号</h2>
          <el-form-item prop="username">
            <el-input v-model="registerForm.username" prefix-icon="el-icon-user" placeholder="用户名" autocomplete="off" />
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="registerForm.email" prefix-icon="el-icon-message" placeholder="邮箱" autocomplete="off" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerForm.password" type="password" prefix-icon="el-icon-lock" placeholder="密码" show-password />
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword" type="password" prefix-icon="el-icon-lock" placeholder="确认密码" show-password />
          </el-form-item>
          <el-form-item prop="captchacode">
            <div class="captcha-box">
              <el-input v-model="registerForm.captchacode" prefix-icon="el-icon-key" placeholder="验证码" />
              <img v-if="captchaCodeSrc" :src="captchaCodeSrc" class="captcha-img" @click="getCaptchaCode" />
              <div v-else class="captcha-loading">Loading</div>
            </div>
          </el-form-item>
          <el-button class="submit-btn" type="primary" @click="handleRegister">注 册</el-button>
        </el-form>
      </div>

      <!-- ==================== 登录表单 ==================== -->
      <div class="form-container login-container">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          class="auth-form"
        >
          <h2 class="form-title">欢迎登录</h2>
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" type="text" autocomplete="off" prefix-icon="el-icon-user" placeholder="用户名" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="ruleForm.password" type="password" autocomplete="off" prefix-icon="el-icon-lock" placeholder="密码" />
          </el-form-item>
          <el-form-item prop="captchacode">
            <div class="captcha-box">
              <el-input v-model="ruleForm.captchacode" prefix-icon="el-icon-key" placeholder="验证码" />
              <img
                v-if="captchaCodeSrc"
                :src="captchaCodeSrc"
                class="captcha-img"
                @click="getCaptchaCode"
              />
              <div v-else class="captcha-loading">Loading</div>
            </div>
          </el-form-item>
          <el-button class="submit-btn" type="primary" :loading="loading" @click="submitForm('ruleForm')">登 录</el-button>
        </el-form>
      </div>

      <!-- ==================== 滑动覆盖层 ==================== -->
      <div class="overlay-container">
        <div class="overlay">
          <!-- 左侧覆盖面板（注册状态显示） -->
          <div class="overlay-panel overlay-left">
            <img src="@/assets/images/logo.png" alt="logo" class="overlay-logo" />
            <h1 class="overlay-title">nexCM 管理系统</h1>
            <p class="overlay-desc">移动式灌装加塞设备</p>
            <p class="overlay-tip">已有账号？</p>
            <button class="ghost-btn" @click="switchPanel('login')">立即登录</button>
          </div>
          <!-- 右侧覆盖面板（登录状态显示） -->
          <div class="overlay-panel overlay-right">
            <img src="@/assets/images/logo.png" alt="logo" class="overlay-logo" />
            <h1 class="overlay-title">nexCM 管理系统</h1>
            <p class="overlay-desc">移动式灌装加塞设备</p>
            <p class="overlay-tip">还没有账号？</p>
            <button class="ghost-btn" @click="switchPanel('register')">立即注册</button>
          </div>
        </div>
      </div>

    </div>

    <!-- 移动端底部切换链接 -->
    <div class="mobile-switch">
      <span v-if="!isRegister">还没有账号？<a @click="switchPanel('register')">立即注册</a></span>
      <span v-else>已有账号？<a @click="switchPanel('login')">立即登录</a></span>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import { validateUsername, validatePassword, validateConfirmPassword, validateEmail } from '@/utils/validate'
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  removeSessionStorage
} from '@/utils/storage'
import { LOCALSTORAGE_KEYS, SESSIONSTORAGE_KEYS } from '@/utils/storageKey'
import { requestCaptchaCodeApi, requestLoginApi } from '@/api/login'
import { setToken, getToken } from '@/utils/auth'
import config from '@/config'

export default {
  name: 'Login',
  data() {
    return {
      // 是否注册面板
      isRegister: false,
      loading: false,

      // ========== 登录表单（原有逻辑不动） ==========
      ruleForm: {
        username: '',
        password: '',
        captchacode: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        captchacode: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },

      // ========== 注册表单（UI 先行，功能后续加） ==========
      registerForm: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        captchacode: ''
      },
      registerRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            validateConfirmPassword(this.registerForm.password)(rule, value, callback)
          }, trigger: 'blur' }
        ],
        captchacode: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },

      captchaCodeSrc: ''
    }
  },
  methods: {
    /** 切换登录/注册面板 */
    switchPanel(type) {
      this.isRegister = type === 'register'
      // 切换浏览器标签页标题
      const pageName = this.isRegister ? '注册' : '登录'
      document.title = `${pageName} - ${config.SYSTEM_NAME}`
    },

    /** 获取验证码（登录注册共用） */
    async getCaptchaCode() {
      try {
        const res = await requestCaptchaCodeApi()
        this.ruleForm.captchacode = ''
        this.registerForm.captchacode = ''
        const svgText = res.data.img
        this.captchaCodeSrc = `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`
        setLocalStorage(LOCALSTORAGE_KEYS.CAPTCHA_UUID, res.data.uuid)
      } catch (err) {
        this.captchaCodeSrc = ''
      }
    },

    /** 登录提交（原有逻辑不动） */
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) {
          this.formReset({
            isClearUsername: false,
            isClearPassword: true,
            isClearCode: true,
            isRefreshCaptcha: true
          })
          return
        }

        this.loading = true
        try {
          const res = await requestLoginApi({
            username: this.ruleForm.username,
            password: this.ruleForm.password,
            code: this.ruleForm.captchacode,
            uuid: getLocalStorage(LOCALSTORAGE_KEYS.CAPTCHA_UUID)
          })

          this.formReset({
            isClearUsername: true,
            isClearPassword: true,
            isClearCode: true,
            isRefreshCaptcha: false
          })
          removeLocalStorage(LOCALSTORAGE_KEYS.CAPTCHA_UUID)
          removeSessionStorage(SESSIONSTORAGE_KEYS.TAG_LIST)
          setToken(res.data.token)

          // 跳转：优先 redirect 参数，否则首页
          // 用户信息和动态路由由路由守卫统一获取
          const redirect = this.$route.query.redirect || '/'
          this.$router.push(redirect)
        } catch (err) {
          this.formReset({
            isClearUsername: false,
            isClearPassword: true,
            isClearCode: true,
            isRefreshCaptcha: true
          })
        } finally {
          this.loading = false
        }
      })
    },

    /** 注册提交（功能后续实现，先提示） */
    handleRegister() {
      this.$refs.registerFormRef.validate(valid => {
        if (!valid) return
        this.$message.info('注册功能开发中，敬请期待')
      })
    },

    /** 表单重置（原有逻辑不动） */
    formReset(clear = {}) {
      const {
        isClearUsername = false,
        isClearPassword = false,
        isClearCode = false,
        isRefreshCaptcha = false
      } = clear
      if (isClearUsername) this.ruleForm.username = ''
      if (isClearPassword) this.ruleForm.password = ''
      if (isClearCode) this.ruleForm.captchacode = ''
      if (isRefreshCaptcha) this.getCaptchaCode()
    }
  },
  created() {
    this.getCaptchaCode()
    const token = getToken()
    if (token && this.$route.path !== '/') {
      this.$router.replace('/')
    }
  }
}
</script>

<style scoped lang="less">
// ==================== 页面背景 ====================
.auth-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background: @bg-page;
  box-sizing: border-box;
}

// ==================== 卡片容器 ====================
.auth-container {
  position: relative;
  width: 800px;
  max-width: 100%;
  min-height: 520px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);

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
  padding: 0 40px;
  box-sizing: border-box;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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
    margin: 0 0 28px;
    font-size: 24px;
    font-weight: 600;
    color: @text-primary;
  }

  .submit-btn {
    width: 100%;
    margin-top: 8px;
    height: 42px;
    font-size: 15px;
    letter-spacing: 4px;
    border-radius: @border-radius-base;
  }
}

// ==================== 验证码 ====================
.captcha-box {
  display: flex;
  gap: 10px;
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
    font-size: 13px;
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
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
}

.overlay {
  position: relative;
  left: -100%;
  width: 200%;
  height: 100%;
  transform: translateX(0);
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
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
  padding: 0 40px;
  box-sizing: border-box;
  text-align: center;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);

  .overlay-logo {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
  }

  .overlay-title {
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 8px;
    letter-spacing: 1px;
  }

  .overlay-desc {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    margin: 0 0 32px;
  }

  .overlay-tip {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 16px;
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
  border: 1.5px solid rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  color: #fff;
  font-size: 14px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: #fff;
  }
}

// ==================== 移动端切换链接 ====================
.mobile-switch {
  display: none;
  margin-top: 20px;
  font-size: 14px;
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
@media (max-width: 768px) {
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
@media (max-width: 480px) {
  .auth-page {
    padding: 12px;
  }

  .form-container {
    padding: 28px 20px;
  }

  .auth-form .form-title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .captcha-box {
    .captcha-img,
    .captcha-loading {
      width: 90px;
    }
  }
}
</style>
