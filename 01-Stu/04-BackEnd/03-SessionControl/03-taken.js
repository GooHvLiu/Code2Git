// 1. 导入 jsonwebtokan
const jwt = require("jsonwebtoken");

/* // 2. 创建 token
{
  // jwt.sign(数据, 加密字符串, 配置对象（生命周期，单位是秒）)
  let token = jwt.sign(
    {
      username: "zhangsan",
    },
    "atguigu",
    {
      expiresIn: 10, //单位是 秒
    },
  );
  console.log("生成的token为：", token);
} */

// 3. 解析/校验 token
{
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InpoYW5nc2FuIiwiaWF0IjoxNzgyMDk5MDY4LCJleHAiOjE3ODIwOTkwNzh9.Ol591RyGeYQsZnyh5hqf6eL9w48RZz - xSxPtnwD2Vr0";
  jwt.verify(token, "atguigu", (err, data) => {
    if (err) {
      console.log("校验失败~~");
      return;
    }
    console.log(data);
  });
}
