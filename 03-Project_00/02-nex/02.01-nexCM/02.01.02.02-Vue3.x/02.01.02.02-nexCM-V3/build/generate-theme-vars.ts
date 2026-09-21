/**
 * ==========================================
 * 主题变量生成器（Vite 启动前同步执行）
 * ==========================================
 * 读取 src/config/theme-variables.config.ts，自动转成 Less 变量写入
 * src/assets/styles/_theme_vars.less。必须在 vite.config 加载 less 注入前完成，
 * 否则 additionalData 引用的文件不存在会报错。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import themeVariables from '../src/config/theme-variables.config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputPath = path.resolve(__dirname, '../src/assets/styles/_theme_vars.less')

/**
 * 生成 _theme_vars.less 文件
 * 只有内容真正变化时才写入，避免触发不必要的 HMR
 */
export function generateThemeVars(): void {
  const content = [
    '/**',
    ' * 自动生成文件，请勿手动编辑',
    ' * 由 build/generate-theme-vars.ts 从 src/config/theme-variables.config.ts 生成',
    ' * 修改颜色请编辑 theme-variables.config.ts',
    ' */',
    ...Object.entries(themeVariables).map(([key, value]) => `@${key}: ${value};`)
  ].join('\n') + '\n'

  let existing = ''
  try {
    existing = fs.readFileSync(outputPath, 'utf-8')
  } catch {
    // 文件不存在时继续写入
  }
  if (existing !== content) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, content, 'utf-8')
  }
}

// 直接被 vite.config 引入时立即执行一次
generateThemeVars()
