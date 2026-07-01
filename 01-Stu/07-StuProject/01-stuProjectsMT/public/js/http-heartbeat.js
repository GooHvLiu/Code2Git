/**
 * HTTP 心跳检测模块
 * 使用方式：
 *   import { createHttpHeartbeat, updateServerStatus } from './http-heartbeat.js';
 */

/**
 * 创建 HTTP 心跳检测实例
 * @param {Object} options - 配置选项
 * @param {string} options.url - 心跳接口地址（必填）
 * @param {number} [options.interval=30000] - 心跳间隔（毫秒），默认 30 秒
 * @param {number} [options.timeout=10000] - 超时时间（毫秒），默认 10 秒
 * @param {number} [options.maxFailures=3] - 最大失败次数，默认 3 次
 * @param {string} [options.method='GET'] - 请求方法，默认 GET
 * @param {Object} [options.headers={}] - 请求头
 * @param {Object} [options.body=null] - 请求体（仅 POST/PUT 有效）
 * @param {boolean} [options.autoStart=true] - 是否自动启动心跳
 * @param {Function} [options.onSuccess] - 心跳成功回调 (data, response)
 * @param {Function} [options.onFailure] - 心跳失败回调 (error)
 * @param {Function} [options.onError] - 心跳错误回调 (error, failureCount)
 * @param {Function} [options.onReconnect] - 重连成功回调
 * @returns {Object} - HTTP 心跳实例
 */
export function createHttpHeartbeat(options = {}) {
  const {
    url,
    interval = 30000,
    timeout = 10000,
    maxFailures = 3,
    method = "GET",
    headers = {},
    body = null,
    autoStart = true,
    onSuccess = null,
    onFailure = null,
    onError = null,
    onReconnect = null,
  } = options;

  // 验证必填参数
  if (!url) {
    throw new Error("[HTTP Heartbeat] URL is required");
  }

  let timer = null;
  let failureCount = 0;
  let successCount = 0;
  let isRunning = false;
  let lastResponse = null;
  let lastError = null;

  /**
   * 启动心跳检测
   */
  function start() {
    if (isRunning) {
      console.warn("[HTTP Heartbeat] 心跳检测已在运行中");
      return;
    }

    console.log("🚀 [HTTP Heartbeat] 启动心跳检测...");
    isRunning = true;
    failureCount = 0;
    sendHeartbeat();
  }

  /**
   * 停止心跳检测
   */
  function stop() {
    if (!isRunning) {
      console.warn("[HTTP Heartbeat] 心跳检测未运行");
      return;
    }

    console.log("🛑 [HTTP Heartbeat] 停止心跳检测...");
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    isRunning = false;
    failureCount = 0;
  }

  /**
   * 发送心跳请求
   */
  async function sendHeartbeat() {
    if (!isRunning) return;

    try {
      console.log("💓 [HTTP Heartbeat] 发送心跳请求...");

      // 创建 AbortController 用于超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeout);

      // 构建请求配置
      const fetchOptions = {
        method: method.toUpperCase(),
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      };

      // 如果是 POST/PUT/DELETE，添加 body
      if (["POST", "PUT", "DELETE"].includes(method.toUpperCase())) {
        fetchOptions.body = body ? JSON.stringify(body) : null;
      }

      // 发送请求
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      // 检查 HTTP 状态码
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      // 解析响应数据
      const data = await response.json();
      lastResponse = data;
      successCount++;
      failureCount = 0;

      // console.log("✅ [HTTP Heartbeat] 心跳成功", data);
      console.log("✅ [HTTP Heartbeat] 心跳成功");

      // 触发成功回调
      if (typeof onSuccess === "function") {
        onSuccess(data, response);
      }

      // 如果之前失败过，现在成功了，触发重连回调
      if (failureCount === 0 && successCount > 1) {
        if (typeof onReconnect === "function") {
          onReconnect(data);
        }
      }
    } catch (error) {
      failureCount++;
      lastError = error;

      console.error(
        `❌ [HTTP Heartbeat] 心跳失败 (${failureCount}/${maxFailures}):`,
        error.message,
      );

      // 触发错误回调
      if (typeof onError === "function") {
        onError(error, failureCount);
      }

      // 达到最大失败次数
      if (failureCount >= maxFailures) {
        console.error("🚨 [HTTP Heartbeat] 连接断开，达到最大失败次数");

        // 触发失败回调
        if (typeof onFailure === "function") {
          onFailure(error);
        }

        // 停止心跳
        stop();
        return;
      }
    } finally {
      // 如果还在运行，设置下一次心跳
      if (isRunning) {
        timer = setTimeout(sendHeartbeat, interval);
      }
    }
  }

  /**
   * 手动触发一次心跳
   */
  function trigger() {
    if (!isRunning) {
      console.warn("[HTTP Heartbeat] 心跳检测未运行，无法手动触发");
      return;
    }

    console.log("🔄 [HTTP Heartbeat] 手动触发心跳...");
    if (timer) {
      clearTimeout(timer);
    }
    sendHeartbeat();
  }

  /**
   * 获取当前状态
   */
  function getStatus() {
    return {
      isRunning,
      failureCount,
      successCount,
      lastResponse,
      lastError,
      url,
      interval,
      timeout,
      maxFailures,
    };
  }

  /**
   * 重置失败计数
   */
  function resetFailures() {
    failureCount = 0;
    console.log("[HTTP Heartbeat] 失败计数已重置");
  }

  // 自动启动
  if (autoStart) {
    start();
  }

  // 返回公共 API
  return {
    start,
    stop,
    trigger,
    resetFailures,
    getStatus,
    getFailureCount: () => failureCount,
    getSuccessCount: () => successCount,
    getLastResponse: () => lastResponse,
    getLastError: () => lastError,
    isRunning: () => isRunning,
    isConnected: () => isRunning && failureCount === 0,
  };
}

/**
 * 更新服务器状态显示
 * @param {string|HTMLElement} element - 状态显示元素或选择器
 * @param {boolean} isConnected - 是否连接成功
 * @param {Object} [options] - 配置选项
 * @param {string} [options.successText='Connection Successful'] - 连接成功文本
 * @param {string} [options.failureText='Connection Failed'] - 连接失败文本
 * @param {string} [options.connectingText='Connecting...'] - 连接中文本
 */
export function updateServerStatus(element, isConnected, options = {}) {
  const {
    successText = "Connection Successful",
    failureText = "Connection Failed",
    connectingText = "Connecting...",
  } = options;

  // 获取 DOM 元素
  let statusElement;
  if (typeof element === "string") {
    statusElement = document.querySelector(element);
  } else {
    statusElement = element;
  }

  if (!statusElement) {
    console.warn("[HTTP Heartbeat] 未找到状态显示元素:", element);
    return;
  }

  // 根据连接状态更新显示
  if (isConnected) {
    // 连接成功 - 绿色
    statusElement.innerHTML = `
      <i class="fas fa-circle" style="color: #28a745; font-size: 0.6rem; margin-right: 5px;"></i>
      ${successText}
    `;
    statusElement.style.color = "#28a745";
  } else {
    // 连接失败 - 黄色/红色
    statusElement.innerHTML = `
      <i class="fas fa-circle" style="color: #dc3545; font-size: 0.6rem; margin-right: 5px;"></i>
      ${failureText}
    `;
    statusElement.style.color = "#dc3545";
  }
}

/**
 * 创建带状态显示的 HTTP 心跳实例（快捷方式）
 * @param {Object} options - 配置选项
 * @param {string} options.url - 心跳接口地址
 * @param {string} options.statusElement - 状态显示元素选择器
 * @param {Object} [options.heartbeatOptions] - createHttpHeartbeat 的其他选项
 * @returns {Object} - HTTP 心跳实例
 */
export function createHttpHeartbeatWithStatus(options = {}) {
  const { url, statusElement, heartbeatOptions = {} } = options;

  if (!url) {
    throw new Error("[HTTP Heartbeat] URL is required");
  }

  if (!statusElement) {
    throw new Error("[HTTP Heartbeat] statusElement is required");
  }

  // 创建心跳实例
  const heartbeat = createHttpHeartbeat({
    url,
    ...heartbeatOptions,
    onSuccess: (data, response) => {
      updateServerStatus(statusElement, true);
      // 调用用户自定义的 onSuccess
      if (typeof heartbeatOptions.onSuccess === "function") {
        heartbeatOptions.onSuccess(data, response);
      }
    },
    onFailure: (error) => {
      updateServerStatus(statusElement, false);
      // 调用用户自定义的 onFailure
      if (typeof heartbeatOptions.onFailure === "function") {
        heartbeatOptions.onFailure(error);
      }
    },
    onError: (error, failureCount) => {
      // 如果是第一次失败，显示警告状态
      if (failureCount === 1) {
        const statusEl =
          typeof statusElement === "string"
            ? document.querySelector(statusElement)
            : statusElement;

        if (statusEl) {
          statusEl.innerHTML = `
            <i class="fas fa-circle" style="color: #ffc107; font-size: 0.6rem; margin-right: 5px;"></i>
            Connection Unstable
          `;
          statusEl.style.color = "#ffc107";
        }
      }

      // 调用用户自定义的 onError
      if (typeof heartbeatOptions.onError === "function") {
        heartbeatOptions.onError(error, failureCount);
      }
    },
  });

  return heartbeat;
}

// 默认导出
export default {
  createHttpHeartbeat,
  updateServerStatus,
  createHttpHeartbeatWithStatus,
};
