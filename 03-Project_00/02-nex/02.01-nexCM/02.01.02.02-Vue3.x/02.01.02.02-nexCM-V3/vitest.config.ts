/**
 * ==========================================
 * Vitest 配置文件
 * ==========================================
 * - 继承 vite.config.ts 的 resolve.alias（@/ → src/）
 * - test.environment = jsdom（组件 / composable / store 测试需要 DOM 与 localStorage）
 * - 仅收集 src 下的 *.test.ts / *.spec.ts
 * - coverage.provider = v8
 *
 * 作者：GooHv
 */
/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    globals: false,
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      include: ['src/utils/**', 'src/composables/**', 'src/store/modules/**']
    }
  }
})
