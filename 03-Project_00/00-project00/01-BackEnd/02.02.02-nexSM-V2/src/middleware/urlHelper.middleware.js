/**
 * 清洗跳转地址，去除空格、首尾引号、强制根路径，附加追踪参数
 * @param {string} rawUrl 原始环境变量url
 * @param {'success'|'error'} trackType 跳转来源标记：success=正常业务成功页 / error=错误/鉴权拦截页
 * @returns {string} 处理完成的纯路径+查询参数字符串（不含域名，适配EJS页面meta跳转）
 */
function getSafeRedirectUrl(rawUrl, trackType = "success") {
  // 1. 清洗原始地址：去除首尾空格、首尾单/双引号，解决.env变量带引号、多余空格问题
  let cleanUrl = rawUrl.trim().replace(/^['"]|['"]$/g, "");

  // 2. 强制路径以 / 开头，避免相对路径拼接错乱（当前页面为/xxx/delete时，不会拼接成/xxx/delete目标地址）
  if (!cleanUrl.startsWith("/")) cleanUrl = "/" + cleanUrl;

  // 3. 读取环境变量配置的服务域名，缺失则兜底本地默认地址,replace(/\/+$/, "") 自动清除域名末尾多余斜杠，防止生成 http://xxx:3000//myAccounts 双斜杠错误路径
  const baseOrigin = (process.env.SERVER_IP || "http://localhost:3000").replace(
    /\/+$/,
    "",
  );

  // 4. 使用URL标准构造器解析清洗后的路径，绑定服务域名作为基准源.作用：自动规范路径、统一管理查询参数，避免手动拼接字符串引发语法漏洞
  const urlObj = new URL(cleanUrl, baseOrigin);

  // 5. 追加循环跳转溯源标记参数redirectTrack.作用：前端error.ejs页面读取该参数，识别是否为错误页二次跳转，自动禁用自动倒计时，阻断无限重定向
  urlObj.searchParams.set("redirectTrack", trackType);

  // 5. 只返回【路径 + 查询参数】，剥离域名部分,原因：EJS页面meta自动跳转、a标签链接仅需要相对根路径，完整域名会造成重复拼接，导致跳转地址错乱
  return urlObj.pathname + urlObj.search;
}

module.exports = {
  getSafeRedirectUrl,
};
