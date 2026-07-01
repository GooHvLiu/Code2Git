// 0. 引入路径优化第三方库module-alias
require("module-alias/register");
// 1.1 加载 .env 文件,所有 .env 文件中的变量都会被加载到 process.env 对象中
require("dotenv-expand").expand(require("dotenv").config());
// 1.2 引入数据库连接js文件
const dbConnect = require("@MongoDB/config/db.js");
// 1.3 引入projects控制器
const {
  projectsController,
} = require("@MongoDB/controllers/index.controller.js");

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
  /* const testProjectBody01 = {
    title: "记账本",
    icon: "fas fa-user-cog",
    description: "记录日常消费项目，Express+MongoDB",
    tech: ["Node.js", "Express", "MongoDB", "Session", "Token"],
    route: "/myAccounts",
    bindIp: "127.0.0.1",
    bindPort: 3000,
    workDir:
      "F:/CodingMan/Code2Git/01-Stu/04-BackEnd/06-Projects/01-myAccounts", // 替换为你真实绝对路径
    startCmd: "npm start",
    pm2Name: "my-accounts-project",
    port: 300,
  }; */
  const testProjectBody02 = {
    title: "待办事项",
    icon: "fas fa-user-cog",
    description: "记录待办事项",
    tech: ["Vue2.js", "CLI"],
    route: "/toDoLists",
    bindIp: "127.0.0.1",
    bindPort: 8080,
    workDir:
      "F:/CodingMan/Code2Git/01-Stu/03-FrontEnd/03-Vue_2_3/02-Vue_2-Int/02-ProjectCode/01-todo-list", // 替换为你真实绝对路径
    startCmd: "npm run serve",
    pm2Name: "todo-lists",
    port: 8080,
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
  /*  {
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
  } */
  // 3.4 【页面专用】创建项目 createProjectsData
  {
    const createDataRes =
      await projectsController.createProjectsData(testProjectBody02);
    console.log("3.4 createProjectsData(页面创建) 返回：", createDataRes, "\n");
  }
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
