/**
 * MySQL 多环境配置
 */
const env = process.env.NODE_ENV || "development";

const envConfig = {
  development: {
    host: process.env.MYSQL_DEV_DBHOST || "127.0.0.1",
    port: process.env.MYSQL_DEV_DBPORT || 3306,
    user: process.env.MYSQL_DEV_USERNAME || "root",
    password: process.env.MYSQL_DEV_PASSWORD || "123456",
    database: process.env.MYSQL_DEV_DBNAME || "nexSM01",
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    timezone: "+08:00",
    charset: "utf8mb4"
  },
  test: {
    host: process.env.MYSQL_TEST_DBHOST || "127.0.0.1",
    port: process.env.MYSQL_TEST_DBPORT || 3306,
    user: process.env.MYSQL_TEST_USERNAME || "root",
    password: process.env.MYSQL_TEST_PASSWORD || "123456",
    database: process.env.MYSQL_TEST_PASSWORD || "nexSM01",
    connectionLimit: 5
  },
  production: {
    host: "线上数据库IP",
    port: 3306,
    user: "prod_root",
    password: "线上强密码",
    database: "prod_db",
    connectionLimit: 20,
    ssl: true
  }
};

module.exports = envConfig[env];
