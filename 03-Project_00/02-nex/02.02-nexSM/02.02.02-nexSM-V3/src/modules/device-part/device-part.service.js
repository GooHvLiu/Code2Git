/**
 * 部件寿命管理 - 业务逻辑层
 * 负责部件模板、部件实例、更换记录的业务逻辑处理
 */

const devicePartModel = require('./device-part.model');
const { BusinessError, ERROR_CODE } = require('../../constants/errorCode');
const dayjs = require('dayjs');

class DevicePartService {
  // ==================== 部件模板相关 ====================

  /**
   * 获取所有启用的部件模板
   */
  async getAllTemplates() {
    return devicePartModel.getAllTemplates();
  }

  // ==================== 部件实例相关 ====================

  /**
   * 获取所有部件实例（带模板信息和计算字段）
   */
  async getAllParts() {
    const parts = await devicePartModel.getAllParts();
    
    // 计算剩余寿命、寿命百分比等字段
    return parts.map(part => {
      const remainingLife = Math.max(0, (part.rated_life || 0) - (part.used_life || 0));
      const lifePercent = part.rated_life > 0 ? Math.min(100, (part.used_life / part.rated_life) * 100) : 0;
      
      return {
        ...part,
        remaining_life: remainingLife,
        life_percent: lifePercent
      };
    });
  }

  /**
   * 根据ID获取部件实例
   */
  async getPartById(id) {
    const part = await devicePartModel.getPartById(id);
    if (!part) {
      throw new BusinessError(ERROR_CODE.NOT_FOUND, null, { entity: '部件' });
    }
    
    const remainingLife = Math.max(0, (part.rated_life || 0) - (part.used_life || 0));
    const lifePercent = part.rated_life > 0 ? Math.min(100, (part.used_life / part.rated_life) * 100) : 0;
    
    return {
      ...part,
      remaining_life: remainingLife,
      life_percent: lifePercent
    };
  }

  /**
   * 添加部件实例（从模板选择）
   */
  async addPart(data, operator = null) {
    // 验证模板是否存在（支持 template_id 或 template_key）
    let template = null;
    if (data.template_id) {
      template = await devicePartModel.getTemplateById(data.template_id);
    } else if (data.template_key) {
      template = await devicePartModel.getTemplateByKey(data.template_key);
    }
    if (!template) {
      throw new BusinessError(ERROR_CODE.NOT_FOUND, null, { entity: '部件模板' });
    }
    
    // 验证部件编码是否已存在
    if (data.part_code) {
      const existingPart = await devicePartModel.getPartByCode(data.part_code);
      if (existingPart) {
        throw new BusinessError(ERROR_CODE.ALREADY_EXISTS, null, { entity: '部件编码', value: data.part_code });
      }
    } else {
      // 自动生成部件编码：前缀-序号
      const allParts = await devicePartModel.getAllParts();
      const sameTemplateParts = allParts.filter(p => p.template_key === template.template_key);
      const nextSeq = String(sameTemplateParts.length + 1).padStart(3, '0');
      data.part_code = `${template.code_prefix}-${nextSeq}`;
    }
    
    // 创建部件实例
    const partData = {
      template_id: template.id,
      template_key: template.template_key,
      part_code: data.part_code,
      spec: data.spec || template.default_spec,
      rated_life: data.rated_life || template.default_rated_life,
      used_life: 0,
      life_unit: template.life_unit,
      install_date: data.install_date || dayjs().format('YYYY-MM-DD'),
      last_replace_date: null,
      last_stat_value: 0,
      status: 'normal',
      remark: data.remark || ''
    };
    
    const partId = await devicePartModel.createPart(partData);
    return this.getPartById(partId);
  }

  /**
   * 更新部件实例（额定寿命、规格、备注等）
   */
  async updatePart(id, data, operator = null) {
    const part = await devicePartModel.getPartById(id);
    if (!part) {
      throw new BusinessError(ERROR_CODE.NOT_FOUND, null, { entity: '部件' });
    }
    
    const updateData = {};
    if (data.spec !== undefined) updateData.spec = data.spec;
    if (data.rated_life !== undefined) updateData.rated_life = data.rated_life;
    if (data.install_date !== undefined) updateData.install_date = data.install_date;
    if (data.remark !== undefined) updateData.remark = data.remark;
    
    if (Object.keys(updateData).length > 0) {
      await devicePartModel.updatePart(id, updateData);
    }
    
    // 重新计算状态
    if (data.rated_life !== undefined) {
      await devicePartModel.updatePartStatus(id);
    }
    
    return this.getPartById(id);
  }

  /**
   * 删除部件实例（软删除）
   */
  async deletePart(id, operator = null) {
    const part = await devicePartModel.getPartById(id);
    if (!part) {
      throw new BusinessError(ERROR_CODE.NOT_FOUND, null, { entity: '部件' });
    }
    
    await devicePartModel.deletePart(id);
    return true;
  }

  /**
   * 部件更换录入
   */
  async replacePart(id, data, operator = null) {
    const part = await devicePartModel.getPartById(id);
    if (!part) {
      throw new BusinessError(ERROR_CODE.NOT_FOUND, null, { entity: '部件' });
    }
    
    // 验证新部件编码
    if (data.new_code && data.new_code !== part.part_code) {
      const existingPart = await devicePartModel.getPartByCode(data.new_code);
      if (existingPart) {
        throw new BusinessError(ERROR_CODE.ALREADY_EXISTS, null, { entity: '部件编码', value: data.new_code });
      }
    }
    
    const oldCode = part.part_code;
    const newCode = data.new_code || part.part_code;
    const oldUsedLife = part.used_life;
    
    // 创建更换记录
    await devicePartModel.createReplaceRecord({
      part_id: id,
      template_key: part.template_key,
      old_code: oldCode,
      new_code: newCode,
      old_used_life: oldUsedLife,
      replace_reason: data.replace_reason || '',
      operator_id: operator ? operator.id : null,
      operator_name: operator ? operator.username : '',
      remark: data.remark || ''
    });
    
    // 更新部件信息：重置使用寿命为0，更新部件编码，更新更换日期
    const updateData = {
      used_life: 0,
      last_replace_date: dayjs().format('YYYY-MM-DD'),
      last_stat_value: 0,
      status: 'normal'
    };
    if (data.new_code) {
      updateData.part_code = data.new_code;
    }
    
    await devicePartModel.updatePart(id, updateData);
    
    return this.getPartById(id);
  }

  // ==================== 使用寿命统计相关 ====================

  /**
   * 更新部件使用寿命（给什么输出什么，预留运算位置）
   * @param {number} partId - 部件ID
   * @param {number} plcValue - PLC计数值（原始值）
   * @returns {Object} 更新结果
   */
  async updateUsedLife(partId, plcValue) {
    const part = await devicePartModel.getPartById(partId);
    if (!part) {
      throw new BusinessError(ERROR_CODE.NOT_FOUND, null, { entity: '部件' });
    }
    
    const lastStatValue = part.last_stat_value || 0;
    const increment = Math.max(0, plcValue - lastStatValue);
    
    // ============================================
    // TODO: 这里是使用寿命的运算位置，后期用户自己修改
    // 当前实现：直接使用PLC计数增量作为使用寿命增量
    // ============================================
    const lifeIncrement = increment; // 当前运算：直接使用增量
    // ============================================
    
    const newUsedLife = (part.used_life || 0) + lifeIncrement;
    
    // 更新部件使用寿命和上次统计值
    await devicePartModel.updatePart(partId, {
      used_life: newUsedLife,
      last_stat_value: plcValue
    });
    
    // 重新计算状态
    const newStatus = await devicePartModel.updatePartStatus(partId);
    
    return {
      part_id: partId,
      plc_value: plcValue,
      last_stat_value: lastStatValue,
      increment: increment,
      life_increment: lifeIncrement,
      old_used_life: part.used_life,
      new_used_life: newUsedLife,
      status: newStatus
    };
  }

  /**
   * 批量更新所有部件的使用寿命（从PLC数据读取）
   * @param {Object} plcData - PLC数据对象 { tagName: value }
   * @returns {Array} 更新结果列表
   */
  async batchUpdateUsedLife(plcData) {
    const parts = await devicePartModel.getAllParts();
    const results = [];
    
    for (const part of parts) {
      if (part.template_stat_method === 'plc_count' && part.template_stat_tag) {
        const plcValue = plcData[part.template_stat_tag];
        if (plcValue !== undefined && plcValue !== null) {
          try {
            const result = await this.updateUsedLife(part.id, Number(plcValue));
            results.push(result);
          } catch (err) {
            console.error(`[部件寿命统计] 更新部件 ${part.part_code} 失败:`, err.message);
          }
        }
      }
    }
    
    return results;
  }

  // ==================== 更换记录相关 ====================

  /**
   * 获取更换记录列表（分页）
   */
  async getReplaceRecords(params = {}) {
    return devicePartModel.getReplaceRecords(params);
  }

  // ==================== 预警相关 ====================

  /**
   * 获取需要预警的部件列表（寿命低于阈值）
   * @param {number} threshold - 寿命百分比阈值（如20表示剩余寿命低于20%）
   * @returns {Array} 需要预警的部件列表
   */
  async getWarningParts(threshold = 20) {
    const parts = await this.getAllParts();
    return parts.filter(part => {
      const remainingPercent = 100 - (part.life_percent || 0);
      return remainingPercent <= threshold;
    });
  }
}

module.exports = new DevicePartService();
