/**
 * 客户模块 - 请求参数 Schema
 * 与数据库 nex_customer 表字段对齐
 *
 * 客户端可传入字段：name, phone, sex, real_name, company_name, company_address, input_user_id, entry_time, remark, status
 * 系统自动维护字段（禁止客户端传入）：id, is_delete, create_time, update_time
 */
const Joi = require('joi');
const { COMMON_STATUS, USER_SEX } = require('../../constants/statusCode');

// ==================== 公共字段规则 ====================

/** 客户名称 name */
const nameField = Joi.string().min(1).max(100).required()
  .messages({
    'string.base': '客户名称必须是字符串',
    'string.empty': '客户名称不能为空',
    'string.min': '客户名称最少1个字符',
    'string.max': '客户名称最大100个字符',
    'any.required': '客户名称不能为空'
  });

/** 联系电话 phone */
const phoneField = Joi.string().pattern(/^1[3-9]\d{9}$/).allow('', null)
  .messages({ 'string.pattern.base': '手机号格式不正确' });

/** 性别 sex（复用用户性别枚举：0未知 1男 2女） */
const sexField = Joi.number().integer().valid(USER_SEX.UNKNOWN, USER_SEX.MALE, USER_SEX.FEMALE).allow(null);

/** 真实姓名 real_name */
const realNameField = Joi.string().max(50).allow('', null);

/** 公司名称 company_name */
const companyNameField = Joi.string().max(200).allow('', null);

/** 公司地址 company_address */
const companyAddressField = Joi.string().max(500).allow('', null);

/** 录入人ID input_user_id */
const inputUserIdField = Joi.number().integer().positive().allow(null);

/** 录入时间 entry_time */
const entryTimeField = Joi.date().allow('', null);

/** 备注 remark */
const remarkField = Joi.string().max(500).allow('', null);

/** 状态 status（0禁用 1启用） */
const statusField = Joi.number().valid(COMMON_STATUS.ENABLED, COMMON_STATUS.DISABLED)
  .default(COMMON_STATUS.ENABLED);

// ==================== 各接口 Schema ====================

/** 新增客户 */
const createCustomerSchema = Joi.object({
  name: nameField,
  phone: phoneField,
  sex: sexField,
  real_name: realNameField,
  company_name: companyNameField,
  company_address: companyAddressField,
  input_user_id: inputUserIdField,
  entry_time: entryTimeField,
  remark: remarkField,
  status: statusField
}).unknown(false);

/** 更新客户（所有字段可选，至少传一个） */
const updateCustomerSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  phone: phoneField,
  sex: sexField,
  real_name: realNameField,
  company_name: companyNameField,
  company_address: companyAddressField,
  input_user_id: inputUserIdField,
  entry_time: entryTimeField,
  remark: remarkField,
  status: Joi.number().valid(COMMON_STATUS.ENABLED, COMMON_STATUS.DISABLED)
}).unknown(false).min(1).messages({
  'object.min': '至少传入一个要修改的字段'
});

/** 路径参数 id */
const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'any.required': 'id不能为空',
      'number.base': 'id必须是数字',
      'number.positive': 'id必须是正整数'
    })
});

/** 批量删除 */
const batchDeleteSchema = Joi.object({
  ids: Joi.array().items(Joi.number().integer().positive()).min(1).required()
    .messages({
      'array.min': '请至少选择一条数据',
      'any.required': 'ids不能为空'
    })
});

/** 修改状态 */
const updateStatusSchema = Joi.object({
  status: Joi.number().valid(COMMON_STATUS.ENABLED, COMMON_STATUS.DISABLED).required()
    .messages({
      'any.required': '状态不能为空',
      'any.only': '状态只能是 0(禁用) 或 1(启用)'
    })
});

/** 分页查询参数 */
const queryCustomerListSchema = Joi.object({
  page: Joi.number().integer().positive().default(1),
  pageSize: Joi.number().integer().positive().max(100).default(10),
  name: Joi.string().allow('', null),
  phone: Joi.string().allow('', null),
  status: Joi.number().valid(0, 1).allow('', null),
  keyword: Joi.string().allow('', null),
  field: Joi.string().allow('', null)
}).unknown(true);

module.exports = {
  createCustomerSchema,
  updateCustomerSchema,
  idParamSchema,
  batchDeleteSchema,
  updateStatusSchema,
  queryCustomerListSchema
};
