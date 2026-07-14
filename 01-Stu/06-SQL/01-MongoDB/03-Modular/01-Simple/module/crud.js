// ===============================================
// ======  crud.js-此文件为增删改查
// ======  可以修改的参数及定义如下：
// ======     增删改查：根据需要使用各种不同的方法
// ===============================================
// ./model是需要根据创建模型js文件名决定的，引入当前目录下的 model.js 文件
const StuModel = require("./model.js");

//Mongoose 7.x 版本以上，这个版本不再支持回调函数（callback），必须使用 async/await 或 Promise！等待数据库连接成功
setTimeout(async () => {
  try {
    // 1. create插入数据
    const result1 = await StuModel.create({
      name: "西游记",
      author: "吴承恩",
      price: 19.9,
    });
    console.log("Create Success:", result1);

    /* // 2. read查询所有数据
    const result2 = await StuModel.find({});
    console.log("Find All Data:", result2); */

    /* // 3. update更新数据
    const result3 = await StuModel.updateOne(
      { name: "孙悟空" }, // 查询条件
      { age: 19 }, // 更新内容
    );
    console.log("Update Successful:", result3); */

    /* // 4. delete删除数据
    const result4 = await StuModel.deleteOne(
      { name: "孙悟空" }  // 删除条件
    );
    console.log("Delete Successful:", result4); */
  } catch (error) {
    console.error("Operation Failed:", error);
  }
}, 1000); // 等待1秒，确保数据库连接成功
