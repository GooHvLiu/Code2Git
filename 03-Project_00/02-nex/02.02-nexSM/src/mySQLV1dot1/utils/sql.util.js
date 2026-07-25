/**
 * 过滤合法查询字段，防止标识符注入
 * @param {string} inputFields 前端传入字段，逗号分割
 * @param {string[]} allowList 允许字段白名单
 * @returns string
 */
function filterSafeFields(inputFields, allowList) {
  //前端没传参数或为空，undifined，null或直接传过来* ，则，直接放行，无需过滤
  if (!inputFields || inputFields.trim() === "*") return "*";
  //把前端传入字符串按逗号切割为数组，例：id, username, password → ["id"," username"," password"]
  const inputArr = inputFields.split(",").map((item) => item.trim());
  // 将前端传入的数组通过白名单allowlist进行过滤，将不允许的去掉，只保留允许的字段
  const safeArr = inputArr.filter((field) => allowList.includes(field));
  //如果过滤之后，safeAll长度为0，那么用户传入的所有字段全是非法内容
  if (safeArr.length === 0) throw new Error("存在非法查询字段");
  // 返回拼接之后的SQL字符串，例：["id","username"] → "id,username"
  return safeArr.join(",");
}

/**
 * 自动拼接WHERE条件，自动生成?占位符
 * @param {Object} queryObj 条件对象 {username:'xxx', status:1}
 * @returns {whereStr, params}
 */
function buildWhereCondition(queryObj) {
  // 1. 存放每一段条件片段：["?? = ?", "?? = ?"]
  const conditions = [];
  // 2. 存放所有占位符对应参数，按顺序排列
  const params = [];
  // 3. 遍历条件对象每一组键值对
  // 3. 遍历条件对象每一组键值对
  Object.entries(queryObj).forEach(([key, val]) => {
    // 4. 过滤空值、undefined、null，不拼接无效条件
    if (val !== undefined && val !== null && val !== "") {
      // 5. 推入条件片段：?? 代表字段，? 代表值
      conditions.push("?? = ?");
      // 6. 先存字段名，再存对应值，一一对应占位符顺序
      params.push(key, val);
    }
  });

  // 7. 拼接完整 WHERE 语句；无条件则返回空字符串
  const whereStr = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  // 8. 返回组装好的条件字符串 + 对应参数数组
  return { whereStr, params };
}

/**
 * 生成分页 LIMIT 语句
 * @param {number} page 页码，默认第1页
 * @param {number} pageSize 每页条数，默认10条
 * @returns {string} LIMIT 0,10 格式字符串
 */
function buildPageLimit(page = 1, pageSize = 10) {
  // 1. 计算偏移量 offset
  const offset = (page - 1) * pageSize;
  // 2. 拼接 LIMIT 分页语句并返回
  return `LIMIT ${offset}, ${pageSize}`;
}

module.exports = {
  filterSafeFields,
  buildWhereCondition,
  buildPageLimit
};
