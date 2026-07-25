const { UsersBase } = require("@MySQL/models/base/index.js");

// 用户表 允许字段白名单
const USER_ALLOW_FIELDS = [
  "id",
  "username",
  "password",
  "nickname",
  "status",
  "create_time",
  "update_time"
];

// 实例化导出单例
const UsersModel = new UsersBase(
  process.env.MYSQL_DEV_DBNAME,
  process.env.MYSQL_DEV_USER_DBTABLE,
  USER_ALLOW_FIELDS
);

module.exports = UsersModel;
