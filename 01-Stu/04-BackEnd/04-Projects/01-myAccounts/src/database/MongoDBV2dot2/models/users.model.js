// 1.1 引入相关所有依赖包
const mongoose = require("mongoose");
// 1.2 引入加密包
const bcryptjsSalted = require("@MongoDB/utils/encryptSalted.js");

// 2. 创建文档的结构对象，设置集合中文档的属性以及属性值的类型
const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "用户名不能为空"],
    unique: true,
    trim: true,
    minlength: [3, "用户名至少3个字符"],
    maxlength: [30, "用户名最多30个字符"],
    index: true, // 单字段索引，加速查询
  },
  password: {
    type: String,
    required: [true, "密码不能为空"],
    minlength: [6, "密码至少6个字符"],
    //select: false, // 默认不返回密码字段
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  tokenVersion: {
    type: Number,
    default: 0,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  loginCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
});

// 3.1 复合索引：查询未删除用户时加速
usersSchema.index({ username: 1, isDeleted: 1 });
// 3.2 全局查询钩子：默认过滤已删除数据
usersSchema.pre(/^find/, function () {
  this.find({ isDeleted: false });
});

// 4. 保存前使用pre("save")钩子函数自动加密密码
usersSchema.pre("save", async function () {
  const user = this;

  // 4.1 如果密码未修改，直接跳过
  if (!user.isModified("password")) {
    return;
  }

  // 4.2 如果密码被修改了，加密密码
  try {
    const hashedPassword = await bcryptjsSalted.hashPassword(user.password);
    user.password = hashedPassword;
  } catch (error) {
    console.log("错误信息是：", error);
    throw error; // 让 Mongoose 处理错误
  }
});

// 5. 创建Model(模型)对象，对文档操作的封装对象，第一个参数表示创建的集合的名称，mongoose会自动将集合名变为复数，第二个参数表示利用的模式对象
const usersModel = mongoose.model(
  process.env.MONGODB_USERCOLLECTION,
  usersSchema,
);
console.log(
  "当前处理的数据库名为：",
  process.env.MONGODB_DBNAME,
  "数据库集合为：",
  process.env.MONGODB_USERCOLLECTION,
);
// 6. 导出DemoModel，供其他文件使用
module.exports = usersModel;
