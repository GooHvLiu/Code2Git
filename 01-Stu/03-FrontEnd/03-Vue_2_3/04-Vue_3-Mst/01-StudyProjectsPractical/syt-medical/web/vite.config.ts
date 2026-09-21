import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";
import path from "path";

// defineConfig 采用函数写法，可以拿到 mode 和 command
export default defineConfig(({ mode }) => {
  // 在这里加载环境变量
  const env = loadEnv(mode, process.cwd(), "");
  console.log("当前mode：", mode);
  console.log("代理目标地址：", env.VITE_APP_PROXY_TARGET);

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src")
      }
    },
    server: {
      proxy: {
        // 匹配 /api 开头的请求
        "/api": {
          // env 文件中的字段：VITE_APP_PROXY_TARGET = http://127.0.0.1:8201
          target: env.VITE_APP_PROXY_TARGET,
          // 开启跨域
          changeOrigin: true
        }
      }
    }
  };
});
