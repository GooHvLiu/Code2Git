/**
 * 审计日志模块 - 数据模型层
 * GMP 21CFR Part 11 电子记录与电子签名合规
 */
const BaseModel = require('../../db/BaseModel');
const { query } = require('../../db/index');

const TABLE_NAME = 'nex_audit_log';

const ALLOW_FIELDS = [
  'user_id',
  'user_name',
  'action',
  'target',
  'old_value',
  'new_value',
  'result',
  'ip',
  'user_agent',
  'created_at'
];

class AuditModel extends BaseModel {
  constructor() {
    super(TABLE_NAME, ALLOW_FIELDS);
  }

  /**
   * 分页查询审计日志（支持多条件筛选）
   */
  async queryLogs(params = {}) {
    const page = Number(params.page) || 1;
    const pageSize = Math.min(Number(params.pageSize) || 20, 100);
    const offset = (page - 1) * pageSize;

    const where = [];
    const values = [];

    if (params.userId) {
      where.push('user_id = ?');
      values.push(params.userId);
    }
    if (params.action) {
      where.push('action LIKE ?');
      values.push(`%${params.action}%`);
    }
    if (params.target) {
      where.push('target LIKE ?');
      values.push(`%${params.target}%`);
    }
    if (params.startTime) {
      where.push('created_at >= ?');
      values.push(params.startTime);
    }
    if (params.endTime) {
      where.push('created_at <= ?');
      values.push(params.endTime);
    }

    const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const countSql = `SELECT COUNT(*) as total FROM ${TABLE_NAME} ${whereSql}`;
    // LIMIT/OFFSET 直接拼接（数字类型，无SQL注入风险），避免 mysql2 execute 预处理参数错误
    const dataSql = `SELECT * FROM ${TABLE_NAME} ${whereSql} ORDER BY id DESC LIMIT ${pageSize} OFFSET ${offset}`;

    const countResult = await query(countSql, values);
    const total = countResult[0]?.total || 0;
    const list = await query(dataSql, values);

    return { list, total, page, pageSize };
  }
}

module.exports = new AuditModel();
