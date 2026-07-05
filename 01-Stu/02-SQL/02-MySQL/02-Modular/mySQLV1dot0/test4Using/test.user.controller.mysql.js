// 引入路径优化第三方库moudle-alias
require("module-alias/register");
require("dotenv-expand").expand(require("dotenv").config());
const connectDB = require("@MySQL/models/base/index.js");
const { usersController } = require("@MySQL/controllers/index.controller.js");
// 连接MySQL数据库
connectDB.pool;

// 模拟req，res
/**
 * 生成模拟 req 请求对象
 * @param {Object} query 模拟URL查询参数 ?username=xxx&status=1
 * @param {Object} params 模拟路径参数 /api/user/1
 * @param {Object} body 模拟POST/PUT提交的JSON表单
 * @returns {Object} 模拟req
 */
function mockReq(query = {}, params = {}, body = {}) {
  return {
    query,
    params,
    body
  };
}

/**
 * 生成模拟 res 响应对象
 * 重写 json 方法，捕获控制器返回的JSON数据并打印
 * @returns {Object} 模拟res，包含捕获结果的缓存
 */
function mockRes() {
  const res = {
    // 缓存接口返回的json数据
    responseData: null,
    json: function (result) {
      this.responseData = result;
      console.log(
        "===== 接口返回JSON结果 =====",
        JSON.stringify(this.responseData, null, 2)
      );
    }
  };
  return res;
}

/**
 * 生成模拟 next 错误中转函数
 * 捕获控制器抛出的所有异常并打印
 * @returns {Function} next(err)
 */
function mockNext() {
  return function (err) {
    console.error("===== 捕获接口异常 =====", err.message);
  };
}

/* // 1. findAll测试分页查询用户列表
getUserPage(); */

/* // 2. findAll测试不分页查询用户列表
getUserAll(); */

/* // 3. findOne根据ID进行查找
getUserInfo(); */

/* // 4. Create 新建用户
addUser(); */

/* // 5. Update 更新用户
editUser(); */

/* // 6. removeUser 物理删除用户
removeUser(); */

/* // 7. softRemoveUser 软删除用户
softRemoveUser(); */

async function getUserAll() {
  const req = mockReq(
    {
      status: 0,
      fields: "id,username,status,isDelete",
      isDelete: 0
    },
    {},
    {}
  );
  const res = mockRes();
  const next = mockNext();
  await usersController.getUserAll(req, res, next);
}

async function getUserPage() {
  const req = mockReq(
    {
      status: 0,
      page: 1,
      pageSize: 5,
      fields: "id,username,status,isDelete",
      isDelete: 0
    },
    {},
    {}
  );
  const res = mockRes();
  const next = mockNext();
  await usersController.getUserPage(req, res, next);
}

async function getUserInfo() {
  const req = mockReq(
    {
      status: 0,
      fields: "id,username,status,isDelete",
      isDelete: 0
    },
    {
      id: 12
    },
    {}
  );
  const res = mockRes();
  const next = mockNext();
  await usersController.getUserInfo(req, res, next);
}

async function addUser() {
  const req = mockReq(
    {
      fields: "id,username,status,isDelete",
      isDelete: 0
    },
    {},
    {
      username: "xiaodidiao",
      password: "xiaodidiao123321",
      status: 0
    }
  );
  const res = mockRes();
  const next = mockNext();
  await usersController.addUser(req, res, next);
}

async function editUser() {
  const req = mockReq(
    {
      fields: "id,username,status,isDelete",
      isDelete: 0
    },
    {
      id: 44
    },
    {
      username: "xiaoDiDiaoBei"
    }
  );
  const res = mockRes();
  const next = mockNext();
  await usersController.editUser(req, res, next);
}

async function removeUser() {
  const req = mockReq(
    {
      fields: "id,username,status,isDelete",
      isDelete: 0
    },
    {
      id: 44
    },
    {}
  );
  const res = mockRes();
  const next = mockNext();
  await usersController.removeUser(req, res, next);
}

async function softRemoveUser() {
  const req = mockReq(
    {
      fields: "id,username,status,isDelete",
      isDelete: 0
    },
    {
      id: 12
    },
    {}
  );
  const res = mockRes();
  const next = mockNext();
  await usersController.softRemoveUser(req, res, next);
}
