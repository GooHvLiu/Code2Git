const { Projects } = require("@MongoDB/models/index.model.js");
const pagination = require("@MongoDB/utils/pagination.js");

class ProjectsService {
  /**
   *创建项目
   * @param {Object} Object 与项目模型匹配的数据
   * @returns
   */
  async createProject(Object) {
    const projects = new Projects(Object);
    return await projects.save();
  }

  /**
   * 根据ID查询
   * @param {string} id 数据库中id数值
   * @returns
   */
  async findById(id) {
    return await Projects.findById(id);
  }

  /**
   * 条件查询单条
   * @param {Object} queryObject 需要查找的对应条件，不限于对象类型
   * @returns
   */
  async findOne(queryObject) {
    return await Projects.findOne(queryObject);
  }

  /**
   * 查询全部项目
   * @param {Object} queryObject 需要查找的对应条件，不限于对象类型
   * @returns
   */
  async findAll(queryObject) {
    return await Projects.find(queryObject).sort({ createdAt: -1 });
  }

  /**
   * 分页列表
   * @param {Object} queryObject 需要查找的对应条件，不限于对象类型
   * @param {number} page 当前页码
   * @param {number} limit 每页展示多少条数据
   * @returns
   */
  async getProjectsList(queryObject, page, limit) {
    return pagination(Projects, queryObject, { page, limit });
  }

  /**
   * 更新账目
   * @param {String} id 项目对应的唯一标识码id
   * @param {Object} updateObject 需要更新的内容，一般为对象类型
   * @returns
   */
  async updateById(id, updateObject) {
    return await Projects.findByIdAndUpdate(id, updateObject, {
      returnDocument: "after",
    });
  }

  /**
   * 软删除
   * @param {String} id 用户对应的唯一标识码id
   * @returns
   */
  async deleteById(id) {
    return await Projects.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { returnDocument: "after" },
    );
  }
}

module.exports = new ProjectsService();
