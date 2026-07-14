/**
 * 隔离子进程环境变量工具函数
 * 业务场景：Windows平台使用execa启动子Node项目时，隔离父主程序的全局环境变量，避免配置污染
 * 核心解决痛点：父主管理平台环境变量PORT=1234会被子项目继承，导致端口占用、启动崩溃
 * 实现逻辑：
 *  1、仅保留Windows运行node/npm必备的系统底层环境变量，保障命令正常执行
 *  2、强制清空PORT变量，阻断主程序端口配置向下传递
 *  3、批量删除数据库、鉴权、服务地址类业务变量，彻底隔离父子项目配置
 *  4、返回纯净独立env对象，传入execa作为子进程启动环境，子项目仅读取自身目录.env配置
 * @returns {Record<string, string | undefined>} 隔离后的纯净环境变量对象
 */
function getIsolatedChildEnv() {
  /**
   * 白名单：Windows系统运行node、npm、cmd命令不可缺失的底层环境变量
   * 缺失会导致子进程执行命令报错、系统路径找不到、终端功能异常
   * PATH：系统可执行文件搜索路径（node/npm全局命令依赖）
   * SystemRoot/windir：Windows系统根目录
   * TEMP/TMP：系统临时文件目录
   * USERNAME/COMPUTERNAME：当前用户、计算机标识
   * ComSpec：cmd.exe程序路径
   * OS：操作系统标识
   * PROCESSOR_ARCHITECTURE：CPU架构
   * LOCALAPPDATA/APPDATA：用户应用数据目录
   * HOSTNAME：本机主机名
   * @type {string[]}
   */
  const safeSystemKeys = [
    "PATH",
    "SystemRoot",
    "windir",
    "TEMP",
    "TMP",
    "USERNAME",
    "COMPUTERNAME",
    "ComSpec",
    "OS",
    "PROCESSOR_ARCHITECTURE",
    "LOCALAPPDATA",
    "APPDATA",
    "HOSTNAME",
  ];
  const cleanEnv = {};
  safeSystemKeys.forEach((key) => {
    if (process.env[key]) cleanEnv[key] = process.env[key];
  });

  /**
   * 强制覆盖PORT为空字符串
   * 作用：阻断主程序PORT=1234向下传递，子项目读取process.env.PORT得到空值
   * 子项目代码逻辑 `const port = process.env.PORT || 3000` 会自动使用自身.env默认端口3000/8080
   */
  cleanEnv.PORT = "";

  /**
   * 黑名单：需要彻底删除的业务配置类环境变量
   * 数据库连接、服务地址、鉴权密钥等父子项目独立配置，禁止互相继承
   * @type {string[]}
   */
  const businessDbKeys = [
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "MONGODB_URI",
    "MONGO_URL",
    "MONGO_HOST",
    "DATABASE",
    "LOCAL_IP",
    "SERVER_IP",
    "SECRET",
    "TOKEN_SECRET",
  ];
  businessDbKeys.forEach((key) => delete cleanEnv[key]);
  return cleanEnv;
}

module.exports = { getIsolatedChildEnv };
