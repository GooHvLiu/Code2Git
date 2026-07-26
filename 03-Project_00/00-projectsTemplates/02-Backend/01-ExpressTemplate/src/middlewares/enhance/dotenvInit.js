#!/usr/bin/env node
/**
 * 启动前配置脚本
 * 1. 获取局域网IP
 * 2. 读取现有的 .env 文件
 * 3. 更新或添加 LOCAL_IP 环境变量
 * 4. 一般放在package.json内的scripts["init": "npm run kPort && node ./src/middlewars/dotenvInit.js"]
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
// 主函数
function setupEnv() {
  console.log("🔧 开始配置环境变量...");

  // 获取局域网IP
  const localIP = getLocalIP();
  console.log(`🌐 检测到局域网IP: ${localIP}`);

  // 读取现有 .env 文件
  const envContent = readEnvFile();

  // 更新 LOCAL_IP 环境变量
  const updatedContent = updateEnvContent(envContent, "LOCAL_IP", localIP);

  // 写入 .env 文件
  writeEnvFile(updatedContent);

  console.log("✅ 环境变量配置完成！");
  console.log(`💡 LOCAL_IP = ${localIP}`);
}

// 获取局域网IP地址
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  let localIP = "127.0.0.1";

  Object.keys(interfaces).forEach((interfaceName) => {
    interfaces[interfaceName].forEach((info) => {
      // 只获取IPv4且非内部（非127.0.0.1）的IP
      if (info.family === "IPv4" && !info.internal) {
        localIP = info.address;
      }
    });
  });

  return localIP;
}

// 读取 .env 文件内容
function readEnvFile() {
  const envPath = path.join(__dirname, "../../../.env");
  //不使用try/catch方式，如果读取不到.env文件直接报错，不再继续执行下去
  return fs.readFileSync(envPath, "utf8");
}

// 更新或添加环境变量
function updateEnvContent(content, key, value) {
  const lines = content.split("\n");
  const keyPattern = new RegExp(`^${key}=`);
  let found = false;
  let updatedLines = [];

  lines.forEach((line) => {
    if (line.trim().startsWith("#") || line.trim() === "") {
      updatedLines.push(line);
      return;
    }

    if (keyPattern.test(line)) {
      updatedLines.push(`${key}=${value}`);
      found = true;
    } else {
      updatedLines.push(line);
    }
  });

  if (!found) {
    updatedLines.push(`${key}=${value}`);
  }

  return updatedLines.join("\n");
}

// 写入 .env 文件
function writeEnvFile(content) {
  const envPath = path.join(__dirname, "../.env");
  fs.writeFileSync(envPath, content, "utf8");
  console.log(`✅ .env 文件已更新: ${envPath}`);
}

// 执行配置
setupEnv();
