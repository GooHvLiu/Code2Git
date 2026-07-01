// 1.1 引入相关所有依赖包
const mongoose = require("mongoose");

// 2. 创建文档的结构对象，设置集合中文档的属性以及属性值的类型
const projectsSchema = new mongoose.Schema(
  {
    /**
     * 项目基础信息
     */
    title: { type: String, required: true, trim: true },
    icon: { type: String, default: "fas fa-cube" },
    description: { type: String, trim: true },
    tech: [{ type: String }],
    route: { type: String, unique: true }, // 前端访问路由
    bindIp: { type: String, default: "" },
    bindPort: { type: String, default: "" },

    /**
     * 进程启动核心配置
     */
    // 项目根目录绝对路径
    workDir: { type: String, required: true },
    // 启动命令 npm start / node app.js
    startCmd: { type: String, required: true },
    // 项目占用端口
    port: { type: Number },
    // pm2进程唯一标识
    pm2Name: { type: String, unique: true },

    /**
     * 运行状态
     */
    status: {
      type: String,
      enum: ["active", "development", "testing", "stopped"],
      default: "stopped",
    },

    /**
     * 日志路径
     */
    logOutPath: String,
    logErrPath: String,
    accessCount: { type: Number, default: 0 },

    //软删除
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

// 3.1 全局查询钩子：默认过滤已删除数据
projectsSchema.pre(/^find/, function () {
  this.find({ isDeleted: false });
});

// 4. 创建Model(模型)对象，对文档操作的封装对象，第一个参数表示创建的集合的名称，mongoose会自动将集合名变为复数，第二个参数表示利用的模式对象
const projectsModel = mongoose.model(
  process.env.MONGODB_PROJECTCOLLECTION,
  projectsSchema,
);
console.log(
  "当前处理的数据库名为：",
  process.env.MONGODB_DBNAME,
  "数据库集合为：",
  process.env.MONGODB_PROJECTCOLLECTION,
);
// 5. 导出DemoModel，供其他文件使用
module.exports = projectsModel;
