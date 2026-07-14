// 0. 引入路径优化第三方库module-alias
require("module-alias/register");
// 1.1 加载 .env 文件,所有 .env 文件中的变量都会被加载到 process.env 对象中
require("dotenv-expand").expand(require("dotenv").config());
// 1.2 引入数据库连接js文件
const dbConnect = require("@MongoDB/config/db.js");
// 1.3 引入services文件
const { usersService } = require("@MongoDB/services/index.service.js");

// 2. 连接数据库,采用IIFE表达式，第1个外括号内的表示是一个函数的箭头函数简写，第二个括号代码传参，是最简写形式
(async () => {
  try {
    // 2.1 尝试连接数据库
    await dbConnect();
    // 2.2 连接数据库后，对数据库进行项目操作
    dbOperate();
  } catch (error) {
    // 2.3 数据库如果连接失败做提示，并进行错误后操作,退出程序，不再提供服务
    console.log("主程序获取连接错误：" + error);
    process.exit(1);
  }
})();

// 3. 进行services纯数据库操作工作
async function dbOperate() {
  // 3.1  调用创建批量用户方法
  // await createUsers();
  // 3.2  调用创建一个用户方法
  // await createUser();
  // 3.3 通过id查询用户(存在和软删除中不存在的用户)
  /* {
    console.log(
      "查找已存在，且没有被删除的用户:",
      await usersService.findById("6a3dd348e7373a4e9c4d2d86"),
    );
    console.log(
      "查找已存在，且被删除的用户:",
      await usersService.findById("6a3dd348e7373a4e9c4d2d12"),
    );
  } */
  // 3.4 条件查询单条
  /* console.log(
    await usersService.findOne({
      role: "user",
    }),
  ); */
  // 3.5 分页列表
  // console.log(await usersService.getUserList({ role: "user" }, 2, 5));
  // 3.6 更新用户啊
  /* console.log(
    await usersService.updateById("6a3dd33806d315abf9fab945", {
      role: "admin",
    }),
  ); */
  // 3.7 软删除
  // console.log(await usersService.deleteById("6a3dd33806d315abf9fab945"));
}

// 创建批量用户
async function createUsers() {
  for (let index = 1; index < 10; index++) {
    const usersObject = {
      username: `test4Uers0${index}`,
      password: `test4Uers0${index}123`,
      email: `test4Uers0${index}@test4Uers.com`,
      role: "user",
      lastLogin: Date.now(),
      loginCount: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false,
    };
    console.log(await usersService.createUser(usersObject));
  }
}

// 创建单个用户
async function createUser() {
  const userObject = {
    username: `test4Uers100`,
    password: `test4Uers100123`,
    email: `test4Uers100@test4Uers.com`,
    role: "user",
    lastLogin: Date.now(),
    loginCount: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDeleted: false,
  };
  console.log(await usersService.createUser(userObject));
}
