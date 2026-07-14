// ===============================================
// ======  model.js-此文件为模型定义
// ======  可以修改的参数及定义如下：
// ======     BookSchema：结构对象名称及内容，一般与数据库种类关联
// ======     BookModel：模型对象，一般与数据库种类关联
// ======     Books：待操作的集合名词
// ===============================================
/* 可以通过官方文档进行逐步执行：https://mongoosejs.com/docs/guide.html */
// 1. 创建Schema(模式)对象,并非是必须的，只是为了方便，./db是需要根据连接js文件名决定的，引入当前目录下的 db.js 文件
const mongoose = require("./db.js"); // 引入数据库连接
const { Schema } = mongoose;

// 2. 创建文档的结构对象，设置集合中文档的属性以及属性值的类型
const BookSchema = new Schema({
  name: String,
  author: String,
  price: Number,
});

// 3. 创建Model(模型)对象，对文档操作的封装对象，第一个参数表示创建的集合的名称，mongoose会自动将集合名变为复数，第二个参数表示利用的模式对象
const BookModel = mongoose.model("Books", BookSchema);

// 4. 导出BookModel，供其他文件使用
module.exports = BookModel;
