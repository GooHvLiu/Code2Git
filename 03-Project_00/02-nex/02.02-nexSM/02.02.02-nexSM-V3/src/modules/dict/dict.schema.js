/**
 * 数据字典模块 - Joi 参数校验
 */
const Joi = require('joi')

// 字典类型校验
const dictTypeSchema = Joi.object({
  dict_name: Joi.string().max(50).required().messages({
    'string.empty': '字典类型名称不能为空',
    'any.required': '字典类型名称是必填项'
  }),
  dict_code: Joi.string().max(50).pattern(/^[a-zA-Z_][a-zA-Z0-9_]*$/).required().messages({
    'string.empty': '字典类型编码不能为空',
    'string.pattern.base': '字典类型编码只能包含字母、数字、下划线，且以字母或下划线开头',
    'any.required': '字典类型编码是必填项'
  }),
  description: Joi.string().max(200).allow('', null),
  status: Joi.number().valid(0, 1).default(1),
  sort: Joi.number().integer().min(0).default(0)
})

// 字典项校验
const dictItemSchema = Joi.object({
  type_id: Joi.number().integer().positive().required().messages({
    'any.required': '字典类型ID是必填项'
  }),
  label: Joi.string().max(100).required().messages({
    'string.empty': '字典标签不能为空',
    'any.required': '字典标签是必填项'
  }),
  value: Joi.string().max(100).required().messages({
    'string.empty': '字典值不能为空',
    'any.required': '字典值是必填项'
  }),
  css_class: Joi.string().max(50).allow('', null),
  list_class: Joi.string().max(50).allow('', null),
  is_default: Joi.number().valid(0, 1).default(0),
  status: Joi.number().valid(0, 1).default(1),
  sort: Joi.number().integer().min(0).default(0),
  remark: Joi.string().max(500).allow('', null)
})

module.exports = {
  dictTypeSchema,
  dictItemSchema
}
