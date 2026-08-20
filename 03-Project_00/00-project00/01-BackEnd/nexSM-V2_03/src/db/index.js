/**
 * MySQL 连接池封装
 * 使用 mysql2/promise 异步API
 */
const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');

// 创建连接池
const pool = mysql.createPool(dbConfig);

/**
 * 执行SQL查询
 * @param {string} sql SQL语句
 * @param {Array} params 参数数组
 * @returns {Promise<Array>} 查询结果
 */
async function query(sql, params = []) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    connection.release();
  }
}

/**
 * 执行事务
 * @param {Function} callback 事务回调，接收connection参数
 * @returns {Promise<any>} 事务执行结果
 */
async function transaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

// 测试连接
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL 数据库连接成功');
    connection.release();
  } catch (err) {
    console.error('❌ MySQL 数据库连接失败:', err.message);
  }
})();

module.exports = {
  pool,
  query,
  transaction
};
