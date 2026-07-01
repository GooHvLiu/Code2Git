//引入心跳执行模块并获取服务器地址参数
import { createHttpHeartbeat } from "./http-heartbeat.js";

// 全局环境变量，从reg.auth.ejs页面注入，统一配置
const GLOBAL_ENV = window.GLOBAL_ENV || {};
// DOM
const serverStatus = document.getElementById("serverStatus");

// 页面加载初始化
window.onload = async function () {
  console.log("[页面初始化] 页面首次加载完成");
  // 绑定所有启停按钮事件
  bindOperateBtn();
  // 心跳检测
  checkServerConnection();
  // 移除全局自动轮询，不再实时刷接口
};

// 绑定卡片启动/停止/重启按钮点击事件
function bindOperateBtn() {
  // 启动按钮
  document.querySelectorAll(".start-btn").forEach((btn) => {
    btn.onclick = async (e) => {
      e.stopPropagation();
      const pid = btn.closest(".project-card").dataset.pid;
      console.log(`[启动按钮] 点击启动项目ID:${pid}`);
      try {
        const res = await fetch(`/projects/start/${pid}`, { method: "POST" });
        const data = await res.json();
        console.log(`[启动接口返回]`, data);
        alert(`✅ ${data.msg}，等待3秒自动刷新页面同步地址`);
        // 弹窗确认后延时3s刷新，给后端解析日志存bindIp时间
        setTimeout(() => window.location.reload(), 3000);
      } catch (err) {
        console.error("启动接口请求异常", err);
        alert("❌ 请求失败：服务端异常，请查看控制台日志");
      }
    };
  });

  // 停止按钮
  document.querySelectorAll(".stop-btn").forEach((btn) => {
    btn.onclick = async (e) => {
      e.stopPropagation();
      const pid = btn.closest(".project-card").dataset.pid;
      console.log(`[停止按钮] 点击停止项目ID:${pid}`);
      try {
        const res = await fetch(`/projects/stop/${pid}`, { method: "POST" });
        const data = await res.json();
        console.log(`[停止接口返回]`, data);
        alert(`✅ ${data.msg}，等待3秒自动刷新页面同步状态`);
        setTimeout(() => window.location.reload(), 3000);
      } catch (err) {
        console.error("停止接口请求异常", err);
        alert("❌ 请求失败：服务端异常，请查看控制台日志");
      }
    };
  });

  // 重启按钮同理，弹窗延时3秒刷新
  document.querySelectorAll(".restart-btn").forEach((btn) => {
    btn.onclick = async (e) => {
      e.stopPropagation();
      const pid = btn.closest(".project-card").dataset.pid;
      console.log(`[重启按钮] 点击重启项目ID:${pid}`);
      try {
        const res = await fetch(`/projects/restart/${pid}`, {
          method: "POST",
        });
        const data = await res.json();
        console.log(`[重启接口返回]`, data);
        alert(`✅ ${data.msg}，等待3秒自动刷新页面同步最新地址`);
        setTimeout(() => window.location.reload(), 3000);
      } catch (err) {
        console.error("重启接口请求异常", err);
        alert("❌ 请求失败：服务端异常，请查看控制台日志");
      }
    };
  });
}

// 心跳检测（保留不变）
async function checkServerConnection() {
  createHttpHeartbeat({
    url: GLOBAL_ENV.HEARTBEAT_REDIRECT_URL,
    interval: GLOBAL_ENV.HEARTBEAT_INTERVAL,
    timeout: GLOBAL_ENV.HEARTBEAT_TIMEOUT,
    maxFailures: GLOBAL_ENV.MAX_HEARTBEAT_FAIL,
    onSuccess: () => {
      serverStatus.innerHTML = "";
      serverStatus.style.background = "#28a745";
    },
    onFailure: () => {
      serverStatus.innerHTML = "";
      serverStatus.style.background = "#ffc107";
    },
    onError: () => {
      serverStatus.innerHTML = "";
      serverStatus.style.background = "#dc3545";
    },
  });
}

// 退出登录
window.logout = function logout() {
  if (confirm("确定要退出登录吗？")) {
    console.log("[退出登录] 用户确认登出，清空本地存储并跳转");
    // 清空旧版本地存储
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("rememberMe");
    sessionStorage.removeItem("isLoggedIn");
    // 跳转登出接口
    window.location.href = GLOBAL_ENV.LOGOUT_REDIRECT_URL;
  }
};
