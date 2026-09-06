/**
 * 项目配置元数据
 * 定义每个配置项的修改方式、生效方式、文件路径、跳转路径等
 */

// 修改方式枚举
export const EDIT_TYPE = {
  DATABASE: 'database',      // 数据库配置 - 可在参数配置页面修改
  CONFIG_FILE: 'configFile', // 配置文件 - 需要修改src/config/*.js
  ENV_FILE: 'envFile',       // 环境变量 - 需要修改.env文件
  CODE: 'code'               // 代码常量 - 需要修改代码
}

// 生效方式枚举
export const EFFECT_TYPE = {
  IMMEDIATE: 'immediate',    // 立即生效
  RESTART: 'restart',        // 需重启后端
  REBUILD: 'rebuild'         // 需重新构建前端
}

// 归属类型枚举
export const OWNER_TYPE = {
  FRONTEND: 'frontend',  // 前端
  BACKEND: 'backend'      // 后端
}

// 归属类型显示配置
export const OWNER_TYPE_CONFIG = {
  [OWNER_TYPE.FRONTEND]: {
    labelKey: 'menu.superPanel.projectConfig.ownerType.frontend',
    descriptionKey: 'menu.superPanel.projectConfig.ownerType.frontendTip',
    type: 'primary',
    icon: 'el-icon-monitor'
  },
  [OWNER_TYPE.BACKEND]: {
    labelKey: 'menu.superPanel.projectConfig.ownerType.backend',
    descriptionKey: 'menu.superPanel.projectConfig.ownerType.backendTip',
    type: 'success',
    icon: 'el-icon-cpu'
  }
}

/**
 * 根据生效方式自动判断归属
 * @param {string} effectType - 生效方式
 * @returns {string} 归属类型
 */
export function getOwnerByEffectType(effectType) {
  if (effectType === EFFECT_TYPE.REBUILD) {
    return OWNER_TYPE.FRONTEND
  }
  return OWNER_TYPE.BACKEND
}

/**
 * 从文件路径中提取文件名称
 * @param {string} filePath - 文件路径
 * @returns {string} 文件名称
 */
export function getFileNameFromPath(filePath) {
  if (!filePath) return ''
  const parts = filePath.split('/')
  return parts[parts.length - 1]
}

/**
 * 默认数据库表名称映射（根据配置项类别）
 */
export const DEFAULT_TABLE_NAMES = {
  security: 'nex_system_config',
  email: 'nex_email_config',
  plc: 'nex_system_config',
  system: 'nex_system_config'
}

/**
 * 获取数据库表名称
 * @param {object} meta - 配置元数据
 * @param {string} category - 配置项类别
 * @returns {string} 数据库表名称
 */
export function getTableName(meta, category) {
  if (meta?.tableName) return meta.tableName
  return DEFAULT_TABLE_NAMES[category] || 'nex_system_config'
}

/**
 * 配置项来源类型枚举
 */
export const SOURCE_TYPE = {
  FILE: 'file',           // 文件配置
  DATABASE: 'database',   // 数据库配置
  RUNTIME: 'runtime',     // 系统运行时信息（自动获取，无法修改）
  CODE: 'code'            // 代码常量（硬编码在代码中）
}

/**
 * 配置项来源类型显示配置
 */
export const SOURCE_TYPE_CONFIG = {
  [SOURCE_TYPE.FILE]: {
    icon: 'el-icon-folder-opened',
    labelKey: 'menu.superPanel.projectConfig.sourceType.file'
  },
  [SOURCE_TYPE.DATABASE]: {
    icon: 'el-icon-coin',
    labelKey: 'menu.superPanel.projectConfig.sourceType.database'
  },
  [SOURCE_TYPE.RUNTIME]: {
    icon: 'el-icon-monitor',
    labelKey: 'menu.superPanel.projectConfig.sourceType.runtime'
  },
  [SOURCE_TYPE.CODE]: {
    icon: 'el-icon-code',
    labelKey: 'menu.superPanel.projectConfig.sourceType.code'
  }
}

/**
 * 获取配置项来源类型
 * @param {object} meta - 配置元数据
 * @returns {string} 来源类型
 */
export function getSourceType(meta) {
  if (!meta) return SOURCE_TYPE.CODE
  // 如果配置元数据中明确指定了 sourceType，则使用指定的值
  if (meta.sourceType) return meta.sourceType
  // 根据 editType 和 filePath 自动判断
  if (meta.editType === EDIT_TYPE.DATABASE) {
    return SOURCE_TYPE.DATABASE
  }
  if (meta.filePath) {
    return SOURCE_TYPE.FILE
  }
  // 没有 filePath 的 CODE 类型，判断是运行时信息还是代码常量
  // 运行时信息通常在 environment 分类下，且 editType 为 CODE
  return SOURCE_TYPE.CODE
}

// 修改方式显示配置
export const EDIT_TYPE_CONFIG = {
  [EDIT_TYPE.DATABASE]: {
    label: '数据库配置',
    type: 'success',
    icon: 'el-icon-coin',
    description: '可在参数配置页面修改'
  },
  [EDIT_TYPE.CONFIG_FILE]: {
    label: '配置文件',
    type: 'warning',
    icon: 'el-icon-document',
    description: '需修改配置文件'
  },
  [EDIT_TYPE.ENV_FILE]: {
    label: '环境变量',
    type: 'danger',
    icon: 'el-icon-setting',
    description: '需修改.env文件'
  },
  [EDIT_TYPE.CODE]: {
    label: '代码常量',
    type: 'info',
    icon: 'el-icon-code',
    description: '需修改代码'
  }
}

// 生效方式显示配置
export const EFFECT_TYPE_CONFIG = {
  [EFFECT_TYPE.IMMEDIATE]: {
    label: '立即生效',
    type: 'success',
    icon: 'el-icon-circle-check'
  },
  [EFFECT_TYPE.RESTART]: {
    label: '需重启后端',
    type: 'warning',
    icon: 'el-icon-refresh-right'
  },
  [EFFECT_TYPE.REBUILD]: {
    label: '需重新构建',
    type: 'danger',
    icon: 'el-icon-upload'
  }
}

/**
 * 配置项元数据定义
 * key: 配置项的唯一标识（与后端返回的字段对应）
 * value: {
 *   label: 配置项名称,
 *   editType: 修改方式,
 *   effectType: 生效方式,
 *   filePath: 文件路径（配置文件/环境变量/代码）,
 *   redirectPath: 跳转路径（数据库配置时跳转到参数配置页面的路径）,
 *   redirectTab: 跳转的tab名称,
 *   description: 配置项说明
 * }
 */
export const CONFIG_META = {
  // ==================== 环境信息 ====================
  'environment.nodeEnv': {
    labelKey: 'menu.superPanel.projectConfig.items.environment.nodeEnv.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'menu.superPanel.projectConfig.items.environment.nodeEnv.description'
  },
  'environment.appPort': {
    labelKey: 'menu.superPanel.projectConfig.items.environment.appPort.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'menu.superPanel.projectConfig.items.environment.appPort.description'
  },
  'environment.appHost': {
    labelKey: 'menu.superPanel.projectConfig.items.environment.appHost.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'menu.superPanel.projectConfig.items.environment.appHost.description'
  },
  'environment.systemVersion': {
    labelKey: 'menu.superPanel.projectConfig.items.environment.systemVersion.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.REBUILD,
    filePath: 'package.json',
    descriptionKey: 'menu.superPanel.projectConfig.items.environment.systemVersion.description'
  },
  'environment.nodeVersion': {
    labelKey: 'menu.superPanel.projectConfig.items.environment.nodeVersion.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    sourceType: 'runtime',
    descriptionKey: 'menu.superPanel.projectConfig.items.environment.nodeVersion.description'
  },
  'environment.platform': {
    labelKey: 'menu.superPanel.projectConfig.items.environment.platform.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    sourceType: 'runtime',
    descriptionKey: 'menu.superPanel.projectConfig.items.environment.platform.description'
  },
  'environment.arch': {
    labelKey: 'menu.superPanel.projectConfig.items.environment.arch.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    sourceType: 'runtime',
    descriptionKey: 'menu.superPanel.projectConfig.items.environment.arch.description'
  },
  'environment.hostname': {
    labelKey: 'menu.superPanel.projectConfig.items.environment.hostname.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    sourceType: 'runtime',
    descriptionKey: 'menu.superPanel.projectConfig.items.environment.hostname.description'
  },
  'environment.localIp': {
    labelKey: 'menu.superPanel.projectConfig.items.environment.localIp.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    sourceType: 'runtime',
    descriptionKey: 'menu.superPanel.projectConfig.items.environment.localIp.description'
  },
  'environment.cwd': {
    labelKey: 'menu.superPanel.projectConfig.items.environment.cwd.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    sourceType: 'runtime',
    descriptionKey: 'menu.superPanel.projectConfig.items.environment.cwd.description'
  },
  'environment.projectRoot': {
    labelKey: 'menu.superPanel.projectConfig.items.environment.projectRoot.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    sourceType: 'runtime',
    descriptionKey: 'menu.superPanel.projectConfig.items.environment.projectRoot.description'
  },

  // ==================== 接口配置 ====================
  'api.apiPrefix': {
    labelKey: 'menu.superPanel.projectConfig.items.api.apiPrefix.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.REBUILD,
    filePath: 'src/modules/project-config/project-config.service.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.api.apiPrefix.description'
  },
  'api.corsEnabled': {
    labelKey: 'menu.superPanel.projectConfig.items.api.corsEnabled.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'app.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.api.corsEnabled.description'
  },
  'api.rateLimit': {
    labelKey: 'menu.superPanel.projectConfig.items.api.rateLimit.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/project-config/project-config.service.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.api.rateLimit.description'
  },
  'api.requestTimeout': {
    labelKey: 'menu.superPanel.projectConfig.items.api.requestTimeout.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.REBUILD,
    filePath: 'src/modules/project-config/project-config.service.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.api.requestTimeout.description'
  },
  'api.maxBodySize': {
    labelKey: 'menu.superPanel.projectConfig.items.api.maxBodySize.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'app.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.api.maxBodySize.description'
  },
  'api.maxFileSize': {
    labelKey: 'menu.superPanel.projectConfig.items.api.maxFileSize.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/upload.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.api.maxFileSize.description'
  },
  'api.corsOrigin': {
    labelKey: 'menu.superPanel.projectConfig.items.api.corsOrigin.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'app.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.api.corsOrigin.description'
  },
  'api.rateLimitWindow': {
    labelKey: 'menu.superPanel.projectConfig.items.api.rateLimitWindow.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/project-config/project-config.service.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.api.rateLimitWindow.description'
  },

  // ==================== 存储配置 ====================
  'storage.upload.dir': {
    labelKey: 'menu.superPanel.projectConfig.items.storage.upload.dir.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/upload.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.storage.upload.dir.description'
  },
  'storage.upload.maxSize': {
    labelKey: 'menu.superPanel.projectConfig.items.storage.upload.maxSize.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/upload.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.storage.upload.maxSize.description'
  },
  'storage.upload.allowedTypes': {
    labelKey: 'menu.superPanel.projectConfig.items.storage.upload.allowedTypes.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/upload.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.storage.upload.allowedTypes.description'
  },
  'storage.upload.staticPrefix': {
    labelKey: 'menu.superPanel.projectConfig.items.storage.upload.staticPrefix.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/upload.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.storage.upload.staticPrefix.description'
  },
  'storage.github.enabled': {
    labelKey: 'menu.superPanel.projectConfig.items.storage.github.enabled.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/upload.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.storage.github.enabled.description'
  },
  'storage.github.owner': {
    labelKey: 'menu.superPanel.projectConfig.items.storage.github.owner.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'menu.superPanel.projectConfig.items.storage.github.owner.description'
  },
  'storage.github.repo': {
    labelKey: 'menu.superPanel.projectConfig.items.storage.github.repo.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'menu.superPanel.projectConfig.items.storage.github.repo.description'
  },
  'storage.github.branch': {
    labelKey: 'menu.superPanel.projectConfig.items.storage.github.branch.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'menu.superPanel.projectConfig.items.storage.github.branch.description'
  },
  'storage.github.pathPrefix': {
    labelKey: 'menu.superPanel.projectConfig.items.storage.github.pathPrefix.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'menu.superPanel.projectConfig.items.storage.github.pathPrefix.description'
  },
  'storage.github.maxSize': {
    labelKey: 'menu.superPanel.projectConfig.items.storage.github.maxSize.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/upload.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.storage.github.maxSize.description'
  },
  'storage.backup.dir': {
    labelKey: 'menu.superPanel.projectConfig.items.storage.backup.dir.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/db-manager/db-manager.model.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.storage.backup.dir.description'
  },
  'storage.logs.dir': {
    labelKey: 'menu.superPanel.projectConfig.items.storage.logs.dir.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/db-manager/db-manager.model.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.storage.logs.dir.description'
  },
  'storage.license.dir': {
    labelKey: 'menu.superPanel.projectConfig.items.storage.license.dir.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/license.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.storage.license.dir.description'
  },
  'storage.license.licensePath': {
    labelKey: 'menu.superPanel.projectConfig.items.storage.license.licensePath.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/license.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.storage.license.licensePath.description'
  },
  'storage.license.publicKeyPath': {
    labelKey: 'menu.superPanel.projectConfig.items.storage.license.publicKeyPath.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/license.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.storage.license.publicKeyPath.description'
  },
  'storage.license.timeGuardPath': {
    labelKey: 'menu.superPanel.projectConfig.items.storage.license.timeGuardPath.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/license.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.storage.license.timeGuardPath.description'
  },

  // ==================== 安全配置 ====================
  'security.jwt.expiresIn': {
    labelKey: 'menu.superPanel.projectConfig.items.security.jwt.expiresIn.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/jwt.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.security.jwt.expiresIn.description'
  },
  'security.jwt.algorithm': {
    labelKey: 'menu.superPanel.projectConfig.items.security.jwt.algorithm.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/jwt.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.security.jwt.algorithm.description'
  },
  'security.session.timeout': {
    labelKey: 'menu.superPanel.projectConfig.items.security.session.timeout.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/system/config',
    redirectTab: 'security',
    descriptionKey: 'menu.superPanel.projectConfig.items.security.session.timeout.description'
  },
  'security.login.failedThreshold': {
    labelKey: 'menu.superPanel.projectConfig.items.security.login.failedThreshold.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/system/config',
    redirectTab: 'security',
    descriptionKey: 'menu.superPanel.projectConfig.items.security.login.failedThreshold.description'
  },
  'security.login.lockDuration': {
    labelKey: 'menu.superPanel.projectConfig.items.security.login.lockDuration.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/system/config',
    redirectTab: 'security',
    descriptionKey: 'menu.superPanel.projectConfig.items.security.login.lockDuration.description'
  },
  'security.password.minLength': {
    labelKey: 'menu.superPanel.projectConfig.items.security.password.minLength.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/system/config',
    redirectTab: 'security',
    descriptionKey: 'menu.superPanel.projectConfig.items.security.password.minLength.description'
  },
  'security.password.requireUppercase': {
    labelKey: 'menu.superPanel.projectConfig.items.security.password.requireUppercase.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/user/user.service.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.security.password.requireUppercase.description'
  },
  'security.password.requireLowercase': {
    labelKey: 'menu.superPanel.projectConfig.items.security.password.requireLowercase.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/user/user.service.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.security.password.requireLowercase.description'
  },
  'security.password.requireNumber': {
    labelKey: 'menu.superPanel.projectConfig.items.security.password.requireNumber.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/user/user.service.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.security.password.requireNumber.description'
  },
  'security.password.requireSymbol': {
    labelKey: 'menu.superPanel.projectConfig.items.security.password.requireSymbol.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/user/user.service.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.security.password.requireSymbol.description'
  },
  'security.password.bcryptSaltRounds': {
    labelKey: 'menu.superPanel.projectConfig.items.security.password.bcryptSaltRounds.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/app.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.security.password.bcryptSaltRounds.description'
  },
  'security.watermark.enabled': {
    labelKey: 'menu.superPanel.projectConfig.items.security.watermark.enabled.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/system/config',
    redirectTab: 'system',
    descriptionKey: 'menu.superPanel.projectConfig.items.security.watermark.enabled.description'
  },

  // ==================== 数据库配置 ====================
  'database.host': {
    labelKey: 'menu.superPanel.projectConfig.items.database.host.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'menu.superPanel.projectConfig.items.database.host.description'
  },
  'database.port': {
    labelKey: 'menu.superPanel.projectConfig.items.database.port.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'menu.superPanel.projectConfig.items.database.port.description'
  },
  'database.user': {
    labelKey: 'menu.superPanel.projectConfig.items.database.user.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'menu.superPanel.projectConfig.items.database.user.description'
  },
  'database.password': {
    labelKey: 'menu.superPanel.projectConfig.items.database.password.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'menu.superPanel.projectConfig.items.database.password.description'
  },
  'database.database': {
    labelKey: 'menu.superPanel.projectConfig.items.database.database.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'menu.superPanel.projectConfig.items.database.database.description'
  },
  'database.connectionLimit': {
    labelKey: 'menu.superPanel.projectConfig.items.database.connectionLimit.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/db.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.database.connectionLimit.description'
  },
  'database.waitForConnections': {
    labelKey: 'menu.superPanel.projectConfig.items.database.waitForConnections.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/db.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.database.waitForConnections.description'
  },
  'database.queueLimit': {
    labelKey: 'menu.superPanel.projectConfig.items.database.queueLimit.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/db.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.database.queueLimit.description'
  },

  // ==================== 授权配置 ====================
  'license.projectId': {
    labelKey: 'menu.superPanel.projectConfig.items.license.projectId.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/license.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.license.projectId.description'
  },
  'license.strictMode': {
    labelKey: 'menu.superPanel.projectConfig.items.license.strictMode.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/license.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.license.strictMode.description'
  },
  'license.licensePath': {
    labelKey: 'menu.superPanel.projectConfig.items.license.licensePath.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/license.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.license.licensePath.description'
  },
  'license.publicKeyPath': {
    labelKey: 'menu.superPanel.projectConfig.items.license.publicKeyPath.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/license.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.license.publicKeyPath.description'
  },
  'license.licenseServerUrl': {
    labelKey: 'menu.superPanel.projectConfig.items.license.licenseServerUrl.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/license.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.license.licenseServerUrl.description'
  },
  'license.timeGuardPath': {
    labelKey: 'menu.superPanel.projectConfig.items.license.timeGuardPath.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/license.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.license.timeGuardPath.description'
  },
  'license.maxFileSize': {
    labelKey: 'menu.superPanel.projectConfig.items.license.maxFileSize.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/license.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.license.maxFileSize.description'
  },
  'license.allowedExtname': {
    labelKey: 'menu.superPanel.projectConfig.items.license.allowedExtname.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/license.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.license.allowedExtname.description'
  },

  // ==================== 邮箱配置 ====================
  'email.enabled': {
    labelKey: 'menu.superPanel.projectConfig.items.email.enabled.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'email',
    descriptionKey: 'menu.superPanel.projectConfig.items.email.enabled.description'
  },
  'email.defaultProvider': {
    labelKey: 'menu.superPanel.projectConfig.items.email.defaultProvider.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/email/email.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.email.defaultProvider.description'
  },
  'email.host': {
    labelKey: 'menu.superPanel.projectConfig.items.email.host.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'email',
    descriptionKey: 'menu.superPanel.projectConfig.items.email.host.description'
  },
  'email.port': {
    labelKey: 'menu.superPanel.projectConfig.items.email.port.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'email',
    descriptionKey: 'menu.superPanel.projectConfig.items.email.port.description'
  },
  'email.secure': {
    labelKey: 'menu.superPanel.projectConfig.items.email.secure.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'email',
    descriptionKey: 'menu.superPanel.projectConfig.items.email.secure.description'
  },
  'email.username': {
    labelKey: 'menu.superPanel.projectConfig.items.email.username.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'email',
    descriptionKey: 'menu.superPanel.projectConfig.items.email.username.description'
  },
  'email.fromName': {
    labelKey: 'menu.superPanel.projectConfig.items.email.fromName.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'email',
    descriptionKey: 'menu.superPanel.projectConfig.items.email.fromName.description'
  },
  'email.send.maxRetries': {
    labelKey: 'menu.superPanel.projectConfig.items.email.send.maxRetries.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/email/email.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.email.send.maxRetries.description'
  },
  'email.send.retryDelay': {
    labelKey: 'menu.superPanel.projectConfig.items.email.send.retryDelay.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/email/email.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.email.send.retryDelay.description'
  },
  'email.send.timeout': {
    labelKey: 'menu.superPanel.projectConfig.items.email.send.timeout.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/email/email.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.email.send.timeout.description'
  },
  'email.send.logEnabled': {
    labelKey: 'menu.superPanel.projectConfig.items.email.send.logEnabled.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/email/email.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.email.send.logEnabled.description'
  },
  'email.passwordReset.tokenExpiresIn': {
    labelKey: 'menu.superPanel.projectConfig.items.email.passwordReset.tokenExpiresIn.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/email/email.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.email.passwordReset.tokenExpiresIn.description'
  },
  'email.passwordReset.tokenLength': {
    labelKey: 'menu.superPanel.projectConfig.items.email.passwordReset.tokenLength.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/email/email.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.email.passwordReset.tokenLength.description'
  },
  'email.passwordReset.maxActiveTokens': {
    labelKey: 'menu.superPanel.projectConfig.items.email.passwordReset.maxActiveTokens.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/email/email.config.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.email.passwordReset.maxActiveTokens.description'
  },

  // ==================== PLC配置 ====================
  'plc.activeProtocol': {
    labelKey: 'menu.superPanel.projectConfig.items.plc.activeProtocol.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'menu.superPanel.projectConfig.items.plc.activeProtocol.description'
  },
  'plc.supportedProtocols': {
    labelKey: 'menu.superPanel.projectConfig.items.plc.supportedProtocols.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/plc/config/plcSetting.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.plc.supportedProtocols.description'
  },
  'plc.connection.host': {
    labelKey: 'menu.superPanel.projectConfig.items.plc.connection.host.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'menu.superPanel.projectConfig.items.plc.connection.host.description'
  },
  'plc.connection.port': {
    labelKey: 'menu.superPanel.projectConfig.items.plc.connection.port.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'menu.superPanel.projectConfig.items.plc.connection.port.description'
  },
  'plc.connection.unitId': {
    labelKey: 'menu.superPanel.projectConfig.items.plc.connection.unitId.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'menu.superPanel.projectConfig.items.plc.connection.unitId.description'
  },
  'plc.connection.rack': {
    labelKey: 'menu.superPanel.projectConfig.items.plc.connection.rack.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'menu.superPanel.projectConfig.items.plc.connection.rack.description'
  },
  'plc.connection.slot': {
    labelKey: 'menu.superPanel.projectConfig.items.plc.connection.slot.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'menu.superPanel.projectConfig.items.plc.connection.slot.description'
  },
  'plc.poll.fastInterval': {
    labelKey: 'menu.superPanel.projectConfig.items.plc.poll.fastInterval.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'menu.superPanel.projectConfig.items.plc.poll.fastInterval.description'
  },
  'plc.poll.slowInterval': {
    labelKey: 'menu.superPanel.projectConfig.items.plc.poll.slowInterval.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'menu.superPanel.projectConfig.items.plc.poll.slowInterval.description'
  },
  'plc.poll.reconnectDelay': {
    labelKey: 'menu.superPanel.projectConfig.items.plc.poll.reconnectDelay.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'menu.superPanel.projectConfig.items.plc.poll.reconnectDelay.description'
  },
  'plc.enablePoll': {
    labelKey: 'menu.superPanel.projectConfig.items.plc.enablePoll.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'menu.superPanel.projectConfig.items.plc.enablePoll.description'
  },
  'plc.enableWriteAudit': {
    labelKey: 'menu.superPanel.projectConfig.items.plc.enableWriteAudit.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'menu.superPanel.projectConfig.items.plc.enableWriteAudit.description'
  },
  'plc.maxWriteRetry': {
    labelKey: 'menu.superPanel.projectConfig.items.plc.maxWriteRetry.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/plc/config/plcSetting.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.plc.maxWriteRetry.description'
  },
  'plc.timeouts.connect': {
    labelKey: 'menu.superPanel.projectConfig.items.plc.timeouts.connect.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/plc/config/plcSetting.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.plc.timeouts.connect.description'
  },
  'plc.timeouts.read': {
    labelKey: 'menu.superPanel.projectConfig.items.plc.timeouts.read.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/plc/config/plcSetting.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.plc.timeouts.read.description'
  },
  'plc.timeouts.readBatch': {
    labelKey: 'menu.superPanel.projectConfig.items.plc.timeouts.readBatch.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/plc/config/plcSetting.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.plc.timeouts.readBatch.description'
  },
  'plc.timeouts.write': {
    labelKey: 'menu.superPanel.projectConfig.items.plc.timeouts.write.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/plc/config/plcSetting.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.plc.timeouts.write.description'
  },
  'plc.timeouts.general': {
    labelKey: 'menu.superPanel.projectConfig.items.plc.timeouts.general.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/plc/config/plcSetting.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.plc.timeouts.general.description'
  },
  'plc.multiDeviceEnabled': {
    labelKey: 'menu.superPanel.projectConfig.items.plc.multiDeviceEnabled.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/plc/config/plcSetting.js',
    descriptionKey: 'menu.superPanel.projectConfig.items.plc.multiDeviceEnabled.description'
  }
}

/**
 * 根据配置key获取元数据
 * @param {string} key - 配置项key，如 'environment.nodeEnv'
 * @returns {Object|null} 配置项元数据
 */
export function getConfigMeta(key) {
  return CONFIG_META[key] || null
}

/**
 * 获取修改方式的显示配置
 * @param {string} editType - 修改方式
 * @returns {Object} 显示配置
 */
export function getEditTypeConfig(editType) {
  return EDIT_TYPE_CONFIG[editType] || EDIT_TYPE_CONFIG[EDIT_TYPE.CODE]
}

/**
 * 获取生效方式的显示配置
 * @param {string} effectType - 生效方式
 * @returns {Object} 显示配置
 */
export function getEffectTypeConfig(effectType) {
  return EFFECT_TYPE_CONFIG[effectType] || EFFECT_TYPE_CONFIG[EFFECT_TYPE.RESTART]
}
