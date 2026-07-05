const BaseModel = require("@MySQL/models/base/base.model.js");

// 用户表允许字段白名单
const USER_ALLOW_FIELDS = [
  "id",
  "username",
  "password",
  "status",
  "isDelete",
  "create_time"
];

// 实例化导出单例
const UsersModel = new BaseModel(
  process.env.MYSQL_DEV_DBNAME,
  process.env.MYSQL_DEV_DBTABLE,
  USER_ALLOW_FIELDS
);

module.exports = UsersModel;
