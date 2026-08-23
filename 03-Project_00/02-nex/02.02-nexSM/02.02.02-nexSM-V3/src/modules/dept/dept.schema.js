/**
 * 部门管理模块 - Joi 参数校验
 */
const Joi = require('joi')

const deptSchema = Joi.object({
  parent_id: Joi.number().integer().min(0).default(0),
  dept_name: Joi.string().max(50).required().messages({
    'string.empty': '部门名称不能为空',
    'any.required': '部门名称是必填项'
  }),
  order_num: Joi.number().integer().min(0).default(0),
  leader: Joi.string().max(50).allow('', null),
  phone: Joi.string().max(20).allow('', null),
  email: Joi.string().email().max(100).allow('', null),
  status: Joi.number().valid(0, 1).default(1)
})

module.exports = { deptSchema }
