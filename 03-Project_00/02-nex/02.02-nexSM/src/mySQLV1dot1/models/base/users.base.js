const { execSql } = require("./main.base.js");
const {
  filterSafeFields,
  buildWhereCondition,
  buildPageLimit
} = require("@MySQL/utils/sql.util.js");

class UsersBase {
  constructor(dbName, tableName, allowFields) {
    this.dbName = dbName;
    this.tableName = tableName;
    this.allowFields = allowFields;
  }

  /**
   * findAll -分页查询列表接口
   * 同时返回当前页数据列表 + 符合条件的数据总条数
   * @param {Object} [query={}] 前端传来的查询条件对象，键值对匹配数据库字段
   * @param {string} [fields="*"] 需要查询的字段，多个用逗号分隔，默认查询全部字段
   * @param {number} [page=1] 当前页码，默认第一页
   * @param {number} [pageSize=10] 每页展示数据条数，默认10条
   * @returns {Promise<{list: Array, total: number}>} 分页结果：list当前页数据、total符合条件总条数
   */
  async pageList(query = {}, fields = "*", page = 1, pageSize = 10) {
    // 1. 字段白名单过滤，防止SQL注入、防止查询密码等敏感字段,filterSafeFields：工具函数，对比当前表允许查询的字段this.allowFields，过滤非法字段
    const safeFields = filterSafeFields(fields, this.allowFields);
    // 2. 根据查询条件对象生成WHERE条件语句 + 占位符参数数组,buildWhereCondition：工具函数，处理query条件，返回 {whereStr: "WHERE xxx=?", params: [值]}
    const { whereStr, params } = buildWhereCondition(query);
    // 3. 根据页码、每页条数生成分页 LIMIT 语句，如 LIMIT 0,10
    const limitStr = buildPageLimit(page, pageSize);

    // 4. 查询当前页数据,拼接分页查询SQL：查询指定字段 FROM 库名.表名 条件 分页限制,?? 是mysql2标识符占位符，专门用来填数据库名、表名、字段名
    const listSql = `SELECT ${safeFields} FROM ?? . ?? ${whereStr} ${limitStr}`;
    // 5. 组装SQL占位参数：库名、表名 + 所有查询条件值
    const listParams = [this.dbName, this.tableName, ...params];
    // 6. 执行SQL，await等待数据库查询完成，list为当前页数组数据
    const list = await execSql(listSql, listParams);

    // 7. 查询符合条件的总数据条数,COUNT(*) AS total 统计总数量，别名total方便取值，不带分页LIMIT
    const countSql = `SELECT COUNT(*) AS total FROM ?? . ?? ${whereStr}`;
    // 8. 统计SQL所需占位参数，和列表查询条件完全一致
    const countData = await execSql(countSql, [
      this.dbName,
      this.tableName,
      ...params
    ]);
    // 9. countData是查询结果数组，第一条的total属性即为总条数
    const total = countData[0].total;

    // 10. 统一返回分页对象，前端可直接渲染分页组件
    return { list, total };
  }

  /**
   * findAll -不分页查询符合条件的全部数据
   * @param {Object} [query={}] 查询条件键值对象，如 {status:1, username:"xxx"}
   * @param {string} [fields="*"] 指定查询字段，逗号分隔，默认查询所有字段
   * @returns {Promise<Array>} 满足条件的完整数据数组
   */
  async allList(query = {}, fields = "*") {
    // 1. 过滤用户传入的查询字段，仅保留白名单允许字段，防止查password等敏感字段
    const safeFields = filterSafeFields(fields, this.allowFields);
    // 2. 将查询条件对象解析为 WHERE 语句 + 占位参数数组
    const { whereStr, params } = buildWhereCondition(query);
    // 3. 拼接完整查询SQL，?? 为标识符占位符（库、表、字段），? 为值占位符
    const sql = `SELECT ${safeFields} FROM ?? . ?? ${whereStr}`;
    // 4. 组装参数：库名、表名 + 所有查询条件的值，await执行SQL并直接返回全部数据数组
    return await execSql(sql, [this.dbName, this.tableName, ...params]);
  }

  /**
   * findOneById 根据主键id查询单条数据
   * @param {number|string} id 数据主键ID
   * @param {string} [fields="*"] 指定查询字段，默认全部字段
   * @returns {Promise<Object|null>} 查询到返回对象，无数据返回null
   */
  async findById(id, fields = "*") {
    if (id === undefined || id === null || id === "") {
      return null;
    }
    // 1. 过滤安全查询字段
    const safeFields = filterSafeFields(fields, this.allowFields);
    // 2. SQL：根据id匹配一条数据，LIMIT 1 提升查询效率，避免返回多条
    const sql = `SELECT ${safeFields} FROM ?? . ?? WHERE id = ? LIMIT 1`;
    // 3. 执行查询：参数顺序 库名、表名、主键id
    const res = await execSql(sql, [this.dbName, this.tableName, id]);
    // 4. 结果数组有数据返回第一条，无数据返回null
    return res[0] || null;
  }

  /**
   * findOneByName 根据用户名username查询单条数据
   * @param {string} username 数据username
   * @param {string} [fields="*"] 指定查询字段，默认全部字段
   * @returns {Promise<Object|null>} 查询到返回对象，无数据返回null
   * @notice 预期username具备唯一性；多条匹配时仅返回第一条
   */
  async findByName(username, fields = "*") {
    if (username === undefined || username === null || username === "") {
      return null;
    }
    // 1. 过滤安全查询字段
    const safeFields = filterSafeFields(fields, this.allowFields);
    // 2. SQL：根据username匹配一条数据，LIMIT 1 提升查询效率，避免返回多条
    const sql = `SELECT ${safeFields} FROM ?? . ?? WHERE username = ? LIMIT 1`;
    // 3. 执行查询
    const res = await execSql(sql, [this.dbName, this.tableName, username]);
    // 4. 结果数组有数据返回第一条，无数据返回null
    return res[0] || null;
  }

  /**
   * create 新增单条数据
   * @param {Object} data 待插入的键值对数据对象
   * @returns {Promise<number>} 新增成功返回自增主键insertId
   */
  async create(data) {
    // 1. 过滤字段：只保留白名单内的字段，过滤前端非法/敏感字段
    const insertKeys = Object.keys(data).filter((k) =>
      this.allowFields.includes(k)
    );
    // 2. 根据有效字段生成对应数量值占位符 "?, ?, ?"
    const placeholders = insertKeys.map(() => "?").join(",");
    // 3. 字段标识符占位符 "??, ?? ,??"
    const keyStr = insertKeys.map(() => "??").join(",");
    // 4. 完整插入SQL：INSERT INTO 库.表 (字段1,字段2) VALUES (值1,值2)
    const sql = `INSERT INTO ?? . ?? (${keyStr}) VALUES (${placeholders})`;
    /**
     * 参数拼接规则：
     * [库名, 表名, 字段1,字段2, 值1,值2]
     * 前面??占位符对应字段名，后面?对应字段值
     */
    const params = [
      this.dbName,
      this.tableName,
      ...insertKeys,
      ...insertKeys.map((k) => data[k])
    ];
    // 5. 执行插入
    const result = await execSql(sql, params);
    // 6. 返回自增ID
    return result.insertId;
  }

  /**
   * update 根据主键id更新数据
   * @param {number|string} id 待更新数据主键ID
   * @param {Object} data 需要更新的键值对象
   * @returns {Promise<number>} 返回受影响行数 affectedRows
   */
  async updateById(id, data) {
    // 1. 过滤合法可更新字段，过滤敏感/未授权字段
    const updateKeys = Object.keys(data).filter((k) =>
      this.allowFields.includes(k)
    );
    if (updateKeys.length === 0) return 0;
    // 2. 生成 SET 片段 "?? = ?, ?? = ?"
    const setArr = updateKeys.map((k) => "?? = ?");
    const setStr = setArr.join(",");
    // 3. 更新SQL：按id匹配更新指定字段
    const sql = `UPDATE ?? . ?? SET ${setStr} WHERE id = ?`;
    // 4. 参数顺序,库名、表名、更新字段名、更新字段对应值、主键id
    const params = [this.dbName, this.tableName];
    for (const k of updateKeys) {
      params.push(k);
      params.push(data[k]);
    }
    params.push(id);
    const res = await execSql(sql, params);
    // 5. 返回更新影响行数，0代表无匹配数据，大于0代表更新成功
    return res.affectedRows;
  }

  /**
   * deleteOne 根据主键id物理删除数据
   * @param {number|string} id 待删除数据主键ID
   * @returns {Promise<number>} 返回删除受影响行数 affectedRows
   */
  async deleteById(id) {
    // 1. 删除SQL，按主键精准删除单条
    const sql = `DELETE FROM ?? . ?? WHERE id = ?`;
    // 2. 参数：库名、表名、主键id
    const res = await execSql(sql, [this.dbName, this.tableName, id]);
    // 3. 返回删除行数，0=无数据删除，1=删除成功
    return res.affectedRows;
  }

  /**
   * updateDeleteById 根据主键id软删除（可自定义标记字段）
   * @param {number|string} id 待操作数据主键ID
   * @param {Object} [markData] 软删除标记字段与值，不传默认 { isDelete: 1 }
   *        示例：{ isDelete: 1, deleteTime: new Date() }
   * @returns {Promise<number>} 返回更新受影响行数 affectedRows
   */
  async updateDeleteById(id, markData) {
    // 兜底：不传参数则默认仅标记isDelete=1
    const updateMark = markData ?? { isDelete: 1 };

    // 校验ID不能为空
    if (id === undefined || id === null || id === "") {
      throw new Error("软删除操作：主键ID不能为空");
    }

    // 1. 过滤仅保留白名单允许的软删除字段，防止非法字段更新
    const updateKeys = Object.keys(updateMark).filter((key) =>
      this.allowFields.includes(key)
    );
    // 2. 无合法更新字段直接返回0，不执行SQL
    if (updateKeys.length === 0) return 0;

    // 3. 拼接 SET 片段：?? = ? 适配mysql2标识符占位
    const setStr = updateKeys.map((key) => "?? = ?").join(",");

    // 4. 组装软删除UPDATE语句
    const sql = `UPDATE ?? . ?? SET ${setStr} WHERE id = ?`;

    // 5. 拼接参数：库名、表名、更新字段名、对应字段值、主键id
    const params = [
      this.dbName,
      this.tableName,
      ...updateKeys,
      ...updateKeys.map((k) => updateMark[k]),
      id
    ];

    try {
      // 6. 执行更新SQL
      const res = await execSql(sql, params);
      // 7. 返回受影响行数，0=无匹配数据，大于0=软删除标记更新成功
      return res.affectedRows;
    } catch (err) {
      throw new Error(`软删除失败：${err.message}`);
    }
  }
}

module.exports = UsersBase;
