// 引入路径优化第三方库moudle-alias
require("module-alias/register");
require("dotenv-expand").expand(require("dotenv").config());
const connectDB = require("@MySQL/models/base/index.js");
const { usersService } = require("@MySQL/service/index.service.js");
// 连接MySQL数据库
connectDB.pool;

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
  try {
    const query = {};
    const usersList = await usersService.getUserAll(query);
    console.log("目前数据库人员如下：", usersList);
  } catch (error) {
    console.log("系统出现异常:", error);
  }
}

async function getUserPage() {
  try {
    // 统一分页参数，统一每页2条
    const pageSize = 6;
    let currentPage = 1;
    // 第一页查询参数
    let query = { page: currentPage, pageSize };
    let usersPage = await usersService.getUserPage(query);
    // 计算总页数
    const totalCount = usersPage.total;
    const totalPage = Math.ceil(totalCount / pageSize);
    console.log(
      `===== 第${currentPage}页 / 总条数：${totalCount} / 总页数：${totalPage} =====`
    );
    console.log("当前页数据：", usersPage);
    // 只有总页数大于1，才循环遍历后续页面
    if (totalPage > 1) {
      // 从第2页循环到最后一页
      for (let i = 2; i <= totalPage; i++) {
        // 每次新建查询参数，不重复变量名
        const loopQuery = { page: i, pageSize };
        const pageData = await usersService.getUserPage(loopQuery);
        console.log(`===== 第${i}页 / 总页数：${totalPage} =====`);
        console.log("当前页数据：", pageData);
      }
    }

    console.log("✅ 全部分页数据遍历完成");
  } catch (error) {
    console.log("系统出现异常:", error);
  }
}

async function getUserInfo() {
  try {
    const id = 9;
    const userInfo = await usersService.getUserInfo(id);
    console.log("目前数据库人员如下：", userInfo);
  } catch (error) {
    console.log("系统出现异常", error);
  }
}

async function addUser() {
  try {
    for (let i = 0; i < 10; i++) {
      const userData = { username: `rest0${i}`, password: `admin123456a${i}` };
      const userInfo = await usersService.addUser(userData);
      if (userInfo > 0) {
        console.log("添加成功");
      } else {
        console.log("添加失败");
      }
    }
    getUserAll();
  } catch (error) {
    console.log("当前错误，", error);
  }
}

async function editUser() {
  try {
    const id = 31;
    const data = {
      username: "test074self"
    };
    const userInfo = await usersService.editUser(id, data);
    if (userInfo > 0) {
      console.log("更新成功");
    } else {
      console.log("更新失败");
    }
  } catch (error) {
    console.log("更新出现异常：", error);
  }
}

async function removeUser() {
  try {
    const id = 31;

    const userInfo = await usersService.removeUser(id);
    if (userInfo > 0) {
      console.log("删除成功");
    } else {
      console.log("删除失败");
    }
  } catch (error) {
    console.log("删除出现异常：", error);
  }
}

async function softRemoveUser() {
  try {
    const id = 12;

    const userInfo = await usersService.softRemoveUser(id);
    if (userInfo > 0) {
      console.log("软删除成功");
    } else {
      console.log("软删除失败");
    }
  } catch (error) {
    console.log("软删除出现异常：", error);
  }
}
