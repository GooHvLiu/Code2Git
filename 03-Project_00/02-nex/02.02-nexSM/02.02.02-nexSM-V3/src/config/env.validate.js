/**
 * ============================================================
 * 环境变量校验模块
 * ------------------------------------------------------------
 * 功能描述：应用启动时校验必需的环境变量是否已配置。
 *           任一必需变量缺失时，打印明确的错误信息并终止进程（exit 1），
 *           避免服务在缺少关键配置的情况下带病启动。
 * 使用方式：在 app.js 顶部（dotenv 加载完成之后）require 本文件即可执行校验。
 * ------------------------------------------------------------
 * 作者：GooHv
 * 创建日期：2026-09-24
 * ============================================================
 */

'use strict';

/**
 * 必需环境变量清单
 * 每项：变量名 + 中文用途说明（用于报错提示）
 */
const REQUIRED_ENV_VARS = [
  { key: 'NODE_ENV', desc: '运行环境（development / production / test）' },
  { key: 'APP_PORT', desc: '服务监听端口' },
  { key: 'DB_HOST', desc: 'MySQL 主机地址' },
  { key: 'DB_PORT', desc: 'MySQL 端口' },
  { key: 'DB_USER', desc: 'MySQL 用户名' },
  { key: 'DB_PASSWORD', desc: 'MySQL 密码' },
  { key: 'DB_NAME', desc: 'MySQL 数据库名' },
  { key: 'JWT_SECRET', desc: 'JWT 签名密钥' },
  { key: 'JWT_EXPIRES_IN', desc: 'JWT 过期时间（如 24h）' }
];

/**
 * 执行环境变量校验
 * 缺失变量时打印错误清单并 process.exit(1)
 */
function validateEnv() {
  const missing = [];

  for (const item of REQUIRED_ENV_VARS) {
    const value = process.env[item.key];
    // 仅判断是否为空/未定义；不做空值合法性之外的推断
    if (value === undefined || value === null || String(value).trim() === '') {
      missing.push(`  - ${item.key}   // ${item.desc}`);
    }
  }

  if (missing.length > 0) {
    console.error('\n========================================================');
    console.error(' 环境变量校验失败：以下必需环境变量未配置');
    console.error('--------------------------------------------------------');
    missing.forEach((line) => console.error(line));
    console.error('--------------------------------------------------------');
    console.error(' 请复制 .env.example 为 .env 并填写上述配置后再启动。');
    console.error('========================================================\n');
    process.exit(1);
  }
}

// 模块加载时立即执行校验
validateEnv();

module.exports = { validateEnv, REQUIRED_ENV_VARS };
