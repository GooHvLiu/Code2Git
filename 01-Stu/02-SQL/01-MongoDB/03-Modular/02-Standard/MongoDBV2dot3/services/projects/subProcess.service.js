const { execa } = require("execa");
const EventEmitter = require("events");
const {
  parseNetworkUrl,
} = require("@MongoDB/utils/projects/log.parser.util.js");
const { projectsService } = require("@MongoDB/services/index.service.js");
/**
 * 子进程管理核心服务类
 * 基于execa实现Windows下Node子项目启停、日志监听、进程生命周期管理
 * 继承EventEmitter提供事件分发：logLine/error/close
 */
class SubProcessService extends EventEmitter {
  /**
   * 运行中进程缓存 Map<projectId, execa实例>
   * 用于判断项目是否正在运行、存储进程句柄用于销毁
   * @type {Map<string, import("execa").ExecaChildProcess>}
   */
  #runningMap = new Map();

  /**
   * 日志分片缓冲区，解决chunk分段输出导致单行日志被拆分问题
   * Map<projectId, string> 存储未完成换行的残留日志片段
   * @type {Map<string, string>}
   */
  #lineBufferMap = new Map();

  constructor() {
    // 父类EventEmitter构造器必须优先执行
    super();
    // 全局兜底捕获error事件，防止子进程异常导致主服务崩溃
    this.on("error", () => {});

    /**
     * 监听日志行事件，自动解析局域网地址并更新数据库
     * @param {Object} params
     * @param {string} params.projectId 项目数据库ID
     * @param {string} params.line 单行完整日志文本
     */
    this.on("logLine", async ({ projectId, line }) => {
      const addr = parseNetworkUrl(line);
      if (!addr) return;
      const { ip, port } = addr;
      const project = await projectsService.findById(projectId);
      if (!project) return;
      // 新增判断：1、如果本次是Network地址：直接覆盖更新，不管原有值；2、如果本次是Local地址：数据库已有Network地址则跳过，不覆盖
      const isNetworkAddr = ip !== "localhost";
      const hasExistNetwork = project.bindIp && project.bindIp !== "localhost";

      if (!isNetworkAddr && hasExistNetwork) {
        console.log("已存在局域网地址，跳过Local更新");
        return;
      }

      if (project.bindIp === ip && String(project.bindPort) === port) return;
      project.bindIp = ip;
      project.bindPort = Number(port);
      await project.save();
      console.log(
        `【子进程自动更新地址】${project.title} => http://${ip}:${port}`,
      );
    });
  }

  /**
   * 创建并启动子进程
   * @param {string} projectId 项目数据库唯一ID
   * @param {string} cwd 子项目工作目录（根路径）
   * @param {string[]} cmdArr 启动命令拆分数组，如["node", "./bin/www"]
   * @param {Object} env 隔离后的纯净环境变量对象
   * @returns {{success: boolean, pid?: number}} 启动结果+进程PID
   */
  spawn(projectId, cwd, cmdArr, env) {
    if (this.#runningMap.has(projectId)) return false;
    const proc = execa(cmdArr[0], cmdArr.slice(1), {
      cwd,
      env,
      detached: true,
      windowsHide: false,
      all: true,
      buffer: false,
    });
    const pid = proc.pid;
    this.#runningMap.set(projectId, proc);
    this.#lineBufferMap.set(projectId, "");

    proc.all.on("data", (chunk) => {
      const raw = chunk.toString("utf8");
      console.log(`【子进程实时输出】${raw}`);
      let buf = this.#lineBufferMap.get(projectId);
      buf += raw;
      const lines = buf.split(/\r?\n/);
      const remain = lines.pop();
      this.#lineBufferMap.set(projectId, remain);
      for (const line of lines) {
        const trim = line.trim();
        if (!trim) continue;
        console.log(
          "当前的projectId：",
          projectId,
          "当前的line：",
          line,
          "当前的trim：",
          trim,
        );

        this.emit("logLine", { projectId, line: trim });
      }
    });

    proc.catch((err) => {
      console.error(
        `【子进程业务终止】项目ID:${projectId} 信号:${err.signal ?? err.exitCode}`,
      );
      this.emit("error", { projectId, err });
    });

    proc.on("error", (err) => {
      console.error(`【子进程系统错误】项目ID:${projectId}`, err.message);
      this.emit("error", { projectId, err });
    });

    proc.on("close", (code, signal) => {
      this.#runningMap.delete(projectId);
      this.#lineBufferMap.delete(projectId);
      console.warn(
        `【子进程退出】项目ID:${projectId} 退出码:${code} 信号:${signal}`,
      );
      this.emit("close", { projectId, code, signal });
    });

    return { success: true, pid };
  }

  /**
   * 判断指定项目是否存在运行中的子进程
   * @param {string} projectId 项目数据库ID
   * @returns {boolean} true=正在运行
   */
  isRunning(projectId) {
    return this.#runningMap.has(projectId);
  }

  /**
   * 向子进程发送终止信号，销毁进程句柄缓存
   * @param {string} projectId 项目数据库ID
   * @returns {boolean} true=存在进程并执行销毁
   */
  kill(projectId) {
    const proc = this.#runningMap.get(projectId);
    if (!proc) return false;
    proc.kill("SIGTERM");
    this.#runningMap.delete(projectId);
    this.#lineBufferMap.delete(projectId);
    return true;
  }
}

module.exports = new SubProcessService();
