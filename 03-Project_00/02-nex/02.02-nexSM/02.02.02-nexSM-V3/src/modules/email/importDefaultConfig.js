/**
 * 导入系统默认邮箱配置到数据库
 */
require('dotenv-expand').expand(require('dotenv').config());
const emailModel = require('./email.model');
const emailConfig = require('./email.config');

(async () => {
  try {
    console.log('开始导入系统默认邮箱配置...');

    // 检查是否已经存在配置
    const existing = await emailModel.getList({ page: 1, pageSize: 10 });
    if (existing.total > 0) {
      console.log(`⚠️  数据库中已存在 ${existing.total} 条配置，跳过导入`);
      process.exit(0);
    }

    // 导入系统默认配置
    const defaultConfig = emailConfig.default;
    const id = await emailModel.create({
      name: '系统默认邮箱',
      provider: defaultConfig.provider,
      host: defaultConfig.host,
      port: defaultConfig.port,
      secure: defaultConfig.secure,
      username: defaultConfig.username,
      password: defaultConfig.password,
      from_name: defaultConfig.fromName,
      is_default: 1,
      status: 1,
      remark: '系统默认邮箱配置',
      create_by: 'system'
    });

    console.log(`✅ 系统默认邮箱配置导入成功，ID: ${id}`);
    console.log(`   配置名称: 系统默认邮箱`);
    console.log(`   服务商: ${defaultConfig.provider}`);
    console.log(`   邮箱账号: ${defaultConfig.username}`);
    console.log(`   发件人名称: ${defaultConfig.fromName}`);
    console.log(`   是否默认: 是`);

    process.exit(0);
  } catch (err) {
    console.error('❌ 导入失败:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
})();
