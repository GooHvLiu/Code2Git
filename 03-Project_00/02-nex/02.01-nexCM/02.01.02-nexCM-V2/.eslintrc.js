/**
 * .eslintrc.js - ESLint 代码检查配置
 * 
 * 规则：
 * - 继承 Vue 推荐规则和 ESLint 推荐规则
 * - 使用 babel-eslint 解析器
 * - 生产环境禁止 console 和 debugger
 */
module.exports = {
  root: true, // 停止向上查找配置
  env: {
    node: true // 启用 Node.js 全局变量
  },
  extends: [
    'plugin:vue/essential', // Vue 基础规则
    'eslint:recommended' // ESLint 推荐规则
  ],
  parserOptions: {
    parser: 'babel-eslint' // 使用 babel-eslint 解析器
  },
  rules: {
    // 生产环境不允许 console，开发环境允许
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 生产环境不允许 debugger
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 允许未使用的变量（开发阶段方便）
    'no-unused-vars': 'off'
  }
}
