/**
 * 用户模块 - 请求参数 Schema
 * 与数据库 nex_user 表字段约束严格对齐
 *
 * 数据库字段说明：
 * - 客户端可传入字段：username, password, role, real_name, sex, phone, email, dept_id, avatar, remark, status
 * - 系统自动维护字段（客户端禁止传入）：id, login_ip, login_date, is_delete, create_time, create_by, update_time, update_by, is_first_login, first_login_at
 */
const Joi = require('joi');
const { USER_STATUS, USER_ROLE, USER_SEX } = require('../../constants/statusCode');

// ==================== 公共字段规则（对齐数据库 varchar 长度） ====================

/** 登录账号 username varchar(50) NOT NULL */
const usernameField = Joi.string().min(2).max(50).required()
  .messages({
    'string.base': '用户名必须是字符串',
    'string.empty': '用户名不能为空',
    'string.min': '用户名最少2个字符',
    'string.max': '用户名最大50个字符',
    'any.required': '用户名不能为空'
  });

/** 登录密码 password varchar(100) NOT NULL（明文传入，service层加密） */
const passwordField = Joi.string().min(6).max(32).required()
  .messages({
    'string.base': '密码必须是字符串',
    'string.empty': '密码不能为空',
    'string.min': '密码最少6个字符',
    'string.max': '密码最大32个字符',
    'any.required': '密码不能为空'
  });

/** 更新时密码可选（传了就改，不传就不改） */
const passwordOptional = Joi.string().min(6).max(32).allow('', null);

/** 岗位类别 role varchar(50) DEFAULT 'operator' */
const roleField = Joi.string()
  .valid(USER_ROLE.ADMINISTRATOR, USER_ROLE.ENGINEER, USER_ROLE.OPERATOR)
  .default(USER_ROLE.OPERATOR)
  .messages({
    'any.only': '岗位类别只能是 administrator / engineer / operator'
  });

/** 真实姓名 real_name varchar(50) DEFAULT 'operator' */
const realNameField = Joi.string().max(50).allow('', null);

/** 性别 sex tinyint DEFAULT 0（0未知 1男 2女） */
const sexField = Joi.number().integer().valid(USER_SEX.UNKNOWN, USER_SEX.MALE, USER_SEX.FEMALE).default(USER_SEX.UNKNOWN);

/** 手机号 phone varchar(20) DEFAULT '' */
const phoneField = Joi.string().pattern(/^1[3-9]\d{9}$/).allow('', null)
  .messages({ 'string.pattern.base': '手机号格式不正确' });

/** 邮箱 email varchar(100) DEFAULT '' */
const emailField = Joi.string().email({ tlds: { allow: false } }).max(100).allow('', null)
  .messages({ 'string.email': '邮箱格式不正确', 'string.max': '邮箱最大100个字符' });

/** 部门ID dept_id int DEFAULT NULL */
const deptIdField = Joi.number().integer().positive().allow(null);

/** 头像 avatar varchar(255) DEFAULT '' */
const avatarField = Joi.string().max(255).allow('', null);

/** 备注 remark varchar(500) DEFAULT '' */
const remarkField = Joi.string().max(500).allow('', null);

/** 账号状态 status tinyint NOT NULL DEFAULT 1（1启用 0禁用） */
const statusField = Joi.number().valid(USER_STATUS.ENABLED, USER_STATUS.DISABLED)
  .default(USER_STATUS.ENABLED);

// ==================== 各接口 Schema ====================

/** 登录请求体 */
const loginSchema = Joi.object({
  username: usernameField,
  password: passwordField,
  uuid: Joi.string().allow('', null),        // 验证码uuid
  captchacode: Joi.string().allow('', null)  // 验证码
}).unknown(false);

/** 新增用户请求体 */
const createUserSchema = Joi.object({
  username: usernameField,
  password: passwordField,
  role: roleField,
  real_name: realNameField,
  sex: sexField,
  phone: phoneField,
  email: emailField,
  dept_id: deptIdField,
  avatar: avatarField,
  remark: remarkField,
  status: statusField
  // 以下字段禁止客户端传入，由数据库默认值 / service层控制：
  // id, login_ip, login_date, is_delete, create_time, create_by, update_time, update_by, is_first_login, first_login_at
}).unknown(false);

/** 更新用户请求体（所有字段可选，至少传一个） */
const updateUserSchema = Joi.object({
  username: Joi.string().min(2).max(50),
  password: passwordOptional,
  role: Joi.string().valid(USER_ROLE.ADMINISTRATOR, USER_ROLE.ENGINEER, USER_ROLE.OPERATOR),
  real_name: realNameField,
  sex: sexField,
  phone: phoneField,
  email: emailField,
  dept_id: deptIdField,
  avatar: avatarField,
  remark: remarkField,
  status: Joi.number().valid(USER_STATUS.ENABLED, USER_STATUS.DISABLED)
}).unknown(false).min(1).messages({
  'object.min': '至少传入一个要修改的字段'
});

/** 路径参数 id 校验 */
const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'any.required': 'id不能为空',
      'number.base': 'id必须是数字',
      'number.positive': 'id必须是正整数'
    })
});

/** 批量删除请求体 */
const batchDeleteSchema = Joi.object({
  ids: Joi.array().items(Joi.number().integer().positive()).min(1).required()
    .messages({
      'array.min': '请至少选择一条数据',
      'any.required': 'ids不能为空'
    })
});

/** 修改用户状态请求体 */
const updateStatusSchema = Joi.object({
  status: Joi.number().valid(USER_STATUS.ENABLED, USER_STATUS.DISABLED).required()
    .messages({
      'any.required': '状态不能为空',
      'any.only': '状态只能是 0(禁用) 或 1(启用)'
    })
});

/** 分页查询参数 */
const queryUserListSchema = Joi.object({
  page: Joi.number().integer().positive().default(1),
  pageSize: Joi.number().integer().positive().max(100).default(10),
  username: Joi.string().allow('', null),
  status: Joi.number().valid(0, 1).allow('', null),
  role: Joi.string().allow('', null)
}).unknown(true); // query参数宽松，允许多余字段

module.exports = {
  loginSchema,
  createUserSchema,
  updateUserSchema,
  idParamSchema,
  batchDeleteSchema,
  updateStatusSchema,
  queryUserListSchema
};
