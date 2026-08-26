/**
 * 部门管理模块 - 业务逻辑层
 * 
 * 处理部门的增删改查、部门树形结构构建、多语言字段处理等业务逻辑
 * 继承 BaseService，复用通用 CRUD 操作
 * 
 * @author nexCM Team
 * @date 2026-01-01
 * @lastModified 2026-08-22
 */
const BaseService = require('../../services/BaseService')
const deptModel = require('./dept.model')
const userModel = require('../user/user.model')
const { BusinessError } = require('../../middleware/error.middleware')
const { ERROR_CODE } = require('../../constants/errorCode')

class DeptService extends BaseService {
  /**
   * 构造函数
   * 初始化 BaseService，传入部门模型和配置
   * 配置多语言字段：dept_name（部门名称）
   */
  constructor() {
    super(deptModel, {
      name: '部门',
      langFields: []
    })
  }

  // ==================== 特殊功能方法 ====================

  /**
   * 获取部门树
   * 
   * 查询所有部门并构建树形结构，支持多级部门嵌套
   * 
   * @param {string} [lang='zh-CN'] - 语言代码
   * @returns {Promise<Array>} 部门树形结构
   */
  async getDeptTree(lang = 'zh-CN') {
    const allDepts = await deptModel.getAllDepts()
    return this.buildTree(allDepts, 0)
  }

  /**
   * 构建树形结构（递归）
   * 
   * @param {Array} list - 扁平的部门列表
   * @param {number} parentId - 父部门 ID
   * @returns {Array} 树形结构
   */
  buildTree(list, parentId) {
    return list
      .filter(item => item.parent_id === parentId)
      .map(item => ({
        ...item,
        children: this.buildTree(list, item.id)
      }))
  }

  /**
   * 获取部门详情
   * 
   * @param {number} id - 部门 ID
   * @param {string} [lang='zh-CN'] - 语言代码
   * @returns {Promise<Object>} 部门详情
   * @throws {BusinessError} 部门不存在
   */
  async getDeptById(id, lang = 'zh-CN') {
    const dept = await deptModel.getById(id)
    if (!dept) {
      throw new BusinessError(ERROR_CODE.DEPT_NOT_FOUND, '部门不存在')
    }
    return dept
  }

  /**
   * 创建部门
   * 
   * 处理多语言字段（字符串转 JSON 对象）
   * 
   * @param {Object} data - 部门数据
   * @param {string} data.dept_name - 部门名称（支持多语言对象或字符串）
   * @param {number} [data.parent_id=0] - 父部门 ID，顶级为 0
   * @param {number} [data.order_num=0] - 排序号
   * @param {string} [data.leader] - 负责人
   * @param {string} [data.phone] - 联系电话
   * @param {string} [data.email] - 邮箱
   * @param {number} [data.status=1] - 状态 1启用 0禁用
   * @returns {Promise<Object>} { insertId, affectedRows }
   */
  async createDept(data) {
    return await deptModel.create(data)
  }

  /**
   * 更新部门
   * 
   * 防止将父部门设置为自己，处理多语言字段
   * 
   * @param {number} id - 部门 ID
   * @param {Object} data - 更新数据
   * @param {string} [data.dept_name] - 部门名称（支持多语言对象或字符串）
   * @param {number} [data.parent_id] - 父部门 ID（不能设置为自己）
   * @returns {Promise<Object>} { affectedRows }
   * @throws {BusinessError} 部门不存在/上级部门不能设置为自己
   */
  async updateDept(id, data) {
    await this.getDeptById(id)
    // 防止将父部门设置为自己或子部门
    if (data.parent_id && data.parent_id === id) {
      throw new BusinessError(ERROR_CODE.DEPT_PARENT_INVALID, '上级部门不能设置为自己')
    }
    return await deptModel.update(id, data)
  }

  /**
   * 删除部门
   * 
   * 检查是否有子部门，有子部门时不允许删除
   * 
   * @param {number} id - 部门 ID
   * @returns {Promise<Object>} { affectedRows }
   * @throws {BusinessError} 部门不存在/存在子部门无法删除
   */
  async deleteDept(id) {
    await this.getDeptById(id)
    // 检查是否有子部门
    const children = await deptModel.getByParentId(id)
    if (children.length > 0) {
      throw new BusinessError(ERROR_CODE.DEPT_HAS_CHILDREN, '存在子部门，无法删除')
    }
    // 检查是否有用户使用该部门
    const userCount = await userModel.countByDeptId(id)
    if (userCount > 0) {
      throw new BusinessError(ERROR_CODE.DEPT_HAS_USERS, `该部门下有 ${userCount} 个用户，无法删除`, { count: userCount })
    }
    return await deptModel.delete(id)
  }
}

module.exports = new DeptService()
