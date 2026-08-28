/**
 * ==========================================
 * 权限模块 - 参数校验 Schema
 * ==========================================
 * 使用 Joi 进行参数校验，在路由层通过 validate 中间件调用
 */
const Joi = require('joi')

// 保存角色权限分配 - 请求体校验
const saveRolePermissionsSchema = Joi.object({
  roleId: Joi.number().integer().positive().required().messages({
    'number.base': '角色ID必须是数字',
    'number.integer': '角色ID必须是整数',
    'number.positive': '角色ID必须大于0',
    'any.required': '角色ID不能为空'
  }),
  roleCode: Joi.string().optional().allow('').messages({
    'string.base': '角色编码必须是字符串'
  }),
  menuIds: Joi.array().items(Joi.string().min(1).max(32)).required().messages({
    'array.base': '菜单ID必须是数组',
    'any.required': '菜单ID数组不能为空',
    'string.base': '菜单ID必须是字符串',
    'string.min': '菜单ID长度不能少于1个字符',
    'string.max': '菜单ID长度不能超过32个字符'
  })
})

// 获取角色已分配菜单ID - 路由参数校验
const getRoleMenuIdsSchema = Joi.object({
  roleId: Joi.number().integer().positive().required().messages({
    'number.base': '角色ID必须是数字',
    'number.integer': '角色ID必须是整数',
    'number.positive': '角色ID必须大于0',
    'any.required': '角色ID不能为空'
  })
})

// 清除用户权限缓存 - 请求体校验
const clearUserCacheSchema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    'number.base': '用户ID必须是数字',
    'number.integer': '用户ID必须是整数',
    'number.positive': '用户ID必须大于0',
    'any.required': '用户ID不能为空'
  })
})

module.exports = {
  saveRolePermissionsSchema,
  getRoleMenuIdsSchema,
  clearUserCacheSchema
}
