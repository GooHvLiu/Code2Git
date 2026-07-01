const salted = require("./encryptSalted.js");

const inputValue = "hello123";
// 数据库存的正确哈希
const hashValue1 =
  "$2b$10$CjirYW6S46LjHg2EcELebeoi3nTViVhY0G.bhP7bXVl/j.UiQxBma";
// 错误哈希
const hashValue2 = "woshibuduide";

// 1. 加密测试：同一密码每次生成不同hash
async function testEncrypt() {
  const newHash = await salted.hashPassword(inputValue);
  console.log(`原始密码：${inputValue}`);
  console.log(`本次生成哈希：${newHash}\n`);
}

// 2. 正确密码校验
async function testCompare() {
  const matchRight = await salted.comparePassword(inputValue, hashValue1);
  console.log("=== 正确密码校验 ===");
  console.log(`输入密码：${inputValue}`);
  console.log(`库中哈希：${hashValue1}`);
  console.log(`是否匹配：${matchRight}\n`);

  // 3. 错误密码校验
  const matchWrong = await salted.comparePassword("wrongpwd", hashValue1);
  console.log("=== 错误密码校验 ===");
  console.log(`输入密码：wrongpwd`);
  console.log(`库中哈希：${hashValue1}`);
  console.log(`是否匹配：${matchWrong}\n`);

  // 4. 乱码哈希直接返回false
  const invalidHash = await salted.comparePassword(inputValue, hashValue2);
  console.log("=== 非法哈希字符串校验 ===");
  console.log(`是否匹配：${invalidHash}`);
}

// 串行执行测试
(async () => {
  await testEncrypt();
  await testCompare();
})();
