/**
 * 部件寿命管理 - 数据模型层
 * 负责部件模板、部件实例、更换记录的数据库操作
 */

const { query } = require('../../db/index');

class DevicePartModel {
  // ==================== 部件模板相关 ====================

  /**
   * 获取所有启用的部件模板
   */
  async getAllTemplates() {
    const sql = `
      SELECT * FROM device_part_template 
      WHERE enabled = 1 
      ORDER BY sort ASC, id ASC
    `;
    return query(sql);
  }

  /**
   * 根据template_key获取模板
   */
  async getTemplateByKey(templateKey) {
    const sql = `SELECT * FROM device_part_template WHERE template_key = ?`;
    const result = await query(sql, [templateKey]);
    return result[0] || null;
  }

  /**
   * 根据ID获取模板
   */
  async getTemplateById(id) {
    const sql = `SELECT * FROM device_part_template WHERE id = ?`;
    const result = await query(sql, [id]);
    return result[0] || null;
  }

  // ==================== 部件实例相关 ====================

  /**
   * 获取所有未删除的部件实例（带模板信息）
   */
  async getAllParts() {
    const sql = `
      SELECT 
        p.*,
        t.name_key as template_name_key,
        t.code_prefix as template_code_prefix,
        t.default_spec as template_default_spec,
        t.icon as template_icon,
        t.stat_method as template_stat_method,
        t.stat_tag as template_stat_tag
      FROM device_part p
      LEFT JOIN device_part_template t ON p.template_id = t.id
      WHERE p.is_deleted = 0
      ORDER BY p.id ASC
    `;
    return query(sql);
  }

  /**
   * 根据ID获取部件实例
   */
  async getPartById(id) {
    const sql = `
      SELECT 
        p.*,
        t.name_key as template_name_key,
        t.code_prefix as template_code_prefix,
        t.default_spec as template_default_spec,
        t.icon as template_icon,
        t.stat_method as template_stat_method,
        t.stat_tag as template_stat_tag
      FROM device_part p
      LEFT JOIN device_part_template t ON p.template_id = t.id
      WHERE p.id = ? AND p.is_deleted = 0
    `;
    const result = await query(sql, [id]);
    return result[0] || null;
  }

  /**
   * 根据部件编码获取部件实例
   */
  async getPartByCode(partCode) {
    const sql = `SELECT * FROM device_part WHERE part_code = ? AND is_deleted = 0`;
    const result = await query(sql, [partCode]);
    return result[0] || null;
  }

  /**
   * 创建部件实例
   */
  async createPart(data) {
    const sql = `
      INSERT INTO device_part 
      (template_id, template_key, part_code, spec, rated_life, used_life, life_unit, install_date, last_replace_date, last_stat_value, status, remark)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      data.template_id,
      data.template_key,
      data.part_code,
      data.spec || '',
      data.rated_life || 0,
      data.used_life || 0,
      data.life_unit || 'times',
      data.install_date || null,
      data.last_replace_date || null,
      data.last_stat_value || 0,
      data.status || 'normal',
      data.remark || ''
    ]);
    return result.insertId;
  }

  /**
   * 更新部件实例
   */
  async updatePart(id, data) {
    const fields = [];
    const values = [];
    
    const allowedFields = ['spec', 'rated_life', 'used_life', 'install_date', 'last_replace_date', 'last_stat_value', 'status', 'remark'];
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(data[field]);
      }
    }
    
    if (fields.length === 0) return false;
    
    values.push(id);
    const sql = `UPDATE device_part SET ${fields.join(', ')} WHERE id = ?`;
    const result = await query(sql, values);
    return result.affectedRows > 0;
  }

  /**
   * 软删除部件实例
   */
  async deletePart(id) {
    const sql = `UPDATE device_part SET is_deleted = 1 WHERE id = ?`;
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * 计算并更新部件状态（根据寿命百分比）
   */
  async updatePartStatus(id, threshold = 20) {
    const part = await this.getPartById(id);
    if (!part || !part.rated_life || part.rated_life <= 0) return 'normal';
    
    const percent = (part.used_life / part.rated_life) * 100;
    let status = 'normal';
    
    if (percent >= 100) {
      status = 'expired';
    } else if (percent >= (100 - threshold / 2)) {
      status = 'warning';
    } else if (percent >= (100 - threshold)) {
      status = 'notice';
    }
    
    if (status !== part.status) {
      await this.updatePart(id, { status });
    }
    
    return status;
  }

  // ==================== 更换记录相关 ====================

  /**
   * 获取更换记录列表（分页）
   */
  async getReplaceRecords({ page = 1, pageSize = 20, templateKey = null, partId = null } = {}) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const sizeNum = Math.max(1, parseInt(pageSize) || 20);
    const offset = (pageNum - 1) * sizeNum;
    let whereSql = 'WHERE 1=1';
    const params = [];
    
    if (templateKey) {
      whereSql += ' AND r.template_key = ?';
      params.push(templateKey);
    }
    if (partId) {
      whereSql += ' AND r.part_id = ?';
      params.push(partId);
    }
    
    const countSql = `SELECT COUNT(*) as total FROM device_part_replace_record r ${whereSql}`;
    const countResult = await query(countSql, params);
    const total = countResult[0].total;
    
    // LIMIT 和 OFFSET 直接拼接（整数，无注入风险），避免 mysql2 execute 参数类型问题
    const listSql = `
      SELECT r.* 
      FROM device_part_replace_record r 
      ${whereSql}
      ORDER BY r.created_at DESC
      LIMIT ${sizeNum} OFFSET ${offset}
    `;
    const list = await query(listSql, params);
    
    return { list, total, page: pageNum, pageSize: sizeNum };
  }

  /**
   * 创建更换记录
   */
  async createReplaceRecord(data) {
    const sql = `
      INSERT INTO device_part_replace_record 
      (part_id, template_key, old_code, new_code, old_used_life, replace_reason, operator_id, operator_name, remark)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      data.part_id,
      data.template_key,
      data.old_code,
      data.new_code,
      data.old_used_life || 0,
      data.replace_reason || '',
      data.operator_id || null,
      data.operator_name || '',
      data.remark || ''
    ]);
    return result.insertId;
  }
}

module.exports = new DevicePartModel();
