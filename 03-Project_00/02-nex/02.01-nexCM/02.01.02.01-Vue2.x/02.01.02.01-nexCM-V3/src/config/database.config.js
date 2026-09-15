/**
 * ==========================================
 * 数据库管理 - 表分类与别名配置
 * ==========================================
 * 用于数据查看页面左侧的分类分组显示
 * 可以自由配置分类、分类下的表、表的别名和图标
 *
 * 配置说明：
 * - category: 分类名称（大类）
 * - key: 分类英文标识（用于国际化）
 * - categoryIcon: 分类图标（Element UI 图标类名）
 * - tables: 该分类下的表配置
 *   - key: 数据库表名
 *   - alias: 表的中文别名（显示在卡片上的大字）
 *   - alias_en: 表的英文别名
 *   - comment: 表的中文描述
 *   - comment_en: 表的英文描述
 *   - icon: 表的图标（Element UI 图标类名）
 *
 * 新增表示例：
 * 在对应分类的 tables 中添加：
 *   nex_new_table: { alias: '新表名称', alias_en: 'New Table', comment: '新表描述', comment_en: 'New Table Description', icon: 'el-icon-document' }
 *
 * 新增分类示例：
 * 在数组中添加：
 *   {
 *     category: '新分类名称',
 *     key: 'new_category',
 *     categoryIcon: 'el-icon-folder',
 *     tables: { ... }
 *   }
 */

export const databaseTableConfig = [
  // ==================== 系统管理 ====================
  {
    category: '系统管理',
    key: 'system',
    categoryIcon: 'el-icon-setting',
    tables: {
      nex_captcha: {
        alias: '验证码',
        alias_en: 'Captcha',
        comment: '验证码表',
        comment_en: 'Captcha Table',
        icon: 'el-icon-key',
      },
      nex_menu: {
        alias: '菜单管理',
        alias_en: 'Menu Management',
        comment: '菜单表',
        comment_en: 'Menu Table',
        icon: 'el-icon-menu',
      },
      nex_notification_setting: {
        alias: '通知设置',
        alias_en: 'Notification Settings',
        comment: '通知设置表',
        comment_en: 'Notification Settings Table',
        icon: 'el-icon-setting',
      },
      nex_role_menu: {
        alias: '角色菜单关联',
        alias_en: 'Role Menu Relation',
        comment: '角色菜单关联表',
        comment_en: 'Role Menu Relation Table',
        icon: 'el-icon-link',
      },
      nex_dept: {
        alias: '部门管理',
        alias_en: 'Department Management',
        comment: '部门表',
        comment_en: 'Department Table',
        icon: 'el-icon-office-building',
      },
      nex_dict_type: {
        alias: '字典类型',
        alias_en: 'Dict Type',
        comment: '字典类型表',
        comment_en: 'Dict Type Table',
        icon: 'el-icon-notebook-2',
      },
      nex_dict_item: {
        alias: '字典项',
        alias_en: 'Dict Item',
        comment: '字典项表',
        comment_en: 'Dict Item Table',
        icon: 'el-icon-document',
      },
    },
  },

  // ==================== 用户管理 ====================
  {
    category: '用户管理',
    key: 'user',
    categoryIcon: 'el-icon-user',
    tables: {
      nex_user: {
        alias: '用户管理',
        alias_en: 'User Management',
        comment: '用户表',
        comment_en: 'User Table',
        icon: 'el-icon-user',
      },
      nex_role: {
        alias: '角色管理',
        alias_en: 'Role Management',
        comment: '角色表',
        comment_en: 'Role Table',
        icon: 'el-icon-s-custom',
      },
    },
  },

  // ==================== 安全合规 ====================
  {
    category: '安全合规',
    key: 'security',
    categoryIcon: 'el-icon-lock',
    tables: {
      nex_audit_log: {
        alias: '审计日志',
        alias_en: 'Audit Log',
        comment: '审计日志表(GMP 21CFR Part 11)',
        comment_en: 'Audit Log Table (GMP 21CFR Part 11)',
        icon: 'el-icon-document-checked',
      },
      nex_password_reset_token: {
        alias: '密码重置令牌',
        alias_en: 'Password Reset Token',
        comment: '密码重置Token表',
        comment_en: 'Password Reset Token Table',
        icon: 'el-icon-key',
      },
    },
  },

  // ==================== 日志管理 ====================
  {
    category: '日志管理',
    key: 'log',
    categoryIcon: 'el-icon-notebook-2',
    tables: {
      nex_operation_log: {
        alias: '操作日志',
        alias_en: 'Operation Log',
        comment: '操作日志表',
        comment_en: 'Operation Log Table',
        icon: 'el-icon-notebook',
      },
      nex_login_log: {
        alias: '登录日志',
        alias_en: 'Login Log',
        comment: '登录日志表',
        comment_en: 'Login Log Table',
        icon: 'el-icon-login',
      },
      nex_email_log: {
        alias: '邮件日志',
        alias_en: 'Email Log',
        comment: '邮件发送记录表',
        comment_en: 'Email Send Record Table',
        icon: 'el-icon-message',
      },
    },
  },

  // ==================== 配置管理 ====================
  {
    category: '配置管理',
    key: 'config',
    categoryIcon: 'el-icon-s-tools',
    tables: {
      nex_system_config: {
        alias: '系统配置',
        alias_en: 'System Config',
        comment: '系统配置表',
        comment_en: 'System Config Table',
        icon: 'el-icon-setting',
      },
      nex_feature_config: {
        alias: '功能配置',
        alias_en: 'Feature Config',
        comment: '功能配置表（超级面板专用）',
        comment_en: 'Feature Config Table (Super Panel Only)',
        icon: 'el-icon-s-tools',
      },
      nex_email_config: {
        alias: '邮件配置',
        alias_en: 'Email Config',
        comment: '邮箱配置表',
        comment_en: 'Email Config Table',
        icon: 'el-icon-postcard',
      },
    },
  },

  // ==================== 消息通知 ====================
  {
    category: '消息通知',
    key: 'notification',
    categoryIcon: 'el-icon-bell',
    tables: {
      nex_notification: {
        alias: '通知中心',
        alias_en: 'Notification Center',
        comment: '通知表',
        comment_en: 'Notification Table',
        icon: 'el-icon-bell',
      },
    },
  },

  // ==================== 设备管理 ====================
  {
    category: '设备管理',
    key: 'device',
    categoryIcon: 'el-icon-monitor',
    tables: {
      device_part: {
        alias: '部件寿命',
        alias_en: 'Part Life',
        comment: '部件寿命表',
        comment_en: 'Part Life Table',
        icon: 'el-icon-cpu',
      },
      device_part_template: {
        alias: '部件模板',
        alias_en: 'Part Template',
        comment: '部件模板表',
        comment_en: 'Part Template Table',
        icon: 'el-icon-files',
      },
      device_part_replace_record: {
        alias: '部件更换记录',
        alias_en: 'Part Replace Record',
        comment: '部件更换记录表',
        comment_en: 'Part Replace Record Table',
        icon: 'el-icon-refresh',
      },
    },
  },

  // ==================== 授权管理 ====================
  {
    category: '授权管理',
    key: 'license',
    categoryIcon: 'el-icon-key',
    tables: {
      nex_license: {
        alias: '授权管理',
        alias_en: 'License Management',
        comment: '授权表',
        comment_en: 'License Table',
        icon: 'el-icon-key',
      },
      nex_online_device: {
        alias: '在线设备',
        alias_en: 'Online Device',
        comment: '在线设备表',
        comment_en: 'Online Device Table',
        icon: 'el-icon-monitor',
      },
      nex_user_device: {
        alias: '用户设备',
        alias_en: 'User Device',
        comment: '用户设备表',
        comment_en: 'User Device Table',
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
        categoryKey: category.key,
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
    key: category.key,
    icon: category.categoryIcon,
    tables: Object.keys(category.tables),
  }))
}

export default databaseTableConfig
