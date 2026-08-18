/**
 * 客户模块 - 数据模型层
 */
const BaseModel = require('../../db/BaseModel');

// 数据表名称
const TABLE_NAME = 'nex_customer';

// 允许操作的字段白名单（安全防护，防止超量赋值）
const ALLOW_FIELDS = [
  'name',
  'phone',
  'sex',
  'real_name',
  'company_name',
  'company_address',
  'input_user_id',
  'entry_time',
  'remark',
  'status',
  'is_delete',
  'create_time',
  'update_time'
];

class CustomerModel extends BaseModel {
  constructor() {
    super(TABLE_NAME, ALLOW_FIELDS);
  }
}

module.exports = new CustomerModel();
