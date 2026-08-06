/**
 * 接口响应业务码常量定义
 */

// 基础业务码
export const CODE_SUCCESS = 200;
export const CODE_SERVER_ERROR = 500; // 服务器未知异常

// 登录业务异常 10xxx
export const CODE_ACCOUNT_TYPE_ERR = 10000; // 账号数据类型不一致
export const CODE_ACCOUNT_NOT_EXIST = 10001; // 账号不存在
export const CODE_ACCOUNT_DISABLED = 10002; // 账号已禁用
export const CODE_ACCOUNT_PWD_ERR = 10003; // 账号或密码错误

// JWT Token鉴权异常 400xx
export const CODE_TOKEN_EMPTY = 40001; // token不存在
export const CODE_TOKEN_INVALID = 40002; // token无效/被篡改
export const CODE_TOKEN_EXPIRED = 40003; // token已过期

// 分组集合（业务逻辑直接使用）
/** 需要自动清除token + 跳转登录的token错误码集合 */
export const TOKEN_AUTO_REDIRECT_CODES = [
  CODE_TOKEN_EMPTY,
  CODE_TOKEN_EXPIRED
];

// 不需要 token 的接口白名单
export const NO_TOKEN_API = ["/login", "/captchaImage"];

// 仅用于控制台日志打印，业务逻辑不要依赖此对象
export const CODE_TEXT_MAP = {
  [CODE_SUCCESS]: "业务成功",
  [CODE_SERVER_ERROR]: "服务器未知异常",
  [CODE_ACCOUNT_TYPE_ERR]: "账号数据类型不一致",
  [CODE_ACCOUNT_NOT_EXIST]: "账号不存在",
  [CODE_ACCOUNT_DISABLED]: "账号已禁用",
  [CODE_ACCOUNT_PWD_ERR]: "账号或密码错误",
  [CODE_TOKEN_EMPTY]: "token不存在",
  [CODE_TOKEN_INVALID]: "token无效/篡改",
  [CODE_TOKEN_EXPIRED]: "token已过期",
};