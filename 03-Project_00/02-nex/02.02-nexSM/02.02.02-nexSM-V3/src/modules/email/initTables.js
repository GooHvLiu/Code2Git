/**
 * 邮箱模块数据库表初始化脚本
 * 包含：邮箱配置表、邮件发送记录表、密码重置Token表
 */

// 加载环境变量
require('dotenv-expand').expand(require('dotenv').config());

const { query } = require('../../db/index');

async function initEmailTables() {
  console.log('📧 开始初始化邮箱模块数据库表...');

  try {
    // 1. 邮箱配置表
    console.log('1. 创建邮箱配置表 nex_email_config...');
    await query(`
      CREATE TABLE IF NOT EXISTS \`nex_email_config\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(64) NOT NULL COMMENT '配置名称',
        \`provider\` VARCHAR(32) NOT NULL DEFAULT 'custom' COMMENT '服务商：qq/163/126/gmail/outlook/custom',
        \`host\` VARCHAR(128) NOT NULL COMMENT 'SMTP服务器地址',
        \`port\` INT NOT NULL DEFAULT 465 COMMENT 'SMTP端口',
        \`secure\` TINYINT DEFAULT 1 COMMENT '是否使用SSL 0-否 1-是',
        \`username\` VARCHAR(128) NOT NULL COMMENT '邮箱账号',
        \`password\` VARCHAR(512) NOT NULL COMMENT '邮箱授权码（AES加密存储）',
        \`from_name\` VARCHAR(64) DEFAULT '' COMMENT '发件人名称',
        \`is_default\` TINYINT DEFAULT 0 COMMENT '是否为默认配置 0-否 1-是',
        \`status\` TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
        \`is_delete\` TINYINT DEFAULT 0 COMMENT '是否删除 0-未删除 1-已删除',
        \`remark\` VARCHAR(255) DEFAULT '' COMMENT '备注',
        \`create_by\` VARCHAR(64) DEFAULT '' COMMENT '创建人',
        \`create_time\` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        \`update_time\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        INDEX \`idx_provider\` (\`provider\`),
        INDEX \`idx_is_default\` (\`is_default\`),
        INDEX \`idx_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='邮箱配置表';
    `);
    console.log('   ✅ 邮箱配置表创建成功');

    // 2. 邮件发送记录表
    console.log('2. 创建邮件发送记录表 nex_email_log...');
    await query(`
      CREATE TABLE IF NOT EXISTS \`nex_email_log\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`config_id\` INT DEFAULT 0 COMMENT '使用的邮箱配置ID（0表示系统默认）',
        \`config_name\` VARCHAR(64) DEFAULT '' COMMENT '使用的邮箱配置名称',
        \`to_email\` VARCHAR(128) NOT NULL COMMENT '收件人邮箱',
        \`cc_email\` VARCHAR(500) DEFAULT '' COMMENT '抄送邮箱（多个用逗号分隔）',
        \`subject\` VARCHAR(255) NOT NULL COMMENT '邮件主题',
        \`template\` VARCHAR(64) DEFAULT '' COMMENT '使用的模板',
        \`content\` TEXT COMMENT '邮件内容（HTML）',
        \`status\` TINYINT DEFAULT 0 COMMENT '发送状态 0-待发送 1-成功 2-失败',
        \`error_msg\` VARCHAR(500) DEFAULT '' COMMENT '失败原因',
        \`retry_count\` INT DEFAULT 0 COMMENT '重试次数',
        \`send_duration\` INT DEFAULT 0 COMMENT '发送耗时（毫秒）',
        \`ip\` VARCHAR(64) DEFAULT '' COMMENT '请求IP',
        \`create_time\` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        \`send_time\` DATETIME DEFAULT NULL COMMENT '发送时间',
        INDEX \`idx_to_email\` (\`to_email\`),
        INDEX \`idx_status\` (\`status\`),
        INDEX \`idx_config_id\` (\`config_id\`),
        INDEX \`idx_create_time\` (\`create_time\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='邮件发送记录表';
    `);
    console.log('   ✅ 邮件发送记录表创建成功');

    // 3. 密码重置Token表
    console.log('3. 创建密码重置Token表 nex_password_reset_token...');
    await query(`
      CREATE TABLE IF NOT EXISTS \`nex_password_reset_token\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`user_id\` INT NOT NULL COMMENT '用户ID',
        \`username\` VARCHAR(64) NOT NULL COMMENT '用户名',
        \`email\` VARCHAR(128) NOT NULL COMMENT '邮箱',
        \`token\` VARCHAR(128) NOT NULL COMMENT '重置Token',
        \`expires_at\` DATETIME NOT NULL COMMENT '过期时间',
        \`used\` TINYINT DEFAULT 0 COMMENT '是否已使用 0-未使用 1-已使用',
        \`used_at\` DATETIME DEFAULT NULL COMMENT '使用时间',
        \`ip\` VARCHAR(64) DEFAULT '' COMMENT '请求IP',
        \`user_agent\` VARCHAR(500) DEFAULT '' COMMENT '请求User-Agent',
        \`create_time\` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        INDEX \`idx_token\` (\`token\`),
        INDEX \`idx_user_id\` (\`user_id\`),
        INDEX \`idx_email\` (\`email\`),
        INDEX \`idx_expires_at\` (\`expires_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='密码重置Token表';
    `);
    console.log('   ✅ 密码重置Token表创建成功');

    console.log('\n🎉 邮箱模块数据库表初始化完成！');
    return true;
  } catch (err) {
    console.error('❌ 邮箱模块数据库表初始化失败:', err.message);
    throw err;
  }
}

// 如果直接运行此脚本，则执行初始化
if (require.main === module) {
  initEmailTables()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { initEmailTables };
