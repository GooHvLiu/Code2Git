/**
 * 角色管理模块 - Joi 参数校验
 */
const Joi = require('joi')

const roleSchema = Joi.object({
  role_name: Joi.string().max(50).required().messages({
    'string.empty': '角色名称不能为空',
    'any.required': '角色名称是必填项'
  }),
  role_code: Joi.string().max(50).pattern(/^[a-zA-Z_][a-zA-Z0-9_]*$/).required().messages({
    'string.empty': '角色编码不能为空',
    'string.pattern.base': '角色编码只能包含字母、数字、下划线，且以字母或下划线开头',
    'any.required': '角色编码是必填项'
  }),
  description: Joi.string().max(200).allow('', null),
  status: Joi.number().valid(0, 1).default(1),
  sort: Joi.number().integer().min(0).default(0),
  menuIds: Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.number())).allow(null)
})

module.exports = { roleSchema }
