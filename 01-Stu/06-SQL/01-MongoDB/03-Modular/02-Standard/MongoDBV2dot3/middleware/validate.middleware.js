/**
 * 全局通用字段校验规则
 * 用户名、邮箱、密码、手机号统一正则/长度规范
 */

// 局部常量（优先内部使用，避免this问题）.USERNAME_REG可导出做Mongoose校验
const USERNAME_REG = /^[A-Za-z0-9]{4,16}$/;
const USERNAME_MIN_LENGTH = 4;
const USERNAME_MAX_LENGTH = 16;

// 邮箱标准正则
const EMAIL_REG = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

// 密码：至少6位，支持字母数字符号（可按需强化复杂度）
const PWD_MIN_LENGTH = 6;
const PWD_MAX_LENGTH = 32;
// 强密码：大小写+数字 同时存在
const STRONG_PWD_REG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,32}$/;

/**
 * 校验用户名
 * @param {string} username
 * @returns {Boolean}
 */
exports.validateUsername = function (username) {
  if (!username || typeof username !== "string") return false;
  const trim = username.trim();
  if (trim.length < USERNAME_MIN_LENGTH || trim.length > USERNAME_MAX_LENGTH)
    return false;
  return USERNAME_REG.test(trim);
};

/**
 * 校验邮箱（选填，空/空白串直接放行）
 * @param {string} email
 * @returns {Boolean}
 */
exports.validateEmail = function (email) {
  if (!email) return true;
  const trim = email.trim();
  if (trim === "") return true;
  return EMAIL_REG.test(trim);
};

/**
 * 仅校验密码长度
 * @param {string} pwd
 * @returns {Boolean}
 */
exports.validatePwdLength = function (pwd) {
  if (!pwd || typeof pwd !== "string") return false;
  const trim = pwd.trim();
  return trim.length >= PWD_MIN_LENGTH && trim.length <= PWD_MAX_LENGTH;
};

/**
 * 校验强密码：长度合规 + 包含大小写字母+数字
 * @param {string} pwd
 * @returns {Boolean}
 */
exports.validateStrongPwd = function (pwd) {
  // 先校验基础长度
  if (!exports.validatePwdLength(pwd)) return false;
  const trim = pwd.trim();
  // 使用强密码正则匹配
  return STRONG_PWD_REG.test(trim);
};

// 统一对外导出常量，其他地方可单独使用正则
exports.USERNAME_REG = USERNAME_REG;
exports.USERNAME_MIN_LENGTH = USERNAME_MIN_LENGTH;
exports.USERNAME_MAX_LENGTH = USERNAME_MAX_LENGTH;
exports.EMAIL_REG = EMAIL_REG;
exports.PWD_MIN_LENGTH = PWD_MIN_LENGTH;
exports.PWD_MAX_LENGTH = PWD_MAX_LENGTH;
exports.STRONG_PWD_REG = STRONG_PWD_REG;

//如何使用？
/* // 导入校验工具，直接调用封装好的校验函数（推荐，业务层通用）
const { validateStrongPwd } = require("@MongoDB/utils/validators");
const inputPwd = "Abc123456";
if (!validateStrongPwd(inputPwd)) {
  return { code: 400, msg: "密码必须包含大小写字母和数字，长度6-32位" };
} */

/* //单独引入 STRONG_PWD_REG 正则，自定义逻辑校验
const {
  STRONG_PWD_REG,
  validatePwdLength,
} = require("@MongoDB/utils/validators");

const pwd = "123456Aa";
// 先判断长度
if (validatePwdLength(pwd)) {
  // 单独使用强密码正则
  const isStrong = STRONG_PWD_REG.test(pwd.trim());
  console.log("是否强密码：", isStrong);
} */

/* //结合注册 / 创建账号接口实战示例（你的 createAccount）
const {
  validateStrongPwd,
  validateUsername,
  validateEmail,
} = require("@MongoDB/utils/validators");

async function register(reqBody) {
  const { username, email, password } = reqBody;

  // 1. 用户名校验
  if (!validateUsername(username)) {
    return { code: 400, msg: "用户名4-16位，仅支持字母数字" };
  }

  // 2. 邮箱校验
  if (!validateEmail(email)) {
    return { code: 400, msg: "邮箱格式错误" };
  }

  // 3. 强密码校验
  if (!validateStrongPwd(password)) {
    return { code: 400, msg: "密码长度6-32位，必须包含大写、小写、数字" };
  }

  // 校验全部通过，创建用户
}
 */
