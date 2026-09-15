/**
 * 统一响应工具 - 与尚医通 Java 后端返回格式完全一致
 * { code: 200, message: "成功", ok: true, data: ... }
 */

function success(res, data = null, message = "成功") {
  return res.json({
    code: 200,
    message,
    ok: true,
    data,
  });
}

function fail(res, message = "失败", code = 201) {
  return res.json({
    code,
    message,
    ok: false,
    data: null,
  });
}

module.exports = { success, fail };
