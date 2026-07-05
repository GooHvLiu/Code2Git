// 1. 引入相关环境变量、依赖包和定义数据库客户端和实例对象
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;
let _db = null;
let _client = null;

// 2. 判断环境变量是否存在该字段
if (!uri) {
  throw new Error(
    "❌ MONGODB_URI 未定义。请确保 dotenv-expand 在加载此文件前已执行",
  );
}

/**
 * 3. 获取 Db 实例（单例模式）
 * @returns {Promise<import("mongodb").Db>}
 */
async function getDb() {
  if (_db) return _db;

  _client = new MongoClient(uri);
  await _client.connect();

  // URI 中已包含库名 expressTest4Demo，无参调用即可自动选中
  _db = _client.db();
  console.log(`✅ MongoDB 已连接至数据库: ${_db.databaseName}`);
  return _db;
}

/**
 * 4. 优雅关闭数据库连接（服务器退出时调用）
 */
async function closeDb() {
  if (_client) {
    await _client.close();
    _db = null;
    _client = null;
    console.log("📴 MongoDB 连接已关闭");
  }
}

module.exports = { getDb, closeDb };
