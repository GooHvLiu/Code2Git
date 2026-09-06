/**
 * 部件寿命管理 - 业务逻辑层
 * 负责部件模板、部件实例、更换记录的业务逻辑处理
 */

const devicePartModel = require('./device-part.model');
const { ERROR_CODE } = require('../../constants/errorCode');
const { BusinessError } = require('../../middleware/error.middleware');
const dayjs = require('dayjs');

class DevicePartService {
  // ==================== 部件模板相关 ====================

  /**
   * 获取所有启用的部件模板
   */
  async getAllTemplates() {
    return devicePartModel.getAllTemplates();
  }

  /**
   * 获取所有模板（用于管理页面）
   */
  async getAllTemplatesForAdmin() {
    return devicePartModel.getAllTemplatesForAdmin();
  }

  /**
   * 获取所有基础模板（用于新增模板时选择源模板）
   */
  async getBaseTemplates() {
    return devicePartModel.getBaseTemplates();
  }

  /**
   * 根据ID获取模板
   */
  async getTemplateById(id) {
    const template = await devicePartModel.getTemplateById(id);
    if (!template) {
      throw new BusinessError(ERROR_CODE.NOT_FOUND, null, { entity: '部件模板' });
    }
    return template;
  }

  /**
   * 新增模板
   * 用户只需要选择源模板（source_template_key）、填写默认规格型号和默认额定寿命
   * 其他属性自动从源模板中复制，模板编码和排序自动生成
   */
  async addTemplate(data, operator = null) {
    // 验证必填字段
    if (!data.source_template_key) {
      throw new BusinessError(ERROR_CODE.PARAM_MISSING, null, { field: '模板名称' });
    }
    if (!data.default_spec) {
      throw new BusinessError(ERROR_CODE.PARAM_MISSING, null, { field: '默认规格型号' });
    }
    if (!data.default_rated_life) {
      throw new BusinessError(ERROR_CODE.PARAM_MISSING, null, { field: '默认额定寿命' });
    }

    // 获取源模板
    const sourceTemplate = await devicePartModel.getTemplateByKey(data.source_template_key);
    if (!sourceTemplate) {
      throw new BusinessError(ERROR_CODE.NOT_FOUND, null, { entity: '源模板' });
    }

    // 自动生成模板编码：编码前缀 + "-" + 随机4位数
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newTemplateKey = `${sourceTemplate.code_prefix}-${randomSuffix}`;
    
    // 验证模板编码是否已存在（如果存在，重新生成）
    let existingTemplate = await devicePartModel.getTemplateByKey(newTemplateKey);
    let finalTemplateKey = newTemplateKey;
    let retryCount = 0;
    while (existingTemplate && retryCount < 10) {
      const newRandomSuffix = Math.floor(1000 + Math.random() * 9000);
      finalTemplateKey = `${sourceTemplate.code_prefix}-${newRandomSuffix}`;
      existingTemplate = await devicePartModel.getTemplateByKey(finalTemplateKey);
      retryCount++;
    }
    if (existingTemplate) {
      throw new BusinessError(ERROR_CODE.PART_TEMPLATE_KEY_EXISTS, null, { templateKey: finalTemplateKey });
    }

    // 自动排序：排到源模板的下面（源模板的sort + 1）
    // 先更新源模板后面所有模板的sort + 1
    await devicePartModel.incrementSortAfter(sourceTemplate.sort);

    // 构建新模板数据
    const templateData = {
      template_key: finalTemplateKey,
      name_key: sourceTemplate.name_key,
      code_prefix: sourceTemplate.code_prefix,
      default_spec: data.default_spec,
      life_unit: sourceTemplate.life_unit,
      default_rated_life: data.default_rated_life,
      stat_method: sourceTemplate.stat_method,
      stat_tag: sourceTemplate.stat_tag,
      icon: null,
      sort: sourceTemplate.sort + 1,
      enabled: 1
    };

    const templateId = await devicePartModel.createTemplate(templateData);
    return this.getTemplateById(templateId);
  }

  /**
   * 更新模板
   */
  async updateTemplate(id, data, operator = null) {
    const template = await devicePartModel.getTemplateById(id);
    if (!template) {
      throw new BusinessError(ERROR_CODE.NOT_FOUND, null, { entity: '部件模板' });
    }

    // 检查是否是基础模板，如果是则不允许编辑
    if (template.is_base_template === 1) {
      throw new BusinessError(ERROR_CODE.PART_TEMPLATE_IS_BASE, null, {});
    }

    // 检查该模板下是否有部件实例，如果有则不允许编辑
    const partCount = await devicePartModel.countPartsByTemplateId(id);
    if (partCount > 0) {
      throw new BusinessError(ERROR_CODE.PART_TEMPLATE_HAS_PARTS, null, { partCount: partCount });
    }

    // 如果修改了模板编码，验证是否已存在
    if (data.template_key && data.template_key !== template.template_key) {
      const existingTemplate = await devicePartModel.getTemplateByKey(data.template_key);
      if (existingTemplate) {
        throw new BusinessError(ERROR_CODE.PART_TEMPLATE_KEY_EXISTS, null, { templateKey: data.template_key });
      }
    }

    await devicePartModel.updateTemplate(id, data);
    return this.getTemplateById(id);
  }

  /**
   * 删除模板（软删除）
   */
  async deleteTemplate(id, operator = null) {
    const template = await devicePartModel.getTemplateById(id);
    if (!template) {
      throw new BusinessError(ERROR_CODE.NOT_FOUND, null, { entity: '部件模板' });
    }

    // 检查是否是基础模板，如果是则不允许删除
    if (template.is_base_template === 1) {
      throw new BusinessError(ERROR_CODE.PART_TEMPLATE_IS_BASE, null, {});
    }

    // 检查该模板下是否有部件实例
    const partCount = await devicePartModel.countPartsByTemplateId(id);
    if (partCount > 0) {
      throw new BusinessError(ERROR_CODE.PART_TEMPLATE_HAS_PARTS, null, { partCount: partCount });
    }

    await devicePartModel.deleteTemplate(id);
    return { success: true };
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
    if (!data.part_code) {
      throw new BusinessError(ERROR_CODE.PARAM_MISSING, null, { field: '部件编码' });
    }
    const existingPart = await devicePartModel.getPartByCode(data.part_code);
    if (existingPart) {
      throw new BusinessError(ERROR_CODE.PART_CODE_EXISTS, null, { partCode: data.part_code });
    }
    
    // 校验规格型号：必须与模板的默认规格型号一致，不允许用户自定义
    const userSpec = data.spec || data.spec_model || '';
    const templateSpec = template.default_spec || '';
    if (userSpec && userSpec !== templateSpec) {
      throw new BusinessError(ERROR_CODE.PART_SPEC_NOT_MATCH, null, { 
        userSpec: userSpec, 
        templateSpec: templateSpec 
      });
    }
    
    // 校验额定寿命：必须与模板的默认额定寿命一致，不允许用户修改
    const userRatedLife = data.rated_life ? Number(data.rated_life) : null;
    const templateRatedLife = template.default_rated_life ? Number(template.default_rated_life) : null;
    if (userRatedLife && templateRatedLife && userRatedLife !== templateRatedLife) {
      throw new BusinessError(ERROR_CODE.PART_RATED_LIFE_NOT_MATCH, null, { 
        userRatedLife: userRatedLife, 
        templateRatedLife: templateRatedLife 
      });
    }
    
    // 创建部件实例
    const partData = {
      template_id: template.id,
      template_key: template.template_key,
      part_code: data.part_code,
      spec: templateSpec,  // 强制使用模板的默认规格型号
      rated_life: templateRatedLife,  // 强制使用模板的默认额定寿命
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
    if (!data.new_code) {
      throw new BusinessError(ERROR_CODE.PARAM_MISSING, null, { field: '新部件编码' });
    }
    if (data.new_code === part.part_code) {
      throw new BusinessError(ERROR_CODE.PART_CODE_SAME_AS_OLD, null, { partCode: data.new_code });
    }
    const existingPart = await devicePartModel.getPartByCode(data.new_code);
    if (existingPart) {
      throw new BusinessError(ERROR_CODE.PART_CODE_EXISTS, null, { partCode: data.new_code });
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
