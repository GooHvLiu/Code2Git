/**
 * 扫码登录会话管理（内存版）
 * key: uuid
 * value: { status: pending|done|expired, openid, createdAt }
 */
const store = new Map();

/**
 * 创建扫码会话
 */
function createLoginSession(uuid) {
  const session = {
    status: "pending",
    openid: null,
    createdAt: Date.now(),
  };
  store.set(uuid, session);
  // 5分钟后自动清理
  setTimeout(() => {
    const s = store.get(uuid);
    if (s && s.status === "pending") {
      s.status = "expired";
    }
  }, 5 * 60 * 1000);
  return session;
}

/**
 * 获取会话
 */
function getLoginSession(uuid) {
  return store.get(uuid);
}

/**
 * 扫码成功，绑定 openid
 */
function bindOpenid(uuid, openid) {
  const session = store.get(uuid);
  if (session) {
    session.status = "done";
    session.openid = openid;
  }
  return session;
}

module.exports = { createLoginSession, getLoginSession, bindOpenid };
