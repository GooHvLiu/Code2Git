//引入心跳执行模块
import { createHttpHeartbeat } from "./http-heartbeat.js";

// 全局环境变量，从reg.auth.ejs页面注入，统一配置
const GLOBAL_ENV = window.GLOBAL_ENV || {};

// DOM元素
const registerForm = document.getElementById("registerForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const rePasswordInput = document.getElementById("rePassword");
const emailInput = document.getElementById("email");
const passwordToggle = document.getElementById("passwordToggle");
const registerBtn = document.getElementById("registerBtn");
const alertBox = document.getElementById("alertBox");
const serverStatus = document.getElementById("serverStatus");
const goLoginBtn = document.getElementById("goLoginBtn");

// 正则校验规则
const usernameReg = /^[A-Za-z0-9]{4,16}$/;
const emailReg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

// 完整表单校验
function validateForm() {
  let isValid = true;

  // 用户名校验
  if (!usernameReg.test(usernameInput.value.trim())) {
    showError("usernameError", "用户名4-16位，仅允许字母数字");
    isValid = false;
  } else {
    hideError("usernameError");
  }

  // 密码长度校验
  const pwdVal = passwordInput.value.trim();
  if (pwdVal.length < 6) {
    showError("passwordError", "密码至少6位字符");
    isValid = false;
  } else {
    hideError("passwordError");
  }

  // 确认密码一致性
  if (rePasswordInput.value.trim() !== pwdVal) {
    showError("rePasswordError", "两次输入密码不一致");
    isValid = false;
  } else {
    hideError("rePasswordError");
  }

  // 邮箱非空则校验格式
  const emailVal = emailInput.value.trim();
  if (emailVal && !emailReg.test(emailVal)) {
    showError("emailError", "请输入合法邮箱地址");
    isValid = false;
  } else {
    hideError("emailError");
  }

  return isValid;
}

// 输入框错误提示
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.classList.add("show");
  const inputElement = document.getElementById(elementId.replace("Error", ""));
  if (inputElement) inputElement.classList.add("error");
}

// 清除输入框错误
function hideError(elementId) {
  const errorElement = document.getElementById(elementId);
  errorElement.classList.remove("show");
  const inputElement = document.getElementById(elementId.replace("Error", ""));
  if (inputElement) inputElement.classList.remove("error");
}

// 顶部全局提示弹窗
function showAlert(message, type = "error") {
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type} show`;
  setTimeout(() => alertBox.classList.remove("show"), 3000);
}

// 密码显隐切换
passwordToggle.addEventListener("click", function () {
  const type = passwordInput.getAttribute("type");
  if (type === "password") {
    passwordInput.setAttribute("type", "text");
    passwordToggle.classList.remove("fa-eye");
    passwordToggle.classList.add("fa-eye-slash");
  } else {
    passwordInput.setAttribute("type", "password");
    passwordToggle.classList.remove("fa-eye-slash");
    passwordToggle.classList.add("fa-eye");
  }
});

// 表单提交拦截校验，校验通过原生POST提交
registerForm.addEventListener("submit", function (e) {
  if (!validateForm()) {
    e.preventDefault();
    return;
  }
  registerBtn.classList.add("loading");
  registerBtn.disabled = true;
});

// 输入实时清除错误
usernameInput.addEventListener("input", () => hideError("usernameError"));
passwordInput.addEventListener("input", () => hideError("passwordError"));
rePasswordInput.addEventListener("input", () => hideError("rePasswordError"));
emailInput.addEventListener("input", () => hideError("emailError"));

// 页面加载初始化
window.addEventListener("load", async function () {
  // 读取后端返回的注册错误提示
  if (window.LOGIN_ERROR_MSG) {
    showAlert(window.LOGIN_ERROR_MSG, "error");
    // 清空两个密码框，用户名、邮箱保留
    passwordInput.value = "";
    rePasswordInput.value = "";
    // 清除标记，刷新不再重复弹窗
    delete window.LOGIN_ERROR_MSG;
  }

  // 页面加载后再异步获取服务信息，规避顶层await
  try {
    checkServerConnection();
  } catch (err) {
    console.error("初始化心跳服务信息失败", err);
    serverStatus.innerHTML =
      '<i class="fas fa-circle" style="color: #dc3545; font-size: 0.6rem;"></i> Get Server Info Fail';
  }
});

// 心跳检测服务器状态
async function checkServerConnection() {
  createHttpHeartbeat({
    url: GLOBAL_ENV.HEARTBEAT_REDIRECT_URL,
    interval: GLOBAL_ENV.HEARTBEAT_INTERVAL,
    timeout: GLOBAL_ENV.HEARTBEAT_TIMEOUT,
    maxFailures: GLOBAL_ENV.MAX_HEARTBEAT_FAIL,
    onSuccess: (data) => {
      serverStatus.innerHTML =
        '<i class="fas fa-circle" style="color: #28a745; font-size: 0.6rem;"></i> Connection Successful';
    },
    onFailure: (error) => {
      serverStatus.innerHTML =
        '<i class="fas fa-circle" style="color: #ffc107; font-size: 0.6rem;"></i> Connection failed';
    },
    onError: (error, count) => {
      serverStatus.innerHTML =
        '<i class="fas fa-circle" style="color: #ffc107; font-size: 0.6rem;"></i> Connection failed';
    },
  });
}

// 快捷键登录（按Enter键）
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !loginBtn.disabled) {
    loginForm.requestSubmit();
  }
});

// 跳转登录点击事件（使用环境变量配置地址，取消硬编码）
goLoginBtn.addEventListener("click", () => {
  window.location.href = GLOBAL_ENV.LOGIN_REDIRECT_URL;
});
