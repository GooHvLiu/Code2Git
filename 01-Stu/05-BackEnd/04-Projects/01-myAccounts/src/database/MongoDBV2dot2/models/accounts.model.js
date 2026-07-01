// 1.1 引入相关所有依赖包
const mongoose = require("mongoose");

// 2. 创建文档的结构对象，设置集合中文档的属性以及属性值的类型
const accountsSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
    trim: true,
    index: true, // 单字段索引，加速查询
  },
  type: {
    type: Number,
    enum: [-1, 1],
    required: true,
    default: -1,
  },
  account: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  remarks: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
});

// 3.1 复合索引：查询未删除用户时加速
accountsSchema.index({ username: 1, isDeleted: 1 });
// 3.2 全局查询钩子：默认过滤已删除数据
accountsSchema.pre(/^find/, function () {
  this.find({ isDeleted: false });
});

// 5. 创建Model(模型)对象，对文档操作的封装对象，第一个参数表示创建的集合的名称，mongoose会自动将集合名变为复数，第二个参数表示利用的模式对象
const accountsModel = mongoose.model(
  process.env.MONGODB_ACCOUNTSCOLLECTION,
  accountsSchema,
);
console.log(
  "当前处理的数据库名为：",
  process.env.MONGODB_DBNAME,
  "数据库集合为：",
  process.env.MONGODB_ACCOUNTSCOLLECTION,
);
// 6. 导出DemoModel，供其他文件使用
module.exports = accountsModel;
