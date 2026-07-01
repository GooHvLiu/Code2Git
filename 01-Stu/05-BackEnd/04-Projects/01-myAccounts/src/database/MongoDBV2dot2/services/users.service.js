const { Users } = require("@MongoDB/models/index.model.js");
const pagination = require("@MongoDB/utils/pagination.js");

class UsersService {
  /**
   *创建用户
   * @param {Object} Object 与用户模型匹配的数据
   * @returns
   */
  async createUser(Object) {
    const users = new Users(Object);
    return await users.save();
  }

  /**
   * 根据ID查询
   * @param {string} id 数据库中id数值
   * @returns
   */
  async findById(id) {
    return await Users.findById(id);
  }

  /**
   * 条件查询单条
   * @param {Object} queryObject 需要查找的对应条件，不限于对象类型
   * @returns
   */
  async findOne(queryObject) {
    return await Users.findOne(queryObject);
  }

  /**
   * 分页列表
   * @param {Object} queryObject 需要查找的对应条件，不限于对象类型
   * @param {number} page 当前页码
   * @param {number} limit 每页展示多少条数据
   * @returns
   */
  async getUserList(queryObject, page, limit) {
    return pagination(Users, queryObject, { page, limit });
  }

  /**
   * 更新用户
   * @param {String} id 用户对应的唯一标识码id
   * @param {Object} updateObject 需要更新的内容，一般为对象类型
   * @returns
   */
  async updateById(id, updateObject) {
    return await Users.findByIdAndUpdate(id, updateObject, { new: true });
  }

  /**
   * 软删除
   * @param {String} id 用户对应的唯一标识码id
   * @returns
   */
  async deleteById(id) {
    return await Users.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }
}

module.exports = new UsersService();
