const { Accounts } = require("@MongoDB/models/index.model.js");
const pagination = require("@MongoDB/utils/pagination.js");

class AccountsService {
  /**
   *创建账目
   * @param {Object} Object 与用户模型匹配的数据
   * @returns
   */
  async createAccount(Object) {
    const accounts = new Accounts(Object);
    return await accounts.save();
  }

  /**
   * 根据ID查询
   * @param {string} id 数据库中id数值
   * @returns
   */
  async findById(id) {
    return await Accounts.findById(id);
  }

  /**
   * 条件查询单条
   * @param {Object} queryObject 需要查找的对应条件，不限于对象类型
   * @returns
   */
  async findOne(queryObject) {
    return await Accounts.findOne(queryObject);
  }

  /**
   * 分页列表
   * @param {Object} queryObject 需要查找的对应条件，不限于对象类型
   * @param {number} page 当前页码
   * @param {number} limit 每页展示多少条数据
   * @returns
   */
  async getAccountsList(queryObject, page, limit) {
    return pagination(Accounts, queryObject, { page, limit });
  }

  /**
   * 更新账目
   * @param {String} id 用户对应的唯一标识码id
   * @param {Object} updateObject 需要更新的内容，一般为对象类型
   * @returns
   */
  async updateById(id, updateObject) {
    return await Accounts.findByIdAndUpdate(id, updateObject, {
      returnDocument: "after",
    });
  }

  /**
   * 软删除
   * @param {String} id 用户对应的唯一标识码id
   * @returns
   */
  async deleteById(id) {
    return await Accounts.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { returnDocument: "after" },
    );
  }
}

module.exports = new AccountsService();
