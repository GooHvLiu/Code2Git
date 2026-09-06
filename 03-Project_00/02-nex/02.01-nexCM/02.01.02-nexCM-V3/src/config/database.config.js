/**
 * ==========================================
 * 数据库管理 - 表分类与别名配置
 * ==========================================
 * 用于数据查看页面左侧的分类分组显示
 * 可以自由配置分类、分类下的表、表的别名和图标
 *
 * 配置说明：
 * - category: 分类名称（大类）
 * - categoryIcon: 分类图标（Element UI 图标类名）
 * - tables: 该分类下的表配置
 *   - key: 数据库表名
 *   - alias: 表的中文别名（显示在卡片上的大字）
 *   - icon: 表的图标（Element UI 图标类名）
 *
 * 新增表示例：
 * 在对应分类的 tables 中添加：
 *   nex_new_table: { alias: '新表名称', icon: 'el-icon-document' }
 *
 * 新增分类示例：
 * 在数组中添加：
 *   {
 *     category: '新分类名称',
 *     categoryIcon: 'el-icon-folder',
 *     tables: { ... }
 *   }
 */

export const databaseTableConfig = [
  // ==================== 系统管理 ====================
  {
    category: '系统管理',
    categoryIcon: 'el-icon-setting',
    tables: {
      nex_captcha: {
        alias: '验证码',
        icon: 'el-icon-key',
      },
      nex_menu: {
        alias: '菜单管理',
        icon: 'el-icon-menu',
      },
      nex_notification_setting: {
        alias: '通知设置',
        icon: 'el-icon-setting',
      },
      nex_role_menu: {
        alias: '角色菜单关联',
        icon: 'el-icon-link',
      },
      nex_dept: {
        alias: '部门管理',
        icon: 'el-icon-office-building',
      },
      nex_dict_type: {
        alias: '字典类型',
        icon: 'el-icon-notebook-2',
      },
      nex_dict_item: {
        alias: '字典项',
        icon: 'el-icon-document',
      },
      nex_db_backup: {
        alias: '数据库备份',
        icon: 'el-icon-folder-opened',
      },

    },
  },

  // ==================== 用户管理 ====================
  {
    category: '用户管理',
    categoryIcon: 'el-icon-user',
    tables: {
      nex_user: {
        alias: '用户管理',
        icon: 'el-icon-user',
      },
      nex_role: {
        alias: '角色管理',
        icon: 'el-icon-s-custom',
      },
    },
  },

  // ==================== 安全合规 ====================
  {
    category: '安全合规',
    categoryIcon: 'el-icon-lock',
    tables: {
      nex_audit_log: {
        alias: '审计日志',
        icon: 'el-icon-document-checked',
      },
      nex_password_reset_token: {
        alias: '密码重置令牌',
        icon: 'el-icon-key',
      },
    },
  },

  // ==================== 日志管理 ====================
  {
    category: '日志管理',
    categoryIcon: 'el-icon-notebook-2',
    tables: {
      nex_operation_log: {
        alias: '操作日志',
        icon: 'el-icon-notebook',
      },
      nex_login_log: {
        alias: '登录日志',
        icon: 'el-icon-login',
      },
      nex_email_log: {
        alias: '邮件日志',
        icon: 'el-icon-message',
      },
    },
  },

  // ==================== 配置管理 ====================
  {
    category: '配置管理',
    categoryIcon: 'el-icon-s-tools',
    tables: {
      nex_system_config: {
        alias: '系统配置',
        icon: 'el-icon-setting',
      },
      nex_feature_config: {
        alias: '功能配置',
        icon: 'el-icon-s-tools',
      },
      nex_email_config: {
        alias: '邮件配置',
        icon: 'el-icon-postcard',
      },
    },
  },

  // ==================== 消息通知 ====================
  {
    category: '消息通知',
    categoryIcon: 'el-icon-bell',
    tables: {
      nex_notification: {
        alias: '通知中心',
        icon: 'el-icon-bell',
      },

    },
  },

  // ==================== 设备管理 ====================
  {
    category: '设备管理',
    categoryIcon: 'el-icon-monitor',
    tables: {
      device_part: {
        alias: '部件寿命',
        icon: 'el-icon-cpu',
      },
      device_part_template: {
        alias: '部件模板',
        icon: 'el-icon-files',
      },
      device_part_replace_record: {
        alias: '部件更换记录',
        icon: 'el-icon-refresh',
      },
    },
  },

  // ==================== 授权管理 ====================
  {
    category: '授权管理',
    categoryIcon: 'el-icon-key',
    tables: {
      nex_license: {
        alias: '授权管理',
        icon: 'el-icon-key',
      },
      nex_online_device: {
        alias: '在线设备',
        icon: 'el-icon-monitor',
      },
      nex_user_device: {
        alias: '用户设备',
        icon: 'el-icon-monitor',
      },
    },
  },
]

/**
 * 获取表别名映射（从配置中提取，用于兼容旧代码）
 * @returns {Object} 表别名映射表
 */
export function getTableAliasMap() {
  const map = {}
  databaseTableConfig.forEach(category => {
    Object.keys(category.tables).forEach(tableName => {
      map[tableName] = {
        ...category.tables[tableName],
        category: category.category,
        categoryIcon: category.categoryIcon,
      }
    })
  })
  return map
}

/**
 * 获取分类列表
 * @returns {Array} 分类列表
 */
export function getCategoryList() {
  return databaseTableConfig.map(category => ({
    name: category.category,
    icon: category.categoryIcon,
    tables: Object.keys(category.tables),
  }))
}

export default databaseTableConfig
