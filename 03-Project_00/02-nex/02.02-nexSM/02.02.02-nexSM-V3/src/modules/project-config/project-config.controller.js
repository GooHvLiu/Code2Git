/**
 * 项目配置控制器
 * 只读接口，返回项目运行的所有配置信息
 */
const projectConfigService = require('./project-config.service');

class ProjectConfigController {
  /**
   * 获取项目所有配置信息
   */
  async getAllConfig(req, res, next) {
    try {
      const config = await projectConfigService.getAllConfig();
      res.json({
        code: 200,
        message: 'success',
        data: config
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProjectConfigController();
