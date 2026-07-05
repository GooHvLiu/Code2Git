// 1. 引入依赖包和定义变量
const { betterAuth } = require("better-auth");
const { mongodbAdapter } = require("better-auth/adapters/mongodb");
const { getDb } = require("../models/db");
let _auth = null;

// 2. 初始化Auth
async function initAuth() {
  if (_auth) return _auth;

  const db = await getDb();

  _auth = betterAuth({
    database: mongodbAdapter(db),
    // 必须与 app.all() 中的前缀完全一致,若修改，两边一起修改
    basePath: "/api/auth",
    //认证方法
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      },
    },
  });

  return _auth;
}

// 3，获取auth
function getAuth() {
  if (!_auth) {
    throw new Error("Auth 未初始化，请先调用 initAuth()");
  }
  return _auth;
}

module.exports = { initAuth, getAuth };
