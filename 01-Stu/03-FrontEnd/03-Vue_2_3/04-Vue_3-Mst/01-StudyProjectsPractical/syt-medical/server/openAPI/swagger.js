const swaggerAutogen = require('swagger-autogen')({ openapi: "3.0.0" });

// 输出openapi文件，扫描入口app.js
const outputFile = './data/swagger-output.json';
const endpointsFiles = ['../app.js'];

// 文档基础信息
const doc = {
  info: {
    title: "尚医通 项目API文档",
    version: "1.0.0",
    description: "尚医通Mock后端接口文档，自动扫描路由生成，无需写注释",
  },
  servers: [
    {
      // 写入IP地址
      url: "http://localhost:8201",
      description: "本地开发环境"
    }
  ]
};

swaggerAutogen(outputFile, endpointsFiles, doc);
