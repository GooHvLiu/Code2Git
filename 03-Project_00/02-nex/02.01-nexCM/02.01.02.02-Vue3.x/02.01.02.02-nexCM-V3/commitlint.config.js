/**
 * ==========================================
 * commitlint 配置
 * ==========================================
 * 遵循 Conventional Commits 规范（feat / fix / docs / style / refactor / test / chore ...）
 * 项目 package.json 为 "type": "module"，故使用 ESM 导出
 * 作者：GooHv
 */
export default {
  extends: ['@commitlint/config-conventional']
}
