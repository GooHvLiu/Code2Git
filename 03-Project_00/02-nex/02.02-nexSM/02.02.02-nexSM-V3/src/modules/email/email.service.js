/**
 * 邮箱服务核心逻辑
 * 处理邮件发送、自动降级、失败重试、发送记录等
 */
const nodemailer = require('nodemailer');
const emailConfig = require('./email.config');
const emailConfigModel = require('./email.model');
const { createProvider } = require('./providers');
const templateRegistry = require('./templates');
const { query } = require('../../db/index');

// 传输器缓存
const transporterCache = new Map();

class EmailService {
  constructor() {
    this.config = emailConfig;
  }

  /**
   * 获取传输器（带缓存）
   * @param {Object} config - 邮箱配置
   * @returns {Object} nodemailer传输器
   */
  getTransporter(config) {
    const cacheKey = `${config.host}:${config.port}:${config.username}`;
    if (transporterCache.has(cacheKey)) {
      return transporterCache.get(cacheKey);
    }

    const provider = createProvider(config.provider || 'custom', config);
    const smtpConfig = provider.getSmtpConfig();
    const transporter = nodemailer.createTransport(smtpConfig);
    transporterCache.set(cacheKey, transporter);
    return transporter;
  }

  /**
   * 清除传输器缓存
   * @param {Object} config - 邮箱配置（可选，不传清除全部）
   */
  clearTransporterCache(config) {
    if (config) {
      const cacheKey = `${config.host}:${config.port}:${config.username}`;
      transporterCache.delete(cacheKey);
    } else {
      transporterCache.clear();
    }
  }

  /**
   * 获取要使用的邮箱配置
   * 优先级：指定配置ID > 数据库默认配置 > 系统默认配置
   * @param {number} configId - 指定的配置ID（可选）
   * @returns {Promise<Object>} 邮箱配置
   */
  async getConfigToUse(configId = null) {
    // 1. 如果指定了配置ID，使用该配置
    if (configId) {
      const config = await emailConfigModel.getById(configId);
      if (config && config.status === 1) {
        return { ...config, configId, configName: config.name, source: 'database' };
      }
      console.warn(`[邮件服务] 指定的配置ID ${configId} 不存在或已禁用，尝试使用默认配置`);
    }

    // 2. 尝试使用数据库中的默认配置
    try {
      const defaultConfig = await emailConfigModel.getDefault();
      if (defaultConfig) {
        return { ...defaultConfig, configId: defaultConfig.id, configName: defaultConfig.name, source: 'database' };
      }
    } catch (err) {
      console.warn('[邮件服务] 获取数据库默认配置失败:', err.message);
    }

    throw new Error('没有可用的邮箱配置，请先在系统设置中添加邮箱配置');
  }

  /**
   * 记录发送日志
   * @param {Object} logData - 日志数据
   * @returns {Promise<number>} 日志ID
   */
  async logSend(logData) {
    if (!this.config.send.logEnabled) return null;
    try {
      const result = await query(
        `INSERT INTO nex_email_log (config_id, config_name, to_email, cc_email, subject, template, content, status, error_msg, retry_count, send_duration, ip) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          logData.configId || 0,
          logData.configName || '',
          logData.toEmail || '',
          logData.ccEmail || '',
          logData.subject || '',
          logData.template || '',
          logData.content || '',
          logData.status || 0,
          logData.errorMsg || '',
          logData.retryCount || 0,
          logData.sendDuration || 0,
          logData.ip || ''
        ]
      );
      return result.insertId;
    } catch (err) {
      console.error('[邮件服务] 记录发送日志失败:', err.message);
      return null;
    }
  }

  /**
   * 更新发送日志状态
   * @param {number} logId - 日志ID
   * @param {Object} updateData - 更新数据
   */
  async updateLog(logId, updateData) {
    if (!logId) return;
    try {
      const updateFields = [];
      const updateValues = [];
      for (const [key, value] of Object.entries(updateData)) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
      if (updateFields.length > 0) {
        updateValues.push(logId);
        await query(`UPDATE nex_email_log SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);
      }
    } catch (err) {
      console.error('[邮件服务] 更新发送日志失败:', err.message);
    }
  }

  /**
   * 发送邮件（核心方法）
   * @param {Object} options - 发送选项
   * @param {string} options.to - 收件人邮箱
   * @param {string} options.cc - 抄送邮箱（可选）
   * @param {string} options.subject - 邮件主题
   * @param {string} options.html - 邮件HTML内容
   * @param {string} options.text - 邮件纯文本内容（可选）
   * @param {string} options.template - 使用的模板名称（可选）
   * @param {Object} options.templateData - 模板数据（可选）
   * @param {number} options.configId - 指定使用的配置ID（可选）
   * @param {string} options.ip - 请求IP（可选，用于日志）
   * @returns {Promise<Object>} 发送结果
   */
  async send(options = {}) {
    const startTime = Date.now();
    let logId = null;
    let configToUse = null;

    try {
      // 1. 参数校验
      if (!options.to) {
        throw new Error('收件人邮箱不能为空');
      }
      if (!options.subject && !options.template) {
        throw new Error('邮件主题或模板不能为空');
      }

      // 2. 如果使用模板，渲染模板
      let subject = options.subject;
      let html = options.html;
      let text = options.text;

      if (options.template) {
        const rendered = templateRegistry.render(options.template, options.templateData || {});
        subject = subject || rendered.subject;
        html = html || rendered.html;
        text = text || rendered.text;
      }

      // 3. 获取要使用的配置
      configToUse = await this.getConfigToUse(options.configId);

      // 4. 记录发送日志
      logId = await this.logSend({
        configId: configToUse.configId,
        configName: configToUse.configName,
        toEmail: options.to,
        ccEmail: options.cc || '',
        subject,
        template: options.template || '',
        content: html,
        status: 0,
        ip: options.ip || ''
      });

      // 5. 发送邮件（带重试）
      const maxRetries = this.config.send.maxRetries;
      let lastError = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const transporter = this.getTransporter(configToUse);
          const provider = createProvider(configToUse.provider || 'custom', configToUse);
          const from = provider.getFrom();

          const mailOptions = {
            from: `"${from.name}" <${from.address}>`,
            to: options.to,
            subject,
            html,
            text: text || html.replace(/<[^>]*>/g, '') // 如果没有纯文本，简单从HTML提取
          };

          if (options.cc) {
            mailOptions.cc = options.cc;
          }

          const info = await transporter.sendMail(mailOptions);
          const duration = Date.now() - startTime;

          // 更新日志为成功
          await this.updateLog(logId, {
            status: 1,
            retry_count: attempt,
            send_duration: duration,
            send_time: new Date()
          });

          console.log(`[邮件服务] 发送成功: ${options.to}, 配置: ${configToUse.configName}, 耗时: ${duration}ms, 尝试次数: ${attempt + 1}`);

          return {
            success: true,
            messageId: info.messageId,
            configId: configToUse.configId,
            configName: configToUse.configName,
            source: configToUse.source,
            duration,
            logId
          };
        } catch (err) {
          lastError = err;
          console.warn(`[邮件服务] 第 ${attempt + 1} 次发送失败: ${err.message}`);

          if (attempt < maxRetries) {
            // 清除缓存，重新创建传输器
            this.clearTransporterCache(configToUse);
            // 等待后重试
            await new Promise(resolve => setTimeout(resolve, this.config.send.retryDelay * (attempt + 1)));
          }
        }
      }

      // 所有尝试都失败
      const duration = Date.now() - startTime;
      await this.updateLog(logId, {
        status: 2,
        retry_count: maxRetries,
        send_duration: duration,
        error_msg: lastError?.message || '未知错误'
      });

      throw lastError || new Error('邮件发送失败');

    } catch (err) {
      const duration = Date.now() - startTime;
      console.error('[邮件服务] 发送失败:', err.message);

      // 如果还没有记录日志，记录一条失败日志
      if (!logId) {
        logId = await this.logSend({
          configId: configToUse?.configId || 0,
          configName: configToUse?.configName || '',
          toEmail: options.to || '',
          subject: options.subject || '',
          template: options.template || '',
          status: 2,
          error_msg: err.message,
          send_duration: duration,
          ip: options.ip || ''
        });
      }

      return {
        success: false,
        error: err.message,
        duration,
        logId
      };
    }
  }

  /**
   * 发送模板邮件
   * @param {string} template - 模板名称
   * @param {Object} templateData - 模板数据
   * @param {Object} options - 其他发送选项
   * @returns {Promise<Object>} 发送结果
   */
  async sendTemplate(template, templateData = {}, options = {}) {
    return this.send({
      ...options,
      template,
      templateData
    });
  }

  /**
   * 发送测试邮件
   * @param {number} configId - 配置ID
   * @param {string} toEmail - 测试收件人邮箱
   * @returns {Promise<Object>} 发送结果
   */
  async sendTestEmail(configId, toEmail) {
    const config = await emailConfigModel.getById(configId);
    if (!config) {
      throw new Error('邮箱配置不存在');
    }

    return this.sendTemplate('test', {
      configName: config.name,
      provider: config.provider,
      username: config.username,
      testTime: new Date().toLocaleString()
    }, {
      to: toEmail,
      configId
    });
  }

  /**
   * 验证SMTP连接
   * @param {Object} config - 邮箱配置
   * @returns {Promise<Object>} 验证结果
   */
  async verifyConnection(config) {
    try {
      const provider = createProvider(config.provider || 'custom', config);
      const validation = provider.validate();
      if (!validation.valid) {
        return {
          success: false,
          message: '配置不完整',
          errors: validation.errors
        };
      }

      const smtpConfig = provider.getSmtpConfig();
      const transporter = nodemailer.createTransport(smtpConfig);
      await transporter.verify();
      transporter.close();

      return {
        success: true,
        message: 'SMTP连接验证成功'
      };
    } catch (err) {
      return {
        success: false,
        message: 'SMTP连接验证失败',
        error: err.message
      };
    }
  }

  /**
   * 获取发送日志列表（分页）
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.keyword - 搜索关键词（收件人/主题）
   * @param {number} params.status - 状态筛选（0发送中 1成功 2失败）
   * @param {number} params.configId - 配置ID筛选
   * @param {string} params.startTime - 开始时间
   * @param {string} params.endTime - 结束时间
   * @returns {Promise<Object>} { list, total }
   */
  async getLogList(params = {}) {
    const { page = 1, pageSize = 10, keyword = '', status, configId, startTime, endTime } = params;
    const offset = (page - 1) * pageSize;

    let whereSql = 'WHERE 1=1';
    const queryParams = [];

    if (keyword) {
      whereSql += ' AND (to_email LIKE ? OR subject LIKE ? OR config_name LIKE ?)';
      queryParams.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    if (status !== undefined && status !== null && status !== '') {
      whereSql += ' AND status = ?';
      queryParams.push(status);
    }

    if (configId) {
      whereSql += ' AND config_id = ?';
      queryParams.push(configId);
    }

    if (startTime) {
      whereSql += ' AND create_time >= ?';
      queryParams.push(startTime);
    }

    if (endTime) {
      whereSql += ' AND create_time <= ?';
      queryParams.push(endTime);
    }

    // 查询总数
    const countResult = await query(`SELECT COUNT(*) as total FROM nex_email_log ${whereSql}`, queryParams);
    const total = countResult[0]?.total || 0;

    // 查询列表（不返回content大字段，列表页不需要）
    const list = await query(
      `SELECT id, config_id, config_name, to_email, cc_email, subject, template, status, error_msg, retry_count, send_duration, ip, create_time, send_time 
       FROM nex_email_log 
       ${whereSql} 
       ORDER BY create_time DESC 
       LIMIT ${parseInt(pageSize)} OFFSET ${parseInt(offset)}`,
      queryParams
    );

    return { list, total };
  }

  /**
   * 根据ID获取日志详情
   * @param {number} id - 日志ID
   * @returns {Promise<Object|null>} 日志详情（含content）
   */
  async getLogById(id) {
    const result = await query(`SELECT * FROM nex_email_log WHERE id = ?`, [id]);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * 删除日志
   * @param {number} id - 日志ID
   * @returns {Promise<boolean>} 是否删除成功
   */
  async deleteLog(id) {
    const result = await query(`DELETE FROM nex_email_log WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }

  /**
   * 批量删除日志
   * @param {Array<number>} ids - 日志ID数组
   * @returns {Promise<number>} 删除数量
   */
  async batchDeleteLogs(ids) {
    if (!ids || ids.length === 0) return 0;
    const placeholders = ids.map(() => '?').join(',');
    const result = await query(`DELETE FROM nex_email_log WHERE id IN (${placeholders})`, ids);
    return result.affectedRows;
  }

  /**
   * 清理指定天数之前的旧日志
   * @param {number} days - 保留天数
   * @returns {Promise<number>} 删除数量
   */
  async clearOldLogs(days = 30) {
    const result = await query(
      `DELETE FROM nex_email_log WHERE create_time < DATE_SUB(NOW(), INTERVAL ? DAY)`,
      [days]
    );
    return result.affectedRows;
  }
}

module.exports = new EmailService();
module.exports.EmailService = EmailService;
