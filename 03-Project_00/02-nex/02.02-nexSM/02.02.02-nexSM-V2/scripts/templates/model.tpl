/**
 * {{name}} 模块 - 数据模型层
 * 自动生成，根据业务需求调整字段白名单和自定义方法
 */
const BaseModel = require('../../db/BaseModel');

// 数据表名称
const TABLE_NAME = '{{name_snake}}';

// 允许操作的字段白名单（安全防护，防止超量赋值）
// TODO: 请根据实际数据表字段补充
const ALLOW_FIELDS = [
  'id',
  'created_at',
  'updated_at'
  // 在此处添加业务字段
];

class {{Name}}Model extends BaseModel {
  constructor() {
    super(TABLE_NAME, ALLOW_FIELDS);
  }

  // ==================== 自定义业务方法 ====================
  // 在此处添加 {{name}} 模块专属查询方法

}

module.exports = new {{Name}}Model();
