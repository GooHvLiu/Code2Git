/**
 * 文件上传模块 - 请求参数 Schema
 * 文件上传本身由 multer 中间件处理（校验大小、类型）
 * 这里只校验删除等接口的普通参数
 */
const Joi = require('joi');

/** 删除文件请求体 */
const deleteFileSchema = Joi.object({
  path: Joi.string().min(1).required()
    .messages({
      'string.base': '文件路径必须是字符串',
      'string.empty': '文件路径不能为空',
      'string.min': '文件路径不能为空',
      'any.required': '文件路径不能为空'
    })
}).unknown(false);

module.exports = {
  deleteFileSchema
};
