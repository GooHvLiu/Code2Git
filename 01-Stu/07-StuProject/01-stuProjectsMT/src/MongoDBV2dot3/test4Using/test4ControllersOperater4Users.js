// 0. 引入路径优化第三方库module-alias
require("module-alias/register");
// 1.1 加载 .env 文件,所有 .env 文件中的变量都会被加载到 process.env 对象中
require("dotenv-expand").expand(require("dotenv").config());
// 1.2 引入数据库连接js文件
const dbConnect = require("@MongoDB/config/db.js");
// 1.3 引入controllers文件
const { usersController } = require("@MongoDB/controllers/index.controller.js");
// 1.4 导入模拟req,res的类方法
const reqResModule = require("@MongoDB/test4Using/test4Controllers.reqResModule.js");
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

// 3. 进行controllers的API接口测试操作
async function dbOperate() {
  // 3.1 【API接口】注册 register
  {
    //只传入一个参数{...}，对应给了body,其他参数为默认值
    const regReq1 = new reqResModule({
      username: "test017",
      email: "test007@demo.com",
      password: "123",
    });

    await usersController.register(regReq1, regReq1);
    console.log("register 返回：", regReq1.getResponse(), "\n");
  }
  // 3.2. 【页面专用】注册 registerData
  /* {
    const regDataReq = new reqResModule({
      username: "test008",
      email: "test008@demo.com",
      password: "12345678",
    });
    const regDataRes = await usersController.registerData(regDataReq);
    console.log("registerData 返回：", regDataRes, "\n");
  } */
  // 3.3 【API接口】登录 login（获取token）
  /* {
    const loginReq = new reqResModule({
      username: "test007",
      password: "12345678",
    });
    await usersController.login(loginReq, loginReq);
    const loginResp = loginReq.getResponse();
    const token = loginResp.data;
    console.log("login 返回token：", token, "\n");
  } */
  // 3.4. 【页面专用】登录 loginData（生成session）
  /* {
    const loginDataReq = new reqResModule(
      {
        username: "test007",
        password: "12345678",
      },
      {},
      {},
      { regenerate: (cb) => cb(null) },
    );
    const loginDataRes = await usersController.loginData(loginDataReq);
    console.log("loginData 返回：", loginDataRes, "\n");
  } */
  // 3.5. 【API接口】登出 logout（token失效）
  /* {
    //token是上面生成的
    token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTNkZGIzNDVlODAxZmJkMzI2OGE0MTkiLCJ0b2tlblZlcnNpb24iOjAsImlhdCI6MTc4MjQzOTIzNSwiZXhwIjoxNzgyNDQ2NDM1fQ.OQ4PR0CITU7rL6a5vrB8dUc7H5iYLSpfR8EvA-qGDdo";
    const logoutReq = new reqResModule();
    logoutReq.setAuthToken(token);
    await usersController.logout(logoutReq, logoutReq);
    console.log("logout 返回：", logoutReq.getResponse(), "\n");
  } */
  // 3.6. 【页面专用】登出 logoutData（销毁session）
  /* {
    const logoutDataReq = new reqResModule(
      {},
      {},
      {},
      { destroy: (cb) => cb(null, { type: 1 }) },
    );
    const logoutDataRes = await usersController.logoutData(logoutDataReq);
    console.log("logoutData 返回：", logoutDataRes, "\n");
  } */
  // 7. 【API接口】获取用户列表 getUserList
  /* {
    const listReq = new reqResModule({}, {}, { page: 1, limit: 10 });
    await usersController.getUserList(listReq, listReq);
    console.log("getUserList 返回：", listReq.getResponse(), "\n");
  } */
  // 8. 【页面专用】用户列表 getUserListData
  /* {
    const listDataReq = new reqResModule({}, {}, { page: 1, limit: 10 });
    const listDataRes = await usersController.getUserListData(listDataReq);
    console.log("getUserListData 返回：", listDataRes, "\n");
  } */
  // 9. 【API接口】获取当前登录用户 getInfo
  /* {
    const infoReq = new reqResModule();
    infoReq.user = { userId: "xxx", username: "test007" };
    await usersController.getInfo(infoReq, infoReq);
    console.log("getInfo 返回：", infoReq.getResponse(), "\n");
  } */
  // 10. 【页面专用】获取当前用户 getInfoData
  /* {
    const infoDataReq = new reqResModule();
    infoDataReq.user = { userId: "xxx", username: "test007" };
    const infoDataRes = await usersController.getInfoData(infoDataReq);
    console.log("getInfoData 返回：", infoDataRes, "\n");
  } */
  // 11. 【API接口】删除用户 deleteUser
  /* {
    const delReq = new reqResModule({}, { id: "6a3ddcfbf4bd6f00cbb58aee" });
    await usersController.deleteUser(delReq, delReq);
    console.log("deleteUser 返回：", delReq.getResponse(), "\n");
  } */
  // 12. 【页面专用】删除用户 deleteUserData
  /* {
    const delDataReq = new reqResModule({}, { id: "6a3ddcfbf4bd6f00cbb58aee" });
    const delDataRes = await usersController.deleteUserData(delDataReq);
    console.log("deleteUserData 返回：", delDataRes, "\n");
  } */
  // 13. 【页面专用】创建用户 createUserData
  /* {
    const createDataRes = await usersController.createUserData({
      username: "test009",
      email: "test009@demo.com",
      password: "123456",
    });
    console.log("createUserData 返回：", createDataRes, "\n");
  } */
  // 14. 【页面专用】按ID查找 findByIdData
  /* {
    const findIdRes = await usersController.findByIdData({
      _id: "6a3ddb345e801fbd3268a419",
    });
    console.log("findByIdData 返回：", findIdRes, "\n");
  } */
  // 15. 【页面专用】条件单条查询 findOneData
  /* {
    const findOneRes = await usersController.findOneData({
      username: "test007",
    });
    console.log("findOneData 返回：", findOneRes, "\n");
  } */
}
