const { db } = require("./connectMysql");

// Find 查询表内所有数据
/* readAll("mydb4demo", "users", "*"); */

// Insert 插入指定的字段
/* {
  (async () => {
    const strObject = {
      username: "Spider-Man",
      password: "pcc321"
    };
    await insertOne("mydb4demo", "users", strObject);
    await readAll("mydb4demo", "users", "*");
  })();
} */

// Update 更新指定的字段
/* {
  (async () => {
    // 需要更新的字段
    const updateObj = {
      password: "new123456",
      status: 1
    };
    // where条件：语句 + 条件参数，分开传避免注入
    const where = ["username = ?", ["Spider-Man"]];

    // 调用
    await updateOne("mydb4demo", "users", updateObj, where);
    await readAll("mydb4demo", "users", "*");
  })();
} */

// Delete 删除指定的字段
/* {
  // where条件：语句 + 条件参数，分开传避免注入
  const where = ["id = ?", [6]];

  // 调用
  (async () => {
    await deleteOne("mydb4demo", "users", where);
    await readAll("mydb4demo", "users", "*");
  })();
} */

// UpdateDelete 软删除指定的字段
/* {
  (async () => {
    // 需要软删除的字段
    const updateDeleteObj = {
      status: 1
    };
    // where条件：语句 + 条件参数，分开传避免注入
    const where = ["id = ?", [3]];

    // 调用
    await updateDeleteOne("mydb4demo", "users", updateDeleteObj, where);
    await readAll("mydb4demo", "users", "*");
  })();
} */

/**
 * 查询指定库.表的数据
 * @param {string} dbName 数据库名
 * @param {string} tableName 表名
 * @param {string} fieldStr 要查询的字段，逗号分隔
 * @returns {Promise<Array>} 数据表行数据
 */
async function readAll(dbName, tableName, fieldStr) {
  try {
    // 拆分库、表两个标识符，对应两个 ??
    const params = [dbName, tableName];
    const listSql = `SELECT ${fieldStr} FROM ?? . ??`;
    // 接收查询结果
    const [rows] = await db.query(listSql, params);
    console.log("查询到的数据_", rows);
  } catch (error) {
    console.log("查询失败_", error.message);
    // 抛出错误方便外部捕获，不要只返回字符串
    throw new Error(error.message);
  }
}

/**
 * 插入单条数据到指定库.表
 * @param {string} dbName 数据库名
 * @param {string} tableName 表名
 * @param {Object} strObject 要插入的字段对象
 * @returns {Promise<Object>} 插入结果对象
 */
async function insertOne(dbName, tableName, strObject) {
  try {
    // 对象扩展运算符 ... 拆分获取 username、password（满足你需求）
    const { username, password } = { ...strObject };
    // 占位符参数：库名、表名、用户名、密码
    const params = [dbName, tableName, username, password];
    const insertSql = `INSERT INTO ?? . ?? (username, password) VALUES (?, ?)`;
    // 接收查询结果
    const [rows] = await db.query(insertSql, params);
    console.log("插入成功，结果为_", rows);
    return rows;
  } catch (error) {
    console.log("插入失败_", error.message);
    // 抛出错误方便外部捕获，不要只返回字符串
    throw new Error(error.message);
  }
}

/**
 * 更新单条数据到指定库.表
 * @param {string} dbName 数据库名
 * @param {string} tableName 表名
 * @param {Object} updateObj 需要更新的字段键值对象
 * @param {Array} wheresql [条件语句, 条件参数数组] 例: ['username=?', ['Spider-Man']]
 * @returns {Promise<Object>} 更新结果对象
 */
async function updateOne(dbName, tableName, updateObj, wheresql) {
  try {
    // 扩展运算符拷贝对象，不污染原数据
    const updateData = { ...updateObj };
    // 提取更新字段名与对应值
    const updateKeys = Object.keys(updateData);
    console.log("当前拼接updateKeys部分：", updateKeys);
    const updateVals = Object.values(updateData);
    console.log("当前拼接updateVals部分：", updateVals);

    // 拼接 SET 部分：字段名=?, 字段名=?
    const setStr = updateKeys.map((key) => `${key}=?`).join(", ");
    console.log("当前拼接set部分：", setStr);

    // 解析where条件和where参数
    const [whereStr, whereParams] = wheresql;
    console.log(
      "当前拼接whereStr部分：",
      whereStr,
      "当前拼接whereParams部分：",
      whereParams
    );

    // 组装完整参数：库名、表名、更新值、where条件值
    const params = [dbName, tableName, ...updateVals, ...whereParams];
    console.log("当前拼接params部分：", params);

    // 完整更新SQL
    const updateSql = `UPDATE ?? . ?? SET ${setStr} WHERE ${whereStr}`;

    const [rows] = await db.query(updateSql, params);
    console.log("更新成功，结果为：", rows);
    return rows;
  } catch (error) {
    console.log("更新失败：", error.message);
    throw new Error(error.message);
  }
}

/**
 * 删除指定库表满足条件的数据
 * @param {string} dbName 数据库名称
 * @param {string} tableName 数据表名称
 * @param {[string, any[]]} whereOption where条件配置 [条件语句, 条件占位参数数组]
 * @returns {Promise<Object>} 删除执行结果
 */
async function deleteOne(dbName, tableName, whereOption) {
  try {
    // 解析where条件和where参数
    const [whereStr, whereParams] = whereOption;
    console.log(
      "当前拼接whereStr部分：",
      whereStr,
      "当前拼接whereParams部分：",
      whereParams
    );

    // 参数顺序：库名、表名、where占位参数
    const params = [dbName, tableName, ...whereParams];
    console.log("当前拼接params部分：", params);

    // 完整更新SQL
    const deleteSql = `DELETE FROM ?? . ?? WHERE ${whereStr}`;

    const [rows] = await db.query(deleteSql, params);
    console.log("删除成功，结果为：", rows);
    return rows;
  } catch (error) {
    console.log("删除失败：", error.message);
    throw new Error(error.message);
  }
}

/**
 * 软删除：更新删除标记字段（逻辑删除）
 * @param {string} dbName 数据库名
 * @param {string} tableName 表名
 * @param {Object} updateDeleteObj 需要更新的软删除字段键值对象
 * @param {[string, any[]]} whereOption [条件语句, 条件参数数组] 例: ['id=?', [3]]
 * @returns {Promise<Object>} 更新结果对象
 */
async function updateDeleteOne(
  dbName,
  tableName,
  updateDeleteObj,
  whereOption
) {
  try {
    // 扩展运算符拷贝对象，不污染原传入数据
    const updateData = { ...updateDeleteObj };
    // 提取更新字段名与对应值
    const updateKeys = Object.keys(updateData);
    console.log("更新字段数组：", updateKeys);

    const updateVals = Object.values(updateData);
    console.log("更新字段对应值：", updateVals);

    // 拼接 SET 语句：字段名=?, 字段名=?
    const setStr = updateKeys.map((key) => `${key}=?`).join(", ");
    console.log("拼接后的SET语句：", setStr);

    // 解析where条件字符串、条件参数
    const [whereStr, whereParams] = whereOption;
    console.log("WHERE条件语句：", whereStr);
    console.log("WHERE占位参数：", whereParams);

    // 组装完整参数：库名、表名、更新字段值、where条件值
    const params = [dbName, tableName, ...updateVals, ...whereParams];
    console.log("完整占位参数数组：", params);

    // 完整UPDATE SQL
    const updateDeleteSql = `UPDATE ?? . ?? SET ${setStr} WHERE ${whereStr}`;

    const [rows] = await db.query(updateDeleteSql, params);
    console.log("软删除标记更新成功，执行结果：", rows);
    return rows;
  } catch (error) {
    console.log("软删除标记更新失败：", error.message);
    throw new Error(error.message);
  }
}
