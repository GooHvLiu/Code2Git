// ===============================================
// ======  db.js-此文件为数据库连接
// ======  可以修改的参数及定义如下：
// ======     connStr：需要连接数据库的地址和数据库名称
// ===============================================

// 可以通过官方文档进行逐步执行：https://mongoosejs.com/
// 0.定义可变量
const connStr = "mongodb://127.0.0.1:27017/expressTest4Demo";
// 1.安装使用
// npm i mongoose --save

// 2.引入mongoose
const mongoose = require("mongoose");

// 3.连接mongodb数据库，如果端口号默认27017，则可以省略，myTest可以修改为自己需要使用的数据库名称(使用时可以查询官网，不同版本方式不同)
mongoose.connect(connStr);

// 4.监听mongodb数据库的连接状态
// 4.1 绑定数据库连接成功事件
mongoose.connection.once("open", function () {
  console.log("MongoDB Connection Successful~");
});
// 4.2 绑定数据库连接失败事件
mongoose.connection.on("error", function (error) {
  console.log("MongoDB Connection Fail:", error);
});

// 4.3 绑定数据库连接断开事件
mongoose.connection.on("close", function () {
  console.log("MongoDB Connection Closed!");
});

// 5. 导出mongoose，供其他文件使用
module.exports = mongoose;

// 6. 断开数据库连接(一般不用，注释掉)
// setTimeout(() => {
//   mongoose.disconnect();
// }, 5000);  // 示例-5秒后断开连接

// 7. 运行js文件
// 7.1 方法1
//node connect-db.js

// 7.2 使用VS Code的"运行"按钮
// 步骤：
// 安装"Code Runner"扩展
// 点击左侧扩展图标（或按 Ctrl+Shift+X）
// 搜索 "Code Runner"
// 点击安装
