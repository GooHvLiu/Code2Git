/**
 * 用户模块 - 业务逻辑层
 */
const userModel = require('./user.model');
const { hashPassword, comparePassword } = require('../../utils/password');
const { generateToken } = require('../../utils/jwt');
const { BusinessError } = require('../../middleware/error.middleware');
const { ERROR_CODE } = require('../../constants/errorCode');
const { USER_STATUS, USER_ROLE } = require('../../constants/statusCode');
const CaptchaService = require('../captcha/captcha.service');

class UserService {
  /**
   * 用户登录
   * @param {string} username 用户名
   * @param {string} password 密码
   * @param {string} ip 登录IP
   * @returns {Promise<Object>} { token, userInfo }
   */
  async login(username, password, ip) {
    // 1. 查询用户
    const user = await userModel.getByUsername(username);
    if (!user) {
      throw new BusinessError(ERROR_CODE.USER_NOT_EXIST, '用户不存在');
    }

    // 2. 校验状态
    if (user.status === USER_STATUS.DISABLED) {
      throw new BusinessError(ERROR_CODE.USER_DISABLED, '账号已被禁用');
    }

    // 3. 校验密码
    const passwordValid = await comparePassword(password, user.password);
    if (!passwordValid) {
      throw new BusinessError(ERROR_CODE.USER_PASSWORD_ERROR, '密码错误');
    }

    // 4. 生成token
    const token = generateToken({
      id: user.id,
      username: user.username,
      realName: user.real_name,
      role: user.role
    });

    // 5. 更新登录信息
    await userModel.updateLoginInfo(user.id, ip);

    // 6. 返回用户信息（去掉密码）
    const { password: _, ...userInfo } = user;

    return {
      token,
      userInfo
    };
  }

  /**
   * 用户注册（公开接口）
   * @param {Object} data { username, password, email, code, uuid }
   * @returns {Promise<Object>} { id }
   */
  async register(data) {
    // 1. 校验验证码
    if (data.code && data.uuid) {
      const captchaResult = CaptchaService.verifyCaptcha(data.code, data.uuid);
      if (captchaResult.code !== ERROR_CODE.SUCCESS) {
        throw new BusinessError(captchaResult.code, captchaResult.msg);
      }
    }

    // 2. 调用 createUser（默认角色 operator，状态启用）
    return await this.createUser({
      username: data.username,
      password: data.password,
      email: data.email,
      role: USER_ROLE.OPERATOR,
      status: USER_STATUS.ENABLED
    });
  }

  /**
   * 分页查询用户列表
   * @param {Object} params 查询参数
   * @returns {Promise<Object>}
   */
  async getUserList(params) {
    const where = {};
    if (params.status !== undefined && params.status !== '') {
      where.status = params.status;
    }
    if (params.role !== undefined && params.role !== '') {
      where.role = params.role;
    }

    const result = await userModel.getPageList(params, where);

    // 去掉密码字段
    result.list = result.list.map(item => {
      const { password, ...rest } = item;
      return rest;
    });

    return result;
  }

  /**
   * 获取 单一用户 详情
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async getUserById(id) {
    const user = await userModel.getById(id);
    if (!user) {
      throw new BusinessError(ERROR_CODE.USER_NOT_EXIST, '用户不存在');
    }
    const { password, ...userInfo } = user;
    return userInfo;
  }

  /**
 * 获取 批量用户 详情
 * @param {Array} idArray 主键值数组
 * @returns {Promise<Object>} 查询结果数组
 */
  async getUserByIdArray(idArray) {
    // 批量查询 -> 用户数组
    const userList = await userModel.getByIdArray(idArray);
    // 校验：非数组 / 空数组 直接返回空数组
    if (!Array.isArray(userList) || userList.length === 0) return [];
    // 剔除密码字段，返回干净数组
    const safeUserList = userList.map(user => {
      const { password, ...userInfo } = user;
      return userInfo;
    });
    return safeUserList;
  }

  /**
   * 新增用户
   * @param {Object} data 用户数据
   * @returns {Promise<Object>}
   */
  async createUser(data) {
    // 检查用户名是否存在
    const existUser = await userModel.getByUsername(data.username);
    if (existUser) {
      throw new BusinessError(ERROR_CODE.USER_ALREADY_EXIST, '用户名已存在');
    }

    // 加密密码
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    // 默认启用状态
    if (data.status === undefined) {
      data.status = USER_STATUS.ENABLED;
    }

    const result = await userModel.create(data);
    return {
      id: result.insertId
    };
  }

  /**
   * 更新用户
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<void>}
   */
  async updateUser(id, data) {
    // 检查用户是否存在
    const user = await userModel.getById(id);
    if (!user) {
      throw new BusinessError(ERROR_CODE.USER_NOT_EXIST, '用户不存在');
    }

    // 如果修改密码，需要加密
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    await userModel.update(id, data);
  }

  /**
   * 删除用户
   * @param {number} id
   * @returns {Promise<void>}
   */
  async deleteUser(id) {
    const user = await userModel.getById(id);
    if (!user) {
      throw new BusinessError(ERROR_CODE.USER_NOT_EXIST, '用户不存在');
    }

    await userModel.delete(id);
  }

  /**
   * 批量删除用户
   * @param {Array} ids
   * @returns {Promise<void>}
   */
  async batchDeleteUsers(ids) {
    if (!ids || ids.length === 0) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, '请选择要删除的用户');
    }
    await userModel.batchDelete(ids);
  }

  /**
   * 修改用户状态
   * @param {number} id
   * @param {number} status
   * @returns {Promise<void>}
   */
  async updateUserStatus(id, status) {
    const user = await userModel.getById(id);
    if (!user) {
      throw new BusinessError(ERROR_CODE.USER_NOT_EXIST, '用户不存在');
    }

    await userModel.update(id, { status });
  }
}

module.exports = new UserService();
