/**
 * 前端工程根路径统一解析
 *
 * 背景：前端目录由旧的平级结构 02.01-nexCM/02.01.02-nexCM-V3
 *      重组为 Vue2 / Vue3 分层结构：
 *        02.01-nexCM/02.01.02.01-Vue2.x/02.01.02.01-nexCM-V3
 *        02.01-nexCM/02.01.02.02-Vue3.x/02.01.02.02-nexCM-V3
 *      i18n-manager / translation 等模块需要直接读写前端语言包与翻译配置文件，
 *      若各处硬编码相对路径，目录调整后会整体失效（语言列表为空、翻译密钥读不到等）。
 *
 * 约定：
 *   - 默认指向 Vue3 迁移目标工程（当前主线）。
 *   - 可通过环境变量 FRONTEND_ROOT 覆盖为任意前端工程的绝对路径，
 *     例如需要让同一后端服务旧 Vue2 工程时：FRONTEND_ROOT=<Vue2 工程绝对路径>。
 */
'use strict'

const path = require('path')

// 本文件位于 <后端>/src/config/frontend-root.js，需上溯 4 级到达 02-nex 目录
const DEFAULT_FRONTEND_ROOT = path.resolve(
  __dirname,
  '../../../../02.01-nexCM/02.01.02.02-Vue3.x/02.01.02.02-nexCM-V3'
)

const FRONTEND_ROOT = process.env.FRONTEND_ROOT
  ? path.resolve(process.env.FRONTEND_ROOT)
  : DEFAULT_FRONTEND_ROOT

module.exports = {
  FRONTEND_ROOT,
  DEFAULT_FRONTEND_ROOT
}
