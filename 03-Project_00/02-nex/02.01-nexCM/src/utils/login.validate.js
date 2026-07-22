// ESModule 用户输入的字符串必须在3-16位以内才验证通过
export function validateUsername(rule, value, callback) {
  if (value.length < 3 || value.length > 16) {
    callback(new Error("用户名需要在3-16位之间，请重新输入！"));
  } else {
    callback();
  }
}
