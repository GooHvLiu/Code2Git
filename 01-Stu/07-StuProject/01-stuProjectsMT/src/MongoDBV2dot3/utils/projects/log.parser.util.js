/**
 * 解析子项目启动单行日志，提取可访问地址
 * 业务用途：自动抓取子Express打印的 Local / Network 访问链接，更新数据库 bindIp、bindPort
 * 优先级规则：优先返回局域网Network地址，不存在则降级使用本机Local地址，无匹配返回null
 * 兼容：ANSI控制台颜色转义码、行首符号/横线、中英文冒号、全角空格、零宽隐藏字符
 * @param {string} fullLog 子进程拆分后的单行完整日志文本
 * @returns {null | {ip:string, port:string}} 匹配成功返回IP+端口对象，无地址返回null
 */
function parseNetworkUrl(fullLog) {
  // 1、清洗：移除所有ANSI控制台颜色转义码 \u001b[xxm
  let cleanStr = fullLog.replace(/\u001b\[[0-9;]*[a-zA-Z]/g, "");
  // 2、清除零宽不可见字符
  cleanStr = cleanStr.replace(/[\u2000-\u200D\uFEFF]/g, "");
  // 3、全角空格替换普通空格
  cleanStr = cleanStr.replace(/　/g, " ");
  // 4、首尾修剪
  cleanStr = cleanStr.trim();
  // 正则：匹配行首任意前缀 + Local/Network + 任意空格 + 冒号 + 任意空格 + http地址
  const reg = /.*?(Local|Network)\s*[:：]\s*http:\/\/([\d.a-zA-Z]+):(\d+)/gi;
  let networkMatch = null;
  let localMatch = null;
  const matchList = [...cleanStr.matchAll(reg)];
  for (const match of matchList) {
    const type = match[1];
    const ip = match[2];
    const port = match[3];
    if (type === "Network") {
      networkMatch = { ip, port };
    } else {
      localMatch = { ip, port };
    }
  }

  return networkMatch ?? localMatch ?? null;
}

module.exports = { parseNetworkUrl };
