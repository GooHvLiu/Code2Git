//引入心跳执行模块并获取服务器地址参数
import { createHttpHeartbeat } from "./http-heartbeat.js";

// 全局环境变量，从reg.auth.ejs页面注入，统一配置
const GLOBAL_ENV = window.GLOBAL_ENV || {};

// DOM 元素
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const passwordToggle = document.getElementById("passwordToggle");
const loginBtn = document.getElementById("loginBtn");
const alertBox = document.getElementById("alertBox");
const serverStatus = document.getElementById("serverStatus");
// 新增DOM节点
const forgetPwdBtn = document.getElementById("forgetPwdBtn");

// 表单,用户名和密码验证
function validateForm() {
  let isValid = true;

  // 验证用户名
  if (usernameInput.value.trim() === "") {
    showError("usernameError", "请输入用户名");
    isValid = false;
  } else {
    hideError("usernameError");
  }

  // 验证密码
  if (passwordInput.value.trim() === "") {
    showError("passwordError", "请输入密码");
    isValid = false;
  } else if (passwordInput.value.length < 6) {
    showError("passwordError", "密码至少6位");
    isValid = false;
  } else {
    hideError("passwordError");
  }

  return isValid;
}

// 显示错误信息
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.classList.add("show");

  // 高亮输入框
  const inputElement = document.getElementById(elementId.replace("Error", ""));
  if (inputElement) {
    inputElement.classList.add("error");
  }
}

// 隐藏错误信息
function hideError(elementId) {
  const errorElement = document.getElementById(elementId);
  errorElement.classList.remove("show");

  const inputElement = document.getElementById(elementId.replace("Error", ""));
  if (inputElement) {
    inputElement.classList.remove("error");
  }
}

// 显示提示信息
function showAlert(message, type = "error") {
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type} show`;

  // 3秒后自动隐藏
  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 3000);
}

// 切换密码可见性
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

// 表单提交，拦截校验，校验通过原生提交，禁用fetch
loginForm.addEventListener("submit", function (e) {
  // 校验不通过阻止提交
  if (!validateForm()) {
    e.preventDefault();
    return;
  }
  // 校验通过，不阻止默认表单POST提交，原生跳转
  loginBtn.classList.add("loading");
  loginBtn.disabled = true;
});

// 用户输入框实时验证
usernameInput.addEventListener("input", function () {
  if (this.value.trim() !== "") {
    hideError("usernameError");
  }
});

// 密码输入框实时验证
passwordInput.addEventListener("input", function () {
  if (this.value.trim() !== "") {
    hideError("passwordError");
  }
});

// 页面加载初始化
window.addEventListener("load", async function () {
  // 读取后端返回的注册错误提示
  if (window.LOGIN_ERROR_MSG) {
    showAlert(window.LOGIN_ERROR_MSG, "error");
    // 清空两个密码框，用户名、邮箱保留
    passwordInput.value = "";
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

// 忘记密码点击事件：增加判空，关闭功能时不绑定报错
if (forgetPwdBtn) {
  forgetPwdBtn.addEventListener("click", showForgotPassword);
}

// 显示忘记密码
function showForgotPassword(e) {
  e.preventDefault();
  alert("忘记密码功能开发中，请联系管理员重置密码");
}
