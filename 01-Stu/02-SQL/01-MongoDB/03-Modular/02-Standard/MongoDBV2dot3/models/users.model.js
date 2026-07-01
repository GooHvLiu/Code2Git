// 1.1 引入相关所有依赖包
const mongoose = require("mongoose");
// 1.2 引入加密包
const bcryptjsSalted = require("@MongoDB/utils/encryptSalted.js");
// 1.3 引入验证包
const {
  USERNAME_REG,
  EMAIL_REG,
  PWD_MIN_LENGTH,
  PWD_MAX_LENGTH,
} = require("@MongoDB/middleware/validate.middleware.js");

// 2. 创建文档的结构对象，设置集合中文档的属性以及属性值的类型
const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "用户名不能为空"],
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        return USERNAME_REG.test(v);
      },
      message: "用户名必须4-16位，仅允许字母、数字",
    },
    index: true, // 单字段索引，加速查询
  },
  password: {
    type: String,
    required: [true, "密码不能为空"],
    minlength: [PWD_MIN_LENGTH, `密码最少${PWD_MIN_LENGTH}位`],
    maxlength: [PWD_MAX_LENGTH, `密码最大${PWD_MAX_LENGTH}位`],
  },
  email: {
    type: String,
    //required: [true, "邮箱不能为空"],  按需：如果邮箱可选删掉这一行
    unique: true,
    trim: true,
    lowercase: true, // 自动转小写，避免 Aa@163.com 和 aa@163.com 判定为两个邮箱
    validate: {
      validator: function (v) {
        if (!v) return true;
        return EMAIL_REG.test(v);
      },
      message: "邮箱格式不合法",
    },
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
usersSchema.index({ email: 1, isDeleted: 1 });
// 3.2 全局查询钩子：默认过滤已删除数据
usersSchema.pre(/^find/, function () {
  this.find({ isDeleted: false });
});

/** 
 * 4.1 全局预处理，所有写入前pre("validate")自动清洗字段
 * 4.2 保存前使用pre("save")钩子函数自动加密密码
 * 查询所有，包含已删除用户（管理后台专用）
    const allUsers = await usersModel.find({}, null, { skipMiddleware: true });
 * 根据ID查已删除用户
    const delUser = await usersModel.findById(id, null, { skipMiddleware: true }); 
 */
usersSchema.pre("validate", async function () {
  if (this.username) this.username = this.username.trim();
  if (this.email) this.email = this.email.trim();
  if (this.password) this.password = this.password.trim();
});
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
