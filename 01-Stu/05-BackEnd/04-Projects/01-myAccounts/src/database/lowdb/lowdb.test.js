const dbOperate = require("./dbOperate.js");
// 获取随机数
/* dbOperate.getId(); */

//对数据库结构进行初始化设定
console.log(
  dbOperate.init({
    posts: [],
    users: {},
  }),
);

const tableName = "posts";

//写入数据，在后面插入
/* dbOperate.writePush(tableName, {
  id: dbOperate.getId(),
  title: "lowdb教程-0",
  content: "我喜欢的书籍",
}); */

//写入数据，在前面插入
/* dbOperate.writeUnshift(tableName, {
  id: dbOperate.getId(),
  title: "lowdb教程-3",
  content: "我喜欢的书籍3",
}); */

//查询全部数据
/* console.log(dbOperate.findAll(tableName)); */

//查询单条数据
/* console.log(
  dbOperate.findOne(tableName, {
    title: "lowdb教程-3",
  }),
);
 */

//更新数据
/* console.log(
  dbOperate.updateData(
    tableName,
    { title: "lowdb教程-1" },
    { content: "我不喜欢的书籍" },
  ),
);
 */

//删除数据
/* console.log(dbOperate.deleteData(tableName, { content: "我不喜欢的书籍" }));
 */
