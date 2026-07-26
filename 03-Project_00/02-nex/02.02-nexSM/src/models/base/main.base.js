const mysql = require("mysql2/promise");
const dbConfig = require("@config/db.config.js");

// 全局单例连接池
const pool = mysql.createPool(dbConfig);

// 启动时测试数据库连接
(async function initDB() {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL Connected Succece.");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL Connected Fail:", err.message);
    process.exit(1);
  }
})();

/**
 * 统一执行SQL
 * @param {string} sql
 * @param {Array} params
 * @returns Promise<Array>
 */
async function execSql(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

module.exports = {
  pool,
  execSql
};
