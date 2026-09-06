/**
 * 邮箱配置控制器
 * 处理邮箱配置的增删改查、设默认、启用/禁用、测试发送等
 */
const emailModel = require('./email.model');
const emailService = require('./email.service');
const { createProvider, getSupportedProviders, getDefaultConfig } = require('./providers');
const { maskEmail } = require('./utils/crypto.util');
const { ERROR_CODE } = require('../../constants/errorCode');
const audit = require('../../utils/audit');

class EmailController {
  /**
   * 获取邮箱配置列表（分页）
   * GET /email/config/list
   */
  async getList(req, res, next) {
    try {
      const { page = 1, pageSize = 10, keyword = '', status } = req.query;
      const result = await emailModel.getList({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        keyword,
        status: status !== undefined ? parseInt(status) : undefined
      });

      // 邮箱账号脱敏
      result.list = result.list.map(item => ({
        ...item,
        username_masked: maskEmail(item.username)
      }));

      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取所有启用的邮箱配置（下拉选择用）
   * GET /email/config/all
   */
  async getAllEnabled(req, res, next) {
    try {
      const list = await emailModel.getAllEnabled();
      const result = list.map(item => ({
        id: item.id,
        name: item.name,
        provider: item.provider,
        username: item.username,
        username_masked: maskEmail(item.username),
        is_default: item.is_default
      }));
      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取单个配置详情
   * GET /email/config/:id
   */
  async getDetail(req, res, next) {
    try {
      const { id } = req.params;
      const config = await emailModel.getById(parseInt(id));
      if (!config) {
        return res.error(ERROR_CODE.EMAIL_CONFIG_NOT_FOUND);
      }
      // 不返回明文授权码，返回空字符串（前端编辑时留空表示不修改）
      const result = {
        ...config,
        password: ''
      };
      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 新增邮箱配置
   * POST /email/config
   */
  async create(req, res, next) {
    try {
      const { name, provider, host, port, secure, username, password, from_name, is_default, status, remark } = req.body;

      // 参数校验
      if (!name) return res.error(ERROR_CODE.EMAIL_NAME_REQUIRED);
      if (!provider) return res.error(ERROR_CODE.EMAIL_PROVIDER_REQUIRED);
      if (!host) return res.error(ERROR_CODE.EMAIL_HOST_REQUIRED);
      if (!port) return res.error(ERROR_CODE.EMAIL_PORT_REQUIRED);
      if (!username) return res.error(ERROR_CODE.EMAIL_USERNAME_REQUIRED);
      if (!password) return res.error(ERROR_CODE.EMAIL_PASSWORD_REQUIRED);

      // 检查配置名称是否已存在
      const exists = await emailModel.existsByName(name);
      if (exists) {
        return res.error(ERROR_CODE.EMAIL_CONFIG_NAME_EXISTS);
      }

      // 使用服务商适配器校验配置
      const providerInstance = createProvider(provider, { host, port, secure, username, password });
      const validation = providerInstance.validate();
      if (!validation.valid) {
        return res.error(ERROR_CODE.EMAIL_VALIDATION_FAILED, { errors: validation.errors });
      }

      const id = await emailModel.create({
        name,
        provider,
        host,
        port,
        secure,
        username,
        password,
        from_name,
        is_default: is_default || 0,
        status: status !== undefined ? status : 1,
        remark,
        create_by: req.user?.username || 'system'
      });

      // 记录审计日志：邮箱配置修改
      audit.log(req, {
        action: audit.ACTION.EMAIL_CONFIG_CHANGE,
        target: `新增邮箱配置:${name}, 服务商:${provider}`,
        newValue: `主机:${host}, 端口:${port}, 用户名:${username}`,
        result: 'success',
        reason: '管理员新增邮箱配置'
      }).catch(err => {
        console.error('[邮箱配置-新增] 记录审计日志失败:', err)
      });

      // 清除传输器缓存
      emailService.clearTransporterCache();

      res.success({ id });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 更新邮箱配置
   * PUT /email/config/:id
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // 检查配置是否存在
      const existing = await emailModel.getById(parseInt(id));
      if (!existing) {
        return res.error(ERROR_CODE.EMAIL_CONFIG_NOT_FOUND);
      }

      // 如果修改了名称，检查名称是否已存在
      if (updateData.name && updateData.name !== existing.name) {
        const exists = await emailModel.existsByName(updateData.name, parseInt(id));
        if (exists) {
          return res.error(ERROR_CODE.EMAIL_CONFIG_NAME_EXISTS);
        }
      }

      // 如果有密码，使用服务商适配器校验
      if (updateData.password) {
        const configToValidate = {
          host: updateData.host || existing.host,
          port: updateData.port || existing.port,
          secure: updateData.secure !== undefined ? updateData.secure : existing.secure,
          username: updateData.username || existing.username,
          password: updateData.password
        };
        const providerInstance = createProvider(updateData.provider || existing.provider, configToValidate);
        const validation = providerInstance.validate();
        if (!validation.valid) {
          return res.error(ERROR_CODE.EMAIL_VALIDATION_FAILED, { errors: validation.errors });
        }
      }

      await emailModel.update(parseInt(id), updateData);

      // 记录审计日志：邮箱配置修改
      audit.log(req, {
        action: audit.ACTION.EMAIL_CONFIG_CHANGE,
        target: `修改邮箱配置ID:${id}`,
        oldValue: JSON.stringify(existing),
        newValue: JSON.stringify(updateData),
        result: 'success',
        reason: '管理员修改邮箱配置'
      }).catch(err => {
        console.error('[邮箱配置-修改] 记录审计日志失败:', err)
      });

      // 清除传输器缓存
      emailService.clearTransporterCache();

      res.success(null);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 删除邮箱配置
   * DELETE /email/config/:id
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      // 检查配置是否存在
      const existing = await emailModel.getById(parseInt(id));
      if (!existing) {
        return res.error(ERROR_CODE.EMAIL_CONFIG_NOT_FOUND);
      }

      // 默认配置不能删除
      if (existing.is_default === 1) {
        return res.error(ERROR_CODE.EMAIL_CONFIG_DEFAULT_CANNOT_DELETE);
      }

      // 系统内置配置不能删除
      if (existing.is_system === 1) {
        return res.error(ERROR_CODE.EMAIL_CONFIG_SYSTEM_CANNOT_DELETE);
      }

      await emailModel.delete(parseInt(id));

      // 记录审计日志：邮箱配置删除
      audit.log(req, {
        action: audit.ACTION.EMAIL_LOG_DELETE,
        target: `删除邮箱配置ID:${id}, 名称:${existing.name}`,
        oldValue: JSON.stringify(existing),
        result: 'success',
        reason: '管理员删除邮箱配置'
      }).catch(err => {
        console.error('[邮箱配置-删除] 记录审计日志失败:', err)
      });

      // 清除传输器缓存
      emailService.clearTransporterCache();

      res.success(null);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 设为默认配置
   * PUT /email/config/:id/default
   */
  async setDefault(req, res, next) {
    try {
      const { id } = req.params;

      // 检查配置是否存在
      const existing = await emailModel.getById(parseInt(id));
      if (!existing) {
        return res.error(ERROR_CODE.EMAIL_CONFIG_NOT_FOUND);
      }

      // 检查配置是否启用
      if (existing.status !== 1) {
        return res.error(ERROR_CODE.EMAIL_CONFIG_ONLY_ENABLED_CAN_DEFAULT);
      }

      await emailModel.setDefault(parseInt(id));

      // 记录审计日志：邮箱配置设为默认
      audit.log(req, {
        action: audit.ACTION.EMAIL_CONFIG_CHANGE,
        target: `设为默认邮箱配置ID:${id}, 名称:${existing.name}`,
        result: 'success',
        reason: '管理员设置默认邮箱配置'
      }).catch(err => {
        console.error('[邮箱配置-设默认] 记录审计日志失败:', err)
      });

      // 清除传输器缓存
      emailService.clearTransporterCache();

      res.success(null);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 启用/禁用配置
   * PUT /email/config/:id/status
   */
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (status === undefined) {
        return res.error(ERROR_CODE.EMAIL_STATUS_REQUIRED);
      }

      // 检查配置是否存在
      const existing = await emailModel.getById(parseInt(id));
      if (!existing) {
        return res.error(ERROR_CODE.EMAIL_CONFIG_NOT_FOUND);
      }

      // 如果是默认配置，不能禁用
      if (existing.is_default === 1 && status === 0) {
        return res.error(ERROR_CODE.EMAIL_CONFIG_DEFAULT_CANNOT_DISABLE);
      }

      await emailModel.update(parseInt(id), { status });

      // 记录审计日志：邮箱配置启用/禁用
      audit.log(req, {
        action: audit.ACTION.EMAIL_CONFIG_CHANGE,
        target: `邮箱配置ID:${id}, 名称:${existing.name}`,
        oldValue: `状态:${existing.status}`,
        newValue: `状态:${status}`,
        result: 'success',
        reason: status === 1 ? '管理员启用邮箱配置' : '管理员禁用邮箱配置'
      }).catch(err => {
        console.error('[邮箱配置-状态] 记录审计日志失败:', err)
      });

      // 清除传输器缓存
      emailService.clearTransporterCache();

      res.success(null);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 发送测试邮件
   * POST /email/config/test
   */
  async sendTestEmail(req, res, next) {
    try {
      const { configId, toEmail } = req.body;

      if (!configId) return res.error(ERROR_CODE.EMAIL_CONFIG_ID_REQUIRED);
      if (!toEmail) return res.error(ERROR_CODE.EMAIL_TO_EMAIL_REQUIRED);

      // 简单的邮箱格式校验
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(toEmail)) {
        return res.error(ERROR_CODE.EMAIL_FORMAT_INVALID);
      }

      const result = await emailService.sendTestEmail(parseInt(configId), toEmail);

      if (result.success) {
        res.success({ messageId: result.messageId, duration: result.duration, degraded: result.degraded || false });
      } else {
        res.error(ERROR_CODE.EMAIL_TEST_SEND_FAILED, { error: result.error });
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * 验证SMTP连接
   * POST /email/config/verify
   */
  async verifyConnection(req, res, next) {
    try {
      const config = req.body;

      if (!config.host) return res.error(ERROR_CODE.EMAIL_HOST_REQUIRED);
      if (!config.port) return res.error(ERROR_CODE.EMAIL_PORT_REQUIRED);
      if (!config.username) return res.error(ERROR_CODE.EMAIL_USERNAME_REQUIRED);
      if (!config.password) return res.error(ERROR_CODE.EMAIL_PASSWORD_REQUIRED);

      const result = await emailService.verifyConnection(config);
      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取支持的服务商列表
   * GET /email/config/providers
   */
  async getProviders(req, res, next) {
    try {
      const providers = getSupportedProviders();
      res.success(providers);
    } catch (err) {
      next(err);
    }
  }

  // ==================== 邮件发送日志 ====================

  /**
   * 获取发送日志列表（分页）
   * GET /email/log/list
   */
  async getLogList(req, res, next) {
    try {
      const result = await emailService.getLogList(req.query);
      res.success(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取日志详情
   * GET /email/log/:id
   */
  async getLogDetail(req, res, next) {
    try {
      const { id } = req.params;
      const log = await emailService.getLogById(parseInt(id));
      if (!log) {
        return res.error(ERROR_CODE.NOT_FOUND);
      }
      res.success(log);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 删除日志
   * DELETE /email/log/:id
   */
  async deleteLog(req, res, next) {
    try {
      const { id } = req.params;
      const success = await emailService.deleteLog(parseInt(id));
      if (!success) {
        return res.error(ERROR_CODE.NOT_FOUND);
      }
      res.success(null);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 批量删除日志
   * POST /email/log/batch-delete
   */
  async batchDeleteLogs(req, res, next) {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.error(ERROR_CODE.PARAM_MISSING);
      }
      const count = await emailService.batchDeleteLogs(ids);
      res.success({ count });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new EmailController();



