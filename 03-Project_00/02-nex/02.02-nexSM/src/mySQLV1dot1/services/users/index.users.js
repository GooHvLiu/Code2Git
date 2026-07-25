const { UsersModel } = require("@MySQL/models/index.js");
/**
 * 用户业务服务层 UserService
 * 分层标准职责（大厂MVC规范）
 * 上游调用方：UserController 控制器（HTTP入口）
 * 下游依赖：UsersModel 数据模型层（通用CRUD封装、防注入处理）
 * 核心职责：
    1. 接收控制器清洗后的请求参数，组装数据库查询条件对象
    2. 业务规则校验：用户名重复、密码格式、状态合法、数据存在性校验
    3. 填充公共默认字段（创建时间、更新时间、软删除默认值）
    4. 调用Model层执行数据库操作，不直接操作底层SQL、连接池
    5. 业务校验不通过时主动抛出Error异常，由Controller统一捕获处理
 * 禁止行为：
    1. 不接收原生req/res对象，不处理HTTP返回
    2. 不手写原生SQL、不直接导入db/execSql
    3. 不捕获异常、不封装前端响应JSON
    4. 不做参数基础类型校验（数字/空值校验交给Controller工具函数）
 */
class UsersService {
  /**
   * findAll 分页查询用户列表
   * 接口上游：controller.getUserPage
   * @param {Object} [query={}] 前端分页筛选参数，不传默认空对象，防止解构报错
   * @param {string} [query.username] 用户名精确筛选条件，不传则不拼接该WHERE条件
   * @param {number|string} [query.status] 用户状态 0禁用/1正常，不传则不拼接条件
   * @param {number} [query.page=1] 分页页码，未传参默认查询第1页
   * @param {number} [query.pageSize=10] 单页展示条数，未传参默认10条
   * @param {string} [query.fields="id,username"] 自定义查询返回字段，默认只查id、username
   * @returns {Promise<{list: Array, total: number}>}
   *    list：当前页用户数据数组；total：符合条件总数据条数
   */
  async getUserPage(query = {}) {
    // 解构分页/筛选参数，同时给分页、字段设置内部默认兜底值

    const {
      username,
      status,
      page = 1,
      pageSize = 10,
      fields = "id,username"
    } = query;

    // 初始化空条件对象，统一传给Model的条件拼接工具函数
    const where = {};

    // 仅当前端传递了用户名，才加入等值筛选条件
    // 空字符串、undefined、null会自动忽略，不拼进WHERE
    if (username) where.username = username;
    // status区分「不传」和「传0/1」：只有完全不传才不加入条件
    // 前端传0（禁用）、1（正常）都会生成 status = ? 筛选
    if (status !== undefined) where.status = status;

    // 调用基础Model封装好的通用分页查询方法
    // 入参顺序：查询条件对象、自定义查询字段、页码、每页条数
    return await UsersModel.pageList(where, fields, page, pageSize);
  }

  /**
   * findAll 不分页全量查询用户列表
   * 适用场景：下拉选择框、导出全部数据、内部关联查询
   * @param {Object} [query={}] 筛选条件对象，不传默认空对象
   * @param {string} [query.username] 用户名筛选
   * @param {number|string} [query.status] 用户状态筛选
   * @param {string} [query.fields="id,username"] 自定义返回字段
   * @returns {Promise<Array<Object>>} 匹配条件的全部用户数据数组
   */
  async getUserAll(query = {}) {
    // 解构筛选参数，设置查询字段默认值
    const { username, status, fields = "id,username" } = query;

    // 初始化空条件载体
    const where = {};

    // 有用户名则加入筛选条件
    if (username) where.username = username;
    // status存在值（0/1）才加入筛选，不传则忽略
    if (status !== undefined) where.status = status;

    // 调用Model不分页全量查询方法
    return await UsersModel.allList(where, fields);
  }

  /**
   * findOne 根据主键ID查询单条用户详情
   * @param {number|string} id 用户主键自增ID
   * @returns {Promise<Object|null>}
   *    找到数据返回用户对象；无匹配数据返回null
   */
  async getUserInfo(id) {
    // 调用Model根据主键单条查询方法
    return await UsersModel.findById(id);
  }

  /**
   * create 新增用户业务逻辑
   * @param {Object} userData 前端提交的表单原始数据对象
   * @returns {Promise<number>} 数据库新增成功返回自增主键ID
   * @throws {Error} 用户名重复、密码格式不合法时抛出业务异常
   */
  async addUser(userData) {
    // 浅拷贝表单数据，避免修改外部传入的原始对象，防止污染上层参数
    const saveData = { ...userData };

    // 业务校验1：校验用户名是否已存在（唯一性约束）
    // 查询同用户名全部数据，判断数组长度大于0代表已注册
    const existUser = await UsersModel.allList({ username: saveData.username });
    if (existUser.length > 0) {
      // 校验不通过直接抛出异常，向上传递给Controller捕获返回前端
      throw new Error("该用户名已被注册，请更换用户名。");
    }

    // 业务校验2：密码格式正则校验，仅允许6-16位大小写字母+数字
    const pwdReg = /^[A-Za-z0-9]{6,16}$/;
    if (!pwdReg.test(saveData.password)) {
      throw new Error("密码必须为6-16位字母或数字。");
    }

    // 统一填充公共默认字段（业务层统一处理，前端无需传）
    saveData.createTime = new Date(); // 创建时间为当前系统时间
    // 前端未传递状态时，默认新用户为正常状态1
    if (saveData.status === undefined) {
      saveData.status = 1;
    }
    saveData.isDelete = 0; // 软删除标记，新增数据默认未删除0

    // 调用Model新增方法：内部自动过滤白名单合法字段、使用占位符防注入
    return await UsersModel.create(userData);
  }

  /**
   * update 根据主键ID编辑更新用户信息
   * @param {number|string} id 待更新用户主键ID
   * @param {Object} data 前端提交的待更新字段对象
   * @returns {Promise<number>} affectedRows 受影响行数，0=无匹配数据，>0更新成功
   * @throws {Error} 用户不存在、用户名重复、状态非法、密码格式错误抛异常
   */
  async editUser(id, data) {
    // 浅拷贝更新参数，不污染外部原始对象
    const updateData = { ...data };
    // 业务校验1：先查询目标用户是否存在，不存在直接抛出异常
    const targetUser = await UsersModel.findById(id);
    if (!targetUser) {
      throw new Error("目标用户不存在，更新失败");
    }

    // 业务校验2：如果本次更新包含用户名，校验用户名唯一性（排除自身）
    if (updateData.username) {
      // 查询数据库中所有同名用户
      const sameNameList = await UsersModel.allList({
        username: updateData.username
      });
      // 过滤是否存在其他ID的同名用户
      const hasOtherSameName = sameNameList.some((item) => item.id !== id);
      if (hasOtherSameName) {
        throw new Error("该用户名已被其他用户占用，请更换");
      }
    }

    // 业务校验3：状态值合法性校验，仅允许0/1
    if (updateData.status !== undefined) {
      if (![0, 1].includes(Number(updateData.status))) {
        throw new Error("用户状态仅支持0(禁用)、1(正常)");
      }
    }

    // 业务校验4：如果更新密码，复用密码正则校验格式
    if (updateData.password) {
      const pwdReg = /^[A-Za-z0-9]{6,16}$/;
      if (!pwdReg.test(updateData.password)) {
        throw new Error("密码必须为6-16位字母或数字");
      }
    }

    // 统一填充更新时间字段，记录本次修改时间
    updateData.updateTime = new Date();
    // 调用Model执行更新操作，自动过滤白名单字段、占位符防注入
    const affectRows = await UsersModel.updateById(id, updateData);

    return affectRows;
  }

  /**
   * delete 物理删除用户（直接DELETE数据库数据，谨慎使用）
   * @param {number|string} id 待删除用户主键ID
   * @returns {Promise<number>} 受影响行数，0=无数据，1=删除成功
   */
  async removeUser(id) {
    return await UsersModel.deleteById(id);
  }

  /**
   * updateDelete 软删除用户（逻辑删除，仅修改isDelete标记，保留原始数据）
   * @param {number|string} id 待软删除用户主键ID
   * @returns {Promise<number>} 受影响行数，0=无数据，1=标记更新成功
   */
  async softRemoveUser(id) {
    // 调用Model封装的通用软删除方法，默认更新isDelete=1
    return await UsersModel.updateDeleteById(id);
  }
}

// 全局单例实例导出，路由/控制器直接导入复用，无需重复new实例
module.exports = new UsersService();
