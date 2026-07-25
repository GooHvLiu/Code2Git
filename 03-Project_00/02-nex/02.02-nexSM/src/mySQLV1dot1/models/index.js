const { UsersBase, USER_ALLOW_FIELDS } = require("./users/index.users.js");
const { Menu4usersBase } = require("./menu4users/index.menu4users.js");

// 在聚合层统一实例化
const UsersModel = new UsersBase(
  process.env.MYSQL_DEV_DBNAME,
  process.env.MYSQL_DEV_USER_DBTABLE,
  USER_ALLOW_FIELDS
);
const Menu4UsersModel = new Menu4usersBase(
  process.env.MYSQL_DEV_DBNAME,
  process.env.MYSQL_DEV_MENU4USER_DBTABLE
);

module.exports = {
  UsersModel,
  Menu4UsersModel
};
