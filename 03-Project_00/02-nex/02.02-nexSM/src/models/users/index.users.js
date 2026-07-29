const { UsersBase } = require("@models/base/index.js");

// 用户表 允许字段白名单
const USER_ALLOW_FIELDS = [
  "id",
  "username",
  "password",
  "role",
  "real_name",
  "sex",
  "phone",
  "email",
  "dept_id",
  "avatar",
  "login_ip",
  "login_date",
  "remark",
  "status",
  "is_delete",
  "create_time",
  "create_by",
  "update_time",
  "update_by"
];

module.exports = {
  UsersBase,
  USER_ALLOW_FIELDS
};
