/**
 * 审计日志模块 - 控制器层
 */
const auditService = require('./audit.service');

class AuditController {
  /**
   * 分页查询审计日志
   * GET /prod-api/v2/audit/list
   */
  async getList(req, res) {
    try {
      const result = await auditService.query(req.query);
      res.success(result, '查询成功');
    } catch (err) {
      res.error(err.message);
    }
  }

  /**
   * 查询当前用户的操作记录
   * GET /prod-api/v2/audit/my
   */
  async getMyLogs(req, res) {
    try {
      const userId = req.user?.userId || req.user?.id;
      const result = await auditService.queryByUser(userId, req.query);
      res.success(result, '查询成功');
    } catch (err) {
      res.error(err.message);
    }
  }
}

module.exports = new AuditController();
