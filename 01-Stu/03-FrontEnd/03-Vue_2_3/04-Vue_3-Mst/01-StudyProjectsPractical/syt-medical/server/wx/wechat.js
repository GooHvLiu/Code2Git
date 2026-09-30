/**
 * 微信小程序接口封装
 */
const axios = require("axios");
const wxConfig = require("../config/wxConfig");

// access_token 缓存（2小时有效）
let cachedToken = { value: null, expire: 0 };

/**
 * 获取 access_token
 */
async function getAccessToken() {
  if (cachedToken.value && Date.now() < cachedToken.expire) {
    return cachedToken.value;
  }
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxConfig.WX_APPID}&secret=${wxConfig.WX_SECRET}`;
  const { data } = await axios.get(url);
  if (data.errcode) {
    throw new Error(`获取access_token失败: ${data.errcode} ${data.errmsg}`);
  }
  cachedToken.value = data.access_token;
  cachedToken.expire = Date.now() + (data.expires_in - 60) * 1000;
  return data.access_token;
}

/**
 * code 换 openid（小程序 wx.login 得到的 code）
 */
async function code2Session(code) {
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${wxConfig.WX_APPID}&secret=${wxConfig.WX_SECRET}&js_code=${code}&grant_type=authorization_code`;
  const { data } = await axios.get(url);
  if (data.errcode) {
    throw new Error(`code2Session失败: ${data.errcode} ${data.errmsg}`);
  }
  return data; // { openid, session_key, unionid? }
}

/**
 * 生成不限制数量的小程序码（带 scene 参数）
 */
async function getWxACode(scene) {
  const token = await getAccessToken();
  const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${token}`;
  const resp = await axios.post(
    url,
    {
      scene: scene, // 必填，≤32字符
      page: wxConfig.QRCODE_PAGE,
      width: 430,
      check_path: false,
      env_version: "trial", // 开发阶段先写 "develop"
    },
    { responseType: "arraybuffer" }
  );
  // 出错时微信返回 JSON
  const ct = resp.headers["content-type"] || "";
  if (ct.includes("json")) {
    const err = JSON.parse(Buffer.from(resp.data).toString());
    throw new Error(`getWxACode失败: ${err.errcode} ${err.errmsg}`);
  }
  return Buffer.from(resp.data);
}

module.exports = { getAccessToken, code2Session, getWxACode };
