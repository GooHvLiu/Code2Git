// 0. 引入路径优化第三方库moudle-alias
require("module-alias/register");
// 1.1 加载 .env 文件,所有 .env 文件中的变量都会被加载到 process.env 对象中
require("dotenv-expand").expand(require("dotenv").config());
// 1.2 引入数据库连接js文件
const dbConnect = require("@MongoDB/config/db.js");
// 1.3 引入services文件
const { accountsService } = require("@MongoDB/services/index.service.js");

// 2. 异步自执行函数：等待数据库连接成功后再加载路由
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
  await createAccounts();
  // 3.2  调用创建一个用户方法
  // await createAccount();
  // 3.3 通过id查询用户(存在和软删除中不存在的用户)
  /* {
    console.log(
      "查找已存在，且没有被删除的用户:",
      await accountsService.findById("6a3678fbedb95ed3e05fe04a"),
    );
    console.log(
      "查找已存在，且被删除的用户:",
      await accountsService.findById("6a3678fbedb95ed3e05fdfe6"),
    );
  } */
  // 3.4 条件查询单条
  /* console.log(
    await accountsService.findOne({
      remarks: "趁着暑假赚点钱买手机Iphone112",
    }),
  ); */
  // 3.5 分页列表
  // console.log(await accountsService.getAccountsList({ type: 1 }, 2, 50));
  // 3.6 更新用户啊
  /* console.log(
    await accountsService.updateById("6a3678fbedb95ed3e05fdff1", {
      remarks: "不准备买手机了，买笔记本电脑",
    }),
  ); */
  // 3.7 软删除
  // console.log(await accountsService.deleteById("6a3678fbedb95ed3e05fdff1"));
}

// 创建批量账目
async function createAccounts() {
  for (let index = 1; index < 10; index++) {
    const accountsObject = {
      item: `开了第${index}个个体户，自己做生意`,
      type: -1,
      account: `25${index}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      remarks: `趁着奶茶热，想着赚一波回回血`,
      isDeleted: false,
    };
    console.log(await accountsService.createAccount(accountsObject));
  }
}

// 创建单个账目
async function createAccount() {
  const accountObject = {
    item: "给培训机构做宣传",
    type: 1,
    account: 132,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    remarks: "趁着暑假赚点钱买手机",
    isDeleted: false,
  };
  console.log(await accountsService.createAccount(accountObject));
}
