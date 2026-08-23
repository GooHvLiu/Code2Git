/**
 * 行级数据权限中间件
 * 基于角色的数据范围控制：
 * - all: 全部数据
 * - dept: 本部门数据
 * - dept_and_child: 本部门及子部门数据
 * - self: 仅本人数据
 *
 * 使用方式：
 * // 在路由中使用
 * router.get('/', requireAuth, dataScope('user'), controller.getList)
 *
 * // 在 service 中使用
 * const { dataScopeSql } = require('@/middleware/dataScope.middleware')
 * const sql = `SELECT * FROM table WHERE ${dataScopeSql(req, 'create_by')}`
 */

/**
 * 数据范围枚举
 */
const DATA_SCOPE = {
  ALL: 'all',              // 全部数据
  DEPT: 'dept',            // 本部门数据
  DEPT_AND_CHILD: 'dept_and_child', // 本部门及子部门数据
  SELF: 'self'             // 仅本人数据
}

/**
 * 数据权限中间件
 * 将数据范围信息注入到 req.dataScope 中
 * @param {string} tableAlias - 表别名（可选，用于多表查询）
 */
function dataScope(tableAlias = '') {
  return (req, res, next) => {
    try {
      const user = req.user
      if (!user) {
        return next()
      }

      // 获取用户角色的数据范围（默认仅本人）
      const scope = user.data_scope || DATA_SCOPE.SELF

      // 构建数据范围条件
      const prefix = tableAlias ? `${tableAlias}.` : ''
      let scopeCondition = '1=1'

      switch (scope) {
        case DATA_SCOPE.ALL:
          // 全部数据，无需过滤
          scopeCondition = '1=1'
          break

        case DATA_SCOPE.DEPT:
          // 本部门数据
          if (user.dept_id) {
            scopeCondition = `${prefix}dept_id = ${user.dept_id}`
          } else {
            scopeCondition = `${prefix}create_by = '${user.username}'`
          }
          break

        case DATA_SCOPE.DEPT_AND_CHILD:
          // 本部门及子部门数据（需要部门表联查，这里简化处理）
          if (user.dept_id) {
            // 实际项目中应查询部门树获取所有子部门ID
            scopeCondition = `${prefix}dept_id IN (SELECT id FROM nex_dept WHERE id = ${user.dept_id} OR parent_id = ${user.dept_id})`
          } else {
            scopeCondition = `${prefix}create_by = '${user.username}'`
          }
          break

        case DATA_SCOPE.SELF:
        default:
          // 仅本人数据
          scopeCondition = `${prefix}create_by = '${user.username}'`
          break
      }

      // 注入到 req 对象
      req.dataScope = {
        scope,
        condition: scopeCondition,
        userId: user.id,
        username: user.username,
        deptId: user.dept_id
      }

      next()
    } catch (error) {
      console.error('[数据权限] 中间件错误:', error)
      next()
    }
  }
}

/**
 * 构建数据范围 SQL 条件（在 service 中直接使用）
 * @param {object} req - 请求对象
 * @param {string} createByField - 创建人字段名（默认 create_by）
 * @param {string} deptIdField - 部门ID字段名（默认 dept_id）
 * @returns {string} SQL 条件字符串
 */
function buildDataScopeCondition(req, createByField = 'create_by', deptIdField = 'dept_id') {
  if (!req.dataScope) {
    return '1=1'
  }

  const { scope, userId, username, deptId } = req.dataScope

  switch (scope) {
    case DATA_SCOPE.ALL:
      return '1=1'

    case DATA_SCOPE.DEPT:
      return deptId ? `${deptIdField} = ${deptId}` : `${createByField} = '${username}'`

    case DATA_SCOPE.DEPT_AND_CHILD:
      return deptId
        ? `${deptIdField} IN (SELECT id FROM nex_dept WHERE id = ${deptId} OR parent_id = ${deptId})`
        : `${createByField} = '${username}'`

    case DATA_SCOPE.SELF:
    default:
      return `${createByField} = '${username}'`
  }
}

module.exports = {
  dataScope,
  buildDataScopeCondition,
  DATA_SCOPE
}
