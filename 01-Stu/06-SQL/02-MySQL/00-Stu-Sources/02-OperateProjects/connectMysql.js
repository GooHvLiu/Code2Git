// 1. 安装 npm i mysql2

// 2. 配置

// 2.1 导入mysql2模块 promise 版本，天然支持 await
const mysql = require("mysql2/promise");

// 2.2 建立与mysql数据库的连接配置
const db = mysql.createPool({
  // 数据库的 IP 地址
  host: "127.0.0.1",
  //登录数据库的账号
  user: "root",
  //登录数据库的密码
  password: "123456",
  //指定要操作哪个数据库
  database: "mydb4demo",
  //等待连接
  waitForConnections: true,
  //用于控制当连接池满时是否等待连接
  connectionLimit: 10,
  //等待队列的最大长度限制
  queueLimit: 0,
  //MySQL8.0以上 默认使用 caching_sha2_password 加密方式, mysql2 才支持该配置
  authPlugins: {
    mysql_native_password: () => Buffer.from("123456")
  }
});
// 3. 测试
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("MYSQL IS CONNECTED.");
    conn.release();
  } catch (err) {
    console.log("MYSQL IS NOT CONNECTED.", err);
  }
})();
// 4. 导出连接池，外部文件引入使用
module.exports = { db };
