// 1. 引入mongoose
const mongoose = require("mongoose");

//2. 定义数据库连接函数变量
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `mongodb://${process.env.MONGODB_DBHOST}:${process.env.MONGODB_DBPORT}/${process.env.MONGODB_DBNAME}`,
      {
        // 新版mongoose无需废弃参数，保持简洁
      },
    );
    console.log(
      `MongoDB Connected Succes. Connecting to: ${conn.connection.host}:${conn.connection.port}`,
    );
  } catch (error) {
    console.error("MongoDB Connected Fail. Error is:", error.message);
    throw new Error(error.message);
  }
};

// 3. 连接函数变量导出
module.exports = connectDB;
