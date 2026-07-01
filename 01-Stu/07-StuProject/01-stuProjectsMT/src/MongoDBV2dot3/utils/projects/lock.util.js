/**
 * PID锁文件工具集
 * 业务场景：Windows平台管理Node子项目进程生命周期
 * 实现基于PID文件的进程存活判断、进程强制销毁、锁文件读写
 * 配套 subProcessService、projectOperateService 使用，解决以下问题：
 *  1、通过本地文件持久存储子进程PID，重启主服务后仍能识别旧进程；
 *  2、真实查询Windows系统tasklist校验进程是否存活，杜绝单纯时间戳误判；
 *  3、提供统一Windows杀进程命令封装，业务层无需手写cmd脚本；
 *  4、配套启停逻辑自动创建/删除锁文件，保证数据库状态与真实进程同步；
 *  编码注意：Windows cmd终端默认GBK编码，当前utf-8会导致中文报错乱码，生产建议改为 encoding:"gbk"
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

/**
 * 写入锁文件：将子进程真实PID写入项目目录 .running.lock
 * @param {string} lockPath 锁文件完整绝对路径
 * @param {number} pid execa子进程返回的进程数字ID
 */
function writeLock(lockPath, pid) {
  fs.writeFileSync(lockPath, String(pid), "utf-8");
}

/**
 * 移除锁文件：进程停止/崩溃后删除本地锁文件
 * @param {string} lockPath 锁文件完整绝对路径
 */
function removeLock(lockPath) {
  if (fs.existsSync(lockPath)) fs.unlinkSync(lockPath);
}

/**
 * 读取锁文件PID，调用Windows tasklist查询进程是否真实存活
 * @param {Object} project 数据库项目记录对象，包含 workDir 工作目录字段
 * @returns {Promise<boolean>} true=进程正在运行；false=进程不存在/已销毁
 */
async function isProcessRunning(project) {
  const lockFilePath = path.join(project.workDir, ".running.lock");
  if (!fs.existsSync(lockFilePath)) return false;
  try {
    const pid = fs.readFileSync(lockFilePath, "utf8").trim();
    if (!pid) return false;
    const taskOutput = execSync(`tasklist /FI "PID eq ${pid}"`, {
      encoding: "utf-8",
    });
    return taskOutput.includes(pid);
  } catch (err) {
    removeLock(lockFilePath);
    return false;
  }
}

/**
 * Windows 系统下强制杀死指定 PID 的进程
 * 底层封装 taskkill 系统命令，同步阻塞执行
 * @param {number | string} pid 待销毁进程ID
 */
function killPid(pid) {
  execSync(`taskkill /F /PID ${pid}`, { encoding: "utf-8" });
}

module.exports = {
  writeLock,
  removeLock,
  isProcessRunning,
  killPid,
};
