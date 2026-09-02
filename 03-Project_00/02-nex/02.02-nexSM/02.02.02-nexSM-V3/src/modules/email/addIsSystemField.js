/**
 * 临时脚本：添加is_system字段并设置ID=1为系统内置
 */
require('dotenv-expand').expand(require('dotenv').config());
const { query } = require('../../db/index');

(async () => {
  try {
    // 检查is_system字段是否存在
    const columns = await query("SHOW COLUMNS FROM nex_email_config LIKE 'is_system'");
    if (columns.length === 0) {
      console.log('添加is_system字段...');
      await query("ALTER TABLE nex_email_config ADD COLUMN is_system TINYINT DEFAULT 0 COMMENT '是否系统内置 0-否 1-是' AFTER is_default");
      console.log('✅ is_system字段添加成功');
    } else {
      console.log('✅ is_system字段已存在');
    }

    // 把ID=1的配置设置为系统内置
    await query('UPDATE nex_email_config SET is_system = 1 WHERE id = 1');
    console.log('✅ 已将ID=1的配置设置为系统内置（不允许删除）');

    // 验证
    const result = await query('SELECT id, name, is_system, is_default FROM nex_email_config WHERE id = 1');
    console.log('验证结果:', JSON.stringify(result[0]));

    process.exit(0);
  } catch (err) {
    console.error('❌ 操作失败:', err.message);
    process.exit(1);
  }
})();
