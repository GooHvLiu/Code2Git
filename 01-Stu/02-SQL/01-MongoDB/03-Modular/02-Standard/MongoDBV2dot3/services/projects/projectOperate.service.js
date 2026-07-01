/**
 * 项目启停业务操作服务类
 * 分层：路由层仅分发请求，所有启停、重启业务逻辑统一封装在此
 * 依赖：数据库服务、子进程管理服务、环境隔离工具、PID锁文件工具
 * 对外提供三个核心方法：startProject / stopProject / restartProject
 */
const { success, fail } = require("@MongoDB/utils/response.js");
const { projectsService } = require("@MongoDB/services/index.service.js");
const {
  subProcessService,
} = require("@MongoDB/services/projects/subProcess.service.js");
const { getIsolatedChildEnv } = require("@MongoDB/utils/projects/env.util.js");
const {
  writeLock,
  removeLock,
  isProcessRunning,
  killPid,
} = require("@MongoDB/utils/projects/lock.util.js");
const fs = require("fs");
const path = require("path");

class ProjectOperateService {
  /**
   * 启动项目业务逻辑
   * @param {import("express").Request} req Express请求对象
   * @param {import("express").Response} res Express响应对象
   * @returns {Promise<any>} 统一封装成功/失败响应
   */
  async startProject(req, res) {
    try {
      const { id } = req.params;
      const project = await projectsService.findById(id);
      if (!project) return fail(res, "项目不存在");
      if (await isProcessRunning(project)) return fail(res, "项目已在运行");

      const rawCmd = project.startCmd.trim();
      if (!rawCmd) return fail(res, "项目启动命令不能为空");
      const cmdArr = rawCmd.split(/\s+/).filter((s) => s.trim());

      const env = getIsolatedChildEnv();
      const lockPath = path.join(project.workDir, ".running.lock");
      const spawnResult = subProcessService.spawn(
        id,
        project.workDir,
        cmdArr,
        env,
      );
      if (!spawnResult.success) return fail(res, "进程启动失败");
      writeLock(lockPath, spawnResult.pid);

      await new Promise((r) => setTimeout(r, 50));
      const alive = await isProcessRunning(project);
      if (!alive) {
        removeLock(lockPath);
        return fail(res, "项目启动后自动退出，请查看控制台日志修复代码");
      }
      project.status = "active";
      await project.save();
      return success(res, null, "项目启动成功");
    } catch (err) {
      console.error("启动项目接口异常", err);
      return fail(res, `启动失败：${err.message}`);
    }
  }

  /**
   * 停止项目业务逻辑
   * @param {import("express").Request} req Express请求对象
   * @param {import("express").Response} res Express响应对象
   * @returns {Promise<any>} 统一封装成功/失败响应
   */
  async stopProject(req, res) {
    try {
      const { id } = req.params;
      const project = await projectsService.findById(id);
      if (!project) return fail(res, "项目不存在");
      const lockPath = path.join(project.workDir, ".running.lock");
      if (!fs.existsSync(lockPath)) return fail(res, "项目未运行");

      subProcessService.kill(id);
      const pid = fs.readFileSync(lockPath, "utf8").trim();
      try {
        killPid(pid);
      } catch (cmdErr) {
        // 拦截Windows taskkill原生报错，替换友好提示
        console.warn("进程已自动结束，无需重复杀死", cmdErr.message);
      }
      removeLock(lockPath);
      project.status = "stopped";
      await project.save();
      return success(res, null, "项目已停止，3秒后自动刷新页面同步状态");
    } catch (err) {
      console.error("停止项目异常", err);
      return fail(res, `停止失败：${err.message}`);
    }
  }

  /**
   * 重启项目业务逻辑
   * 逻辑：先停止原有进程 → 等待800ms缓冲 → 复用startProject方法重新启动
   * @param {import("express").Request} req Express请求对象
   * @param {import("express").Response} res Express响应对象
   * @returns {Promise<any>} 统一封装成功/失败响应
   */
  async restartProject(req, res) {
    try {
      const { id } = req.params;
      const project = await projectsService.findById(id);
      if (!project) return fail(res, "项目不存在");

      // 先停止
      const lockPath = path.join(project.workDir, ".running.lock");
      if (fs.existsSync(lockPath)) {
        const pid = fs.readFileSync(lockPath, "utf8").trim();
        killPid(pid);
        removeLock(lockPath);
      }
      subProcessService.kill(id);
      await new Promise((r) => setTimeout(r, 800));

      // 复用自身启动方法，不再操作路由堆栈
      return await this.startProject(req, res);
    } catch (err) {
      console.error("重启项目异常", err);
      return fail(res, err.message);
    }
  }
}

module.exports = new ProjectOperateService();
