/**
 * 临时脚本：给nex_email_config表添加is_delete字段
 */
require('dotenv-expand').expand(require('dotenv').config());
const { query } = require('../../db/index');

(async () => {
  try {
    // 检查is_delete字段是否存在
    const columns = await query("SHOW COLUMNS FROM nex_email_config LIKE 'is_delete'");
    if (columns.length === 0) {
      console.log('添加is_delete字段...');
      await query("ALTER TABLE nex_email_config ADD COLUMN is_delete TINYINT DEFAULT 0 COMMENT '是否删除 0-未删除 1-已删除' AFTER status");
      console.log('✅ is_delete字段添加成功');
    } else {
      console.log('✅ is_delete字段已存在');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ 操作失败:', err.message);
    process.exit(1);
  }
})();
