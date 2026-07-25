const { UsersBase } = require("@MySQL/models/base/index.js");

// 用户表 允许字段白名单
const USER_ALLOW_FIELDS = [
  "id",
  "username",
  "password",
  "nickname",
  "status",
  "isDelete",
  "create_time",
  "update_time"
];

module.exports = {
  UsersBase,
  USER_ALLOW_FIELDS
};
