const Database = require("better-sqlite3");
const path = require("path");

// 打开数据库文件（不存在会自动创建）
const db = new Database(path.join(__dirname, "../data/syt.db"));

// 建表
db.exec(`
  CREATE TABLE IF NOT EXISTS wx_user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    openid TEXT UNIQUE NOT NULL,
    nickname TEXT DEFAULT '',
    avatar TEXT DEFAULT '',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log("✅ SQLite 数据库连接成功");

module.exports = db;
