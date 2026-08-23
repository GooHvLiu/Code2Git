/**
 * 审计日志模块 - 数据模型层
 * GMP 21CFR Part 11 电子记录与电子签名合规
 * 特性：哈希链校验（防止篡改）、只增不改不删（数据库触发器强制）
 */
const crypto = require('crypto')
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
  'reason',
  'ip',
  'user_agent',
  'prev_hash',
  'current_hash',
  'created_at'
];

class AuditModel extends BaseModel {
  constructor() {
    super(TABLE_NAME, ALLOW_FIELDS);
  }

  /**
   * 计算记录的哈希值（SHA-256）
   * 将记录的关键字段 + 前一条哈希值 组合计算
   */
  calculateHash(record, prevHash) {
    const content = [
      record.user_id,
      record.user_name,
      record.action,
      record.target,
      record.old_value,
      record.new_value,
      record.result,
      record.reason,
      record.ip,
      record.created_at,
      prevHash || ''
    ].join('|')
    return crypto.createHash('sha256').update(content).digest('hex')
  }

  /**
   * 获取最后一条审计日志（用于哈希链）
   */
  async getLastLog() {
    const result = await query(`SELECT * FROM ${TABLE_NAME} ORDER BY id DESC LIMIT 1`)
    return result[0] || null
  }

  /**
   * 插入审计日志（自动计算哈希链）
   */
  async insertWithHash(data) {
    const lastLog = await this.getLastLog()
    const prevHash = lastLog?.current_hash || ''
    const currentHash = this.calculateHash(data, prevHash)
    const record = { ...data, prev_hash: prevHash, current_hash: currentHash }
    const safeData = this.filterFields(record)
    return await this.create(safeData)
  }

  /**
   * 校验哈希链完整性
   * 逐条验证每条记录的 current_hash 是否等于重新计算的值
   * @returns {Object} { valid: boolean, brokenAt: number|null, total: number }
   */
  async verifyHashChain() {
    const allLogs = await query(`SELECT * FROM ${TABLE_NAME} ORDER BY id ASC`)
    let prevHash = ''
    for (const log of allLogs) {
      const expectedHash = this.calculateHash(log, prevHash)
      if (expectedHash !== log.current_hash) {
        return { valid: false, brokenAt: log.id, total: allLogs.length }
      }
      prevHash = log.current_hash
    }
    return { valid: true, brokenAt: null, total: allLogs.length }
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
    const dataSql = `SELECT * FROM ${TABLE_NAME} ${whereSql} ORDER BY id DESC LIMIT ${pageSize} OFFSET ${offset}`;

    const countResult = await query(countSql, values);
    const total = countResult[0]?.total || 0;
    const list = await query(dataSql, values);

    return { list, total, page, pageSize };
  }
}

module.exports = new AuditModel();
