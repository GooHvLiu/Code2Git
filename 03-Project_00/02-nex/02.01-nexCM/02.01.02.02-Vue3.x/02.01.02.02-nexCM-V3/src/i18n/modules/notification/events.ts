/**
 * 通知模块 - 通知消息模板（事件分组）
 * 来源：后端 src/config/notificationRules.config.js 及业务代码 sendNotification 的 titleKey/contentKey
 * 渲染：通知中心 $t(titleKey, params) / $t(contentKey, params)，{xxx} 为动态参数占位符
 * 注意：不使用兜底方案，缺失字段直接显示 key；中英文结构必须一一对应
 */
export default {
  audit: {
    logExport: {
      content: '用户 {username} 导出了审计日志',
      title: '审计日志导出'
    },
    logView: {
      content: '用户 {username} 查看了审计日志',
      title: '审计日志查看'
    }
  },
  config: {
    connectionUpdate: {
      content: '连接配置已由 {username} 修改',
      title: '连接配置变更'
    },
    deviceParamsUpdate: {
      content: '设备参数配置已由 {username} 修改',
      title: '设备参数配置变更'
    },
    exportUpdate: {
      content: '导出配置已由 {username} 修改',
      title: '导出配置变更'
    },
    plcConnectionUpdate: {
      content: 'PLC连接配置已由 {username} 修改',
      title: 'PLC连接配置变更'
    },
    securityUpdate: {
      content: '安全配置已由 {username} 修改',
      title: '安全配置变更'
    },
    systemUpdate: {
      content: '系统配置已由 {username} 修改',
      title: '系统配置变更'
    }
  },
  data: {
    delete: {
      content: '用户 {username} 删除了数据',
      title: '数据删除操作'
    },
    export: {
      content: '用户 {username} 导出了敏感数据',
      title: '敏感数据导出'
    }
  },
  device: {
    maintenanceReminder: {
      content: '设备 {deviceName} 即将到达维护时间，请及时安排维护',
      title: '设备维护提醒'
    },
    paramChange: {
      content: '设备参数 {tag} 已由 {operator} 修改',
      title: '设备参数变更'
    },
    partLifeWarning: {
      content: '配件 {partName} 使用寿命即将到期，请及时更换',
      title: '配件寿命预警'
    },
    kickedAdmin: {
      content: '管理员 {operator} 已于 {time} 将用户 {userId} 的设备 {deviceName} 踢下线',
      title: '设备被踢下线（管理员通知）'
    },
    kicked: {
      content: '您的设备 {deviceName} 已于 {time} 被管理员 {operator} 踢下线',
      title: '设备被踢下线'
    }
  },
  security: {
    kickedOut: {
      content: '您的账号已于 {time} 在IP {ip} 的设备上登录，当前设备已下线',
      title: '账号被踢下线'
    }
  },
  license: {
    expired: {
      content: '系统授权已过期，部分功能已受限',
      title: '授权已过期'
    },
    expiring: {
      content: '系统授权将在30天内到期，请及时续费',
      title: '授权即将到期'
    }
  },
  permission: {
    change: {
      content: '角色 {roleName} 的权限配置已由 {operator} 修改',
      title: '权限配置变更'
    }
  },
  production: {
    batchComplete: {
      content: '批次 {batchNo} 已完成生产',
      title: '批次完成'
    },
    orderComplete: {
      content: '生产订单 {orderNo} 已完成',
      title: '生产订单完成'
    },
    orderCreate: {
      content: '生产订单 {orderNo} 已创建',
      title: '生产订单创建'
    },
    orderUpdate: {
      content: '生产订单 {orderNo} 已更新',
      title: '生产订单变更'
    }
  },
  system: {
    backupFailed: {
      content: '系统数据备份失败，请检查备份配置',
      title: '数据备份失败'
    },
    backupSuccess: {
      content: '系统数据备份已成功完成',
      title: '数据备份成功'
    }
  },
  user: {
    create: {
      content: '管理员创建了用户 {username}',
      title: '用户创建'
    },
    loginFailed: {
      content: '用户 {username} 连续登录失败 {count} 次，请关注',
      title: '用户登录失败'
    },
    passwordReset: {
      content: '用户 {username} 的密码已被重置',
      title: '密码重置'
    },
    register: {
      content: '用户 {username} 已注册成功',
      title: '新用户注册'
    },
    roleChange: {
      content: '用户 {username} 的角色已变更为 {role}',
      title: '用户角色变更'
    },
    statusChange: {
      content: '用户 {username} 的状态已变更为 {status}',
      title: '用户状态变更'
    },
    update: {
      content: '用户 {username} 的信息已更新',
      title: '用户信息变更'
    }
  }
}
