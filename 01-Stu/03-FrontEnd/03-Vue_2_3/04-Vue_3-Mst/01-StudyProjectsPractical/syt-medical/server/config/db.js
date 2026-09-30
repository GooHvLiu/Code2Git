/**
 * MySQL 数据库连接配置
 */
const mysql = require("mysql2/promise");

// 创建连接池
const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "123456", // ← 改成你的MySQL密码
  database: "syt_medical",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 测试连接
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL 数据库连接成功");
    conn.release();
  } catch (e) {
    console.error("❌ MySQL 数据库连接失败:", e.message);
  }
}

testConnection();

module.exports = pool;
