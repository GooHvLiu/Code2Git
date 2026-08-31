# 国际化配置规范

## 一、命名规范

### 1. 菜单命名规范
- 一级菜单：`menu.{module}.default`
- 二级菜单：`menu.{module}.{page}.default`
- 三级菜单：`menu.{module}.{page}.{subpage}.default`

示例：
- 网站首页：`menu.home.default`
- 数据管理：`menu.home.data.default`
- 设备管理：`menu.device.default`
- 设备状态：`menu.device.state.default`

### 2. 按钮命名规范
- 按钮：`menu.{module}.{page}.{button}`

示例：
- 导出：`menu.home.data.export`
- 详情：`menu.home.data.detail`
- 新增：`menu.production.order.add`
- 编辑：`menu.production.order.edit`
- 删除：`menu.production.order.delete`
- 下载：`menu.production.order.download`

### 3. 参数命名规范
- 参数：`menu.{module}.{page}.{param}`

示例：
- 会话超时：`menu.system.config.param.sessionTimeout`
- 默认分页大小：`menu.system.config.param.defaultPageSize`

## 二、前端国际化配置结构

### 1. 统一结构
所有的菜单都必须是对象结构，包含 `default` 字段，不能是字符串。

**错误示例：**
```javascript
menu: {
  system: {
    default: '系统设置',
    dict: '字典管理',  // 错误：字符串
    dept: '部门管理'   // 错误：字符串
  }
}
```

**正确示例：**
```javascript
menu: {
  system: {
    default: '系统设置',
    dict: {
      default: '字典管理'
    },
    dept: {
      default: '部门管理'
    }
  }
}
```

### 2. 解析逻辑
前端通过 `resolveMenuTitle` 函数解析国际化key：
1. 检查 `i18n.te(titleKey)` 是否存在
2. 如果翻译结果是字符串，直接返回
3. 如果翻译结果是对象，取 `.default`
4. 如果 `.default` 不存在，返回原key

## 三、数据库字段规范

### 1. 菜单表（nex_menu）
- `id`：菜单ID，如 `_104_05`
- `parent_id`：父菜单ID
- `name`：菜单名称（英文标识），如 `audit`
- `title`：国际化key，如 `menu.system.audit.default`
- `permission_code`：权限码，如 `system:audit:view`
- `type`：类型（menu/button/param）
- `sort`：排序
- `icon`：图标
- `path`：路由路径
- `component`：组件路径

### 2. 按钮权限
- 按钮的 `title` 字段存储国际化key，如 `menu.system.audit.export`
- 按钮的 `permission_code` 字段存储权限码，如 `system:audit:export`

## 四、完整菜单结构示例

```javascript
menu: {
  // 网站首页
  home: {
    default: '网站首页',
    overview: {
      default: '概况预览'
    },
    dashboard: {
      default: '数据看板'
    },
    data: {
      default: '数据管理',
      export: '导出',
      detail: '详情'
    }
  },
  // 设备管理
  device: {
    default: '设备管理',
    state: {
      default: '设备状态'
    },
    alarm: {
      default: '报警统计',
      export: '导出',
      detail: '详情',
      handle: '处理'
    },
    part: {
      default: '部件寿命',
      operate: '操作',
      viewAll: '查看全部'
    }
  },
  // 生产管理
  production: {
    default: '生产管理',
    recipe: {
      default: '配方管理',
      download: '下载'
    },
    order: {
      default: '生产订单',
      add: '新增',
      edit: '编辑',
      delete: '删除',
      download: '下载'
    }
  },
  // 系统设置
  system: {
    default: '系统设置',
    dict: {
      default: '字典管理'
    },
    dept: {
      default: '部门管理'
    },
    role: {
      default: '角色管理'
    },
    user: {
      default: '用户管理'
    },
    audit: {
      default: '审计日志',
      search: '搜索/重置/刷新',
      export: '导出'
    },
    config: {
      default: '参数配置'
    },
    permission: {
      default: '权限配置'
    },
    device: {
      default: '在线管理',
      kick: '踢掉设备',
      delete: '删除设备'
    }
  }
}
```

## 五、数据库更新步骤

1. 查询当前菜单表的title字段
2. 将字符串类型的title更新为国际化key
3. 确保所有菜单的title字段都是国际化key
4. 确保所有按钮的title字段都是国际化key
5. 更新菜单版本号，触发前端重新获取菜单

## 六、注意事项

1. 所有的菜单都必须是对象结构，包含 `default` 字段
2. 数据库中菜单表的title字段必须存储国际化key，不能存储中文
3. 前端国际化配置和数据库字段必须保持一致
4. 新增菜单或按钮时，必须同时更新前端国际化配置和数据库字段
5. 中英文配置必须完整对应，不能缺失
