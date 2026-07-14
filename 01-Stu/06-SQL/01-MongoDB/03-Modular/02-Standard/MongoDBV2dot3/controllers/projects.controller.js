const { success, fail } = require("@MongoDB/utils/response.js");
const { projectsService } = require("@MongoDB/services/index.service.js");
const { isProcessRunning } = require("@MongoDB/utils/projects/lock.util.js");
class ProjectsController {
  // 私有：读取锁文件判断运行状态（仅数据库同步状态使用）
  async #getProjectRunStatus(project) {
    return await isProcessRunning(project);
  }
  // 【标准数据库接口】分页/全量查询所有项目，同步运行状态
  async getProjectsList(req, res) {
    try {
      const projectsListData = await projectsService.findAll();
      for (const item of projectsListData) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const running = await this.#getProjectRunStatus(item);
        item.status = running ? "active" : "stopped";
        await item.save();
      }
      return success(res, projectsListData, "获取项目列表成功");
    } catch (err) {
      console.error("获取项目列表异常", err);
      return fail(res, err.message);
    }
  }

  // 【标准数据库接口】EJS页面渲染专用查询数据
  async getProjectsListData(req) {
    try {
      const projectsListData = await projectsService.findAll({});
      for (const item of projectsListData) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const running = await this.#getProjectRunStatus(item);
        item.status = running ? "active" : "stopped";
        await item.save();
      }
      return {
        type: 1,
        msg: "获取项目列表成功",
        data: projectsListData,
      };
    } catch (err) {
      console.error("页面列表查询异常", err);
      return {
        type: -1,
        msg: err.message || "获取项目列表失败，请检查填写数据",
        error: err,
      };
    }
  }

  // 【标准数据库接口】新建项目（仅入库，不启动进程）
  async createProjects(req, res) {
    try {
      const createProjectsData = await projectsService.createProject(req.body);
      return success(res, createProjectsData, "创建成功");
    } catch (err) {
      console.error("创建项目异常", err);
      return fail(res, err.message);
    }
  }

  // 【标准内部方法】给页面渲染调用，纯数据库创建
  async createProjectsData(Object) {
    try {
      const data = await projectsService.createProject(Object);
      return {
        type: 1,
        msg: "创建成功",
        data: data,
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "项目创建失败，请检查填写数据",
        error: err,
      };
    }
  }
}

module.exports = new ProjectsController();
