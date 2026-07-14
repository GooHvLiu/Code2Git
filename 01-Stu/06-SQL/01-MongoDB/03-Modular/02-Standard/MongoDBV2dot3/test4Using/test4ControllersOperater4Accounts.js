// 0. 引入路径优化第三方库module-alias
require("module-alias/register");
// 1.1 加载 .env 文件,所有 .env 文件中的变量都会被加载到 process.env 对象中
require("dotenv-expand").expand(require("dotenv").config());
// 1.2 引入数据库连接js文件
const dbConnect = require("@MongoDB/config/db.js");
// 1.3 引入accounts控制器
const {
  accountsController,
} = require("@MongoDB/controllers/index.controller.js");
// 1.4 导入模拟req,res的类方法
const reqResModule = require("@MongoDB/test4Using/test4Controllers.reqResModule.js");

// 2. 连接数据库,采用IIFE表达式，连接成功后执行测试
(async () => {
  try {
    // 2.1 尝试连接数据库
    await dbConnect();
    // 2.2 连接数据库后，对数据库进行项目操作
    await dbOperate();
    process.exit(0);
  } catch (error) {
    // 2.3 数据库如果连接失败做提示，并退出程序
    console.log("主程序获取连接错误：" + error);
    process.exit(1);
  }
})();

// 3. 进行Accounts controllers的API接口测试操作
async function dbOperate() {
  // 测试用账单基础数据
  const testAccountBody = {
    item: "午餐支出",
    type: -1,
    account: 36.5,
    remark: "公司楼下快餐店",
    createTime: new Date(),
  };
  const updateAccountBody = {
    item: "午餐支出修改",
    account: 42,
    remark: "加了饮料",
  };

  // 3.1 【API接口】获取账单列表 getAccountsList
  /* {
    const listReq = new reqResModule({}, {}, { page: 1, limit: 10 });
    await accountsController.getAccountsList(listReq, listReq);
    console.log(
      "3.1 getAccountsList(API列表) 返回：",
      listReq.getResponse(),
      "\n",
    );
  } */
  // 3.2 【页面专用】获取账单列表 getAccountsListData
  /* {
    const listDataReq = new reqResModule({}, {}, { page: 1, limit: 10 });
    const listDataRes =
      await accountsController.getAccountsListData(listDataReq);
    console.log("3.2 getAccountsListData(页面列表) 返回：", listDataRes, "\n");
  } */
  // 3.3 【API接口】创建账单 createAccount
  {
    // 分开创建 req、res 模拟对象
    const mockReq = new reqResModule(testAccountBody);
    const mockRes = new reqResModule();
    // 分别传入 req、res
    await accountsController.createAccount(mockReq, mockRes);
    // 从 res 实例拿返回结果打印
    console.log(
      "3.3 createAccount(API创建) 返回：",
      mockRes.getResponse(),
      "\n",
    );
  }
  // 3.4 【页面专用】创建账单 createAccountData
  /* {
    const createDataRes =
      await accountsController.createAccountData(testAccountBody);
    console.log("3.4 createAccountData(页面创建) 返回：", createDataRes, "\n");
  } */
  // 3.5 【API接口】根据ID查询单条账单 getOneAccountById
  /* {
    const findReq = new reqResModule({}, { id: "6a3de4eded36737b562b3413" });
    await accountsController.getOneAccountById(findReq, findReq);
    console.log(
      "3.5 getOneAccountById(API单条查询) 返回：",
      findReq.getResponse(),
      "\n",
    );
  } */
  // 3.6 【页面专用】根据ID查询单条账单 getOneAccountByIdData
  /* {
    const findDataRes = await accountsController.getOneAccountByIdData(
      "6a3de4eded36737b562b3413",
    );
    console.log(
      "3.6 getOneAccountByIdData(页面单条查询) 返回：",
      findDataRes,
      "\n",
    );
  } */
  // 3.7 【API接口】更新账单 updateAccountById
  /* {
    const updateReq = new reqResModule(updateAccountBody, {
      id: "6a3de4eded36737b562b3413",
    });
    await accountsController.updateAccountById(updateReq, updateReq);
    console.log(
      "3.7 updateAccountById(API更新) 返回：",
      updateReq.getResponse(),
      "\n",
    );
  } */
  // 3.8 【页面专用】更新账单 updateAccountByIdData
  /* {
    const updateDataRes = await accountsController.updateAccountByIdData(
      "6a3de4eded36737b562b3413",
      updateAccountBody,
    );
    console.log(
      "3.8 updateAccountByIdData(页面更新) 返回：",
      updateDataRes,
      "\n",
    );
  } */
  // 3.9 【API接口】删除账单 deleteAccount
  /* {
    const delReq = new reqResModule({}, { id: "6a3de4eded36737b562b3413" });
    await accountsController.deleteAccount(delReq, delReq);
    console.log(
      "3.9 deleteAccount(API删除) 返回：",
      delReq.getResponse(),
      "\n",
    );
  } */
  // 3.10 【页面专用】删除账单 deleteAccountData
  /* {
    const delDataReq = new reqResModule({}, { id: "6a3de4eded36737b562b3413" });
    const delDataRes = await accountsController.deleteAccountData(delDataReq);
    console.log("3.10 deleteAccountData(页面删除) 返回：", delDataRes, "\n");
  } */
}
