/**
 * ==========================================
 * Vite 配置文件
 * ==========================================
 * 由原 vue.config.js（Vue CLI）等价迁移而来，保留以下特色：
 * 1. 启动前从 theme-variables.config 生成 _theme_vars.less（JS/Less 共享主题变量）
 * 2. 全局注入 variables.less / _theme_vars.less / mixin.less
 * 3. svg-sprite → vite-plugin-svg-icons（symbolId = icon-文件名）
 * 4. devServer host 0.0.0.0 port 8082，proxy /prod-api 与 /ws-api(ws:true)
 * 5. 生产分包（vue/element/libs）+ drop console/debugger
 * 6. alias @ → src
 */
/// <reference types="vite/client" />
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 启动前生成主题变量文件（必须在 less 注入前完成）
import './build/generate-theme-vars'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = Number(env.VITE_PORT) || 8082
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://127.0.0.1:3002'
  // 接口代理前缀（VITE_BASE_API 形如 /prod-api/v2，代理匹配前缀取到 /prod-api）
  const baseApiPrefix = (env.VITE_BASE_API || '/prod-api/v2').split('/').filter(Boolean)[0] || 'prod-api'

  return {
    base: env.VITE_PUBLIC_PATH || '/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: (source: string, filePath: string) => {
            // 只对项目内 less 注入，避免重复注入 element-plus 的 less
            if (filePath.includes('node_modules')) return source
            const vars = path.resolve(__dirname, 'src/assets/styles/variables.less')
            const themeVars = path.resolve(__dirname, 'src/assets/styles/_theme_vars.less')
            const mixin = path.resolve(__dirname, 'src/assets/styles/mixin.less')
            return `@import "${vars}";\n@import "${themeVars}";\n@import "${mixin}";\n${source}`
          }
        }
      }
    },
    plugins: [
      vue(),
      // 自动导入 Vue / Vue Router / Pinia / vue-i18n API
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
        dts: 'src/types/auto-imports.d.ts',
        resolvers: [ElementPlusResolver()]
      }),
      // 按需自动注册 Element Plus 组件与图标
      Components({
        dts: 'src/types/components.d.ts',
        resolvers: [
          ElementPlusResolver(),
          // 图标组件自动注册：<ElIconXxx> 不需要手动 import
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (componentName: string): any => {
            if (componentName.startsWith('ElIcon')) {
              return {
                importName: componentName.slice(2),
                path: '@element-plus/icons-vue'
              }
            }
            return undefined
          }
        ]
      }),
      // SVG 雪碧图：按分类子目录分别注册，使 [name] 为纯文件名（不含目录），
      // symbolId 统一为 icon-文件名（如 icon-logo / icon-HomeDash / icon-SuperAdmin / icon-zh-CN）。
      // 注意：新增分类目录时需在此追加，否则该目录图标不会进入雪碧图。
      createSvgIconsPlugin({
        iconDirs: [
          path.resolve(__dirname, 'src/assets/icons/svg/common'),
          path.resolve(__dirname, 'src/assets/icons/svg/menu'),
          path.resolve(__dirname, 'src/assets/icons/svg/avatar'),
          path.resolve(__dirname, 'src/assets/icons/svg/flags')
        ],
        symbolId: 'icon-[name]'
      })
    ],
    server: {
      host: '0.0.0.0',
      port,
      strictPort: false,
      proxy: {
        [`/${baseApiPrefix}`]: {
          target: proxyTarget,
          changeOrigin: true
        },
        '/ws-api': {
          target: proxyTarget,
          changeOrigin: true,
          ws: true
        }
      }
    },
    build: {
      sourcemap: false,
      // 阈值：除 monaco-editor 外所有 chunk 均 < 1500kB。
      // monaco-editor 核心本身体积约 2.7MB（编辑器内核 + 基础语言），仅在打开
      // MonacoEditor 页面时按需加载，不进入首屏，故阈值放宽到 3000 以消除该已知大块警告。
      chunkSizeWarningLimit: 3000,
      rollupOptions: {
        output: {
          manualChunks: {
            // Vue 核心运行时（vue / vue-router / pinia / vue-i18n）
            'vue-vendor': ['vue', 'vue-router', 'pinia', 'vue-i18n'],
            // Element Plus 组件库与图标
            'element-plus': ['element-plus', '@element-plus/icons-vue'],
            // 图表库（仅 Dashboard 等用到，按需加载）
            echarts: ['echarts'],
            // Monaco 代码编辑器核心（仅 MonacoEditor 用到，按需加载）
            monaco: ['monaco-editor'],
            // Excel 导入导出
            xlsx: ['xlsx'],
            // PDF / 截图导出（jspdf + html2canvas）
            pdf: ['jspdf', 'html2canvas']
          }
        }
      }
    },
    esbuild: {
      // 生产环境移除 console / debugger
      drop: mode === 'production' ? ['console', 'debugger'] : []
    },
    optimizeDeps: {
      include: ['@element-plus/icons-vue']
    }
  }
})
