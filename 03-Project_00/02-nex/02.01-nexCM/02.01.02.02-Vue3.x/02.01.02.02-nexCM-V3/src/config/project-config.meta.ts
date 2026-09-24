/**
 * 项目配置元数据（框架无关，从 Vue2 project-config.meta.js 迁移并补类型）
 * 定义每个配置项的修改方式、生效方式、文件路径、跳转路径等
 * @author GooHv
 */

// 修改方式枚举
export const EDIT_TYPE = {
  DATABASE: 'database',
  CONFIG_FILE: 'configFile',
  ENV_FILE: 'envFile',
  CODE: 'code'
} as const
export type EditType = (typeof EDIT_TYPE)[keyof typeof EDIT_TYPE]

// 生效方式枚举
export const EFFECT_TYPE = {
  IMMEDIATE: 'immediate',
  RESTART: 'restart',
  REBUILD: 'rebuild'
} as const
export type EffectType = (typeof EFFECT_TYPE)[keyof typeof EFFECT_TYPE]

// 归属类型枚举
export const OWNER_TYPE = {
  FRONTEND: 'frontend',
  BACKEND: 'backend'
} as const
export type OwnerType = (typeof OWNER_TYPE)[keyof typeof OWNER_TYPE]

// 来源类型枚举
export const SOURCE_TYPE = {
  FILE: 'file',
  DATABASE: 'database',
  RUNTIME: 'runtime',
  CODE: 'code'
} as const
export type SourceType = (typeof SOURCE_TYPE)[keyof typeof SOURCE_TYPE]

export interface OwnerTypeConfig {
  labelKey: string
  descriptionKey: string
  type: 'primary' | 'success'
  icon: string
}

// 归属类型显示配置
export const OWNER_TYPE_CONFIG: Record<OwnerType, OwnerTypeConfig> = {
  [OWNER_TYPE.FRONTEND]: {
    labelKey: 'superPanel.projectConfig.ownerType.frontend',
    descriptionKey: 'superPanel.projectConfig.ownerType.frontendTip',
    type: 'primary',
    icon: 'el-icon-monitor'
  },
  [OWNER_TYPE.BACKEND]: {
    labelKey: 'superPanel.projectConfig.ownerType.backend',
    descriptionKey: 'superPanel.projectConfig.ownerType.backendTip',
    type: 'success',
    icon: 'el-icon-cpu'
  }
}

/**
 * 根据生效方式自动判断归属
 * @param effectType 生效方式
 * @returns 归属类型
 */
export function getOwnerByEffectType(effectType?: EffectType): OwnerType {
  if (effectType === EFFECT_TYPE.REBUILD) return OWNER_TYPE.FRONTEND
  return OWNER_TYPE.BACKEND
}

/** 从文件路径中提取文件名称 */
export function getFileNameFromPath(filePath?: string): string {
  if (!filePath) return ''
  const parts = filePath.split('/')
  return parts[parts.length - 1]
}

/** 默认数据库表名称映射（根据配置项类别） */
export const DEFAULT_TABLE_NAMES: Record<string, string> = {
  security: 'nex_system_config',
  email: 'nex_email_config',
  plc: 'nex_system_config',
  system: 'nex_system_config'
}

/**
 * 获取数据库表名称
 * @param meta 配置元数据
 * @param category 配置项类别
 */
export function getTableName(meta?: ConfigMetaItem, category?: string): string {
  if (meta?.tableName) return meta.tableName
  return (category && DEFAULT_TABLE_NAMES[category]) || 'nex_system_config'
}

export interface SourceTypeConfig {
  icon: string
  labelKey: string
}

// 来源类型显示配置
export const SOURCE_TYPE_CONFIG: Record<SourceType, SourceTypeConfig> = {
  [SOURCE_TYPE.FILE]: { icon: 'el-icon-folder-opened', labelKey: 'superPanel.projectConfig.sourceType.file' },
  [SOURCE_TYPE.DATABASE]: { icon: 'el-icon-coin', labelKey: 'superPanel.projectConfig.sourceType.database' },
  [SOURCE_TYPE.RUNTIME]: { icon: 'el-icon-monitor', labelKey: 'superPanel.projectConfig.sourceType.runtime' },
  [SOURCE_TYPE.CODE]: { icon: 'el-icon-code', labelKey: 'superPanel.projectConfig.sourceType.code' }
}

/** 获取配置项来源类型 */
export function getSourceType(meta?: ConfigMetaItem | null): SourceType {
  if (!meta) return SOURCE_TYPE.CODE
  if (meta.sourceType) return meta.sourceType as SourceType
  if (meta.editType === EDIT_TYPE.DATABASE) return SOURCE_TYPE.DATABASE
  if (meta.filePath) return SOURCE_TYPE.FILE
  return SOURCE_TYPE.CODE
}

export interface ConfigMetaItem {
  labelKey?: string
  label?: string
  editType?: EditType
  effectType?: EffectType
  owner?: OwnerType
  sourceType?: SourceType
  filePath?: string
  tableName?: string
  redirectPath?: string
  redirectTab?: string
  descriptionKey?: string
  description?: string
  highlightLine?: number
}

// 修改方式显示配置
export const EDIT_TYPE_CONFIG: Record<
  EditType,
  { label: string; type: 'success' | 'warning' | 'danger' | 'info'; icon: string; description: string }
> = {
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
  [EDIT_TYPE.ENV_FILE]: { label: '环境变量', type: 'danger', icon: 'el-icon-setting', description: '需修改.env文件' },
  [EDIT_TYPE.CODE]: { label: '代码常量', type: 'info', icon: 'el-icon-code', description: '需修改代码' }
}

// 生效方式显示配置
export const EFFECT_TYPE_CONFIG: Record<
  EffectType,
  { label: string; type: 'success' | 'warning' | 'danger'; icon: string }
> = {
  [EFFECT_TYPE.IMMEDIATE]: { label: '立即生效', type: 'success', icon: 'el-icon-circle-check' },
  [EFFECT_TYPE.RESTART]: { label: '需重启后端', type: 'warning', icon: 'el-icon-refresh-right' },
  [EFFECT_TYPE.REBUILD]: { label: '需重新构建', type: 'danger', icon: 'el-icon-upload' }
}

/**
 * 配置项元数据定义
 * key: 配置项的唯一标识（与后端返回的字段对应）
 */
export const CONFIG_META: Record<string, ConfigMetaItem> = {
  // ==================== 环境信息 ====================
  'environment.nodeEnv': {
    labelKey: 'superPanel.projectConfig.items.environment.nodeEnv.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'superPanel.projectConfig.items.environment.nodeEnv.description'
  },
  'environment.appPort': {
    labelKey: 'superPanel.projectConfig.items.environment.appPort.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'superPanel.projectConfig.items.environment.appPort.description'
  },
  'environment.appHost': {
    labelKey: 'superPanel.projectConfig.items.environment.appHost.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'superPanel.projectConfig.items.environment.appHost.description'
  },
  'environment.systemVersion': {
    labelKey: 'superPanel.projectConfig.items.environment.systemVersion.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.REBUILD,
    filePath: 'package.json',
    descriptionKey: 'superPanel.projectConfig.items.environment.systemVersion.description'
  },
  'environment.nodeVersion': {
    labelKey: 'superPanel.projectConfig.items.environment.nodeVersion.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    sourceType: 'runtime',
    descriptionKey: 'superPanel.projectConfig.items.environment.nodeVersion.description'
  },
  'environment.platform': {
    labelKey: 'superPanel.projectConfig.items.environment.platform.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    sourceType: 'runtime',
    descriptionKey: 'superPanel.projectConfig.items.environment.platform.description'
  },
  'environment.arch': {
    labelKey: 'superPanel.projectConfig.items.environment.arch.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    sourceType: 'runtime',
    descriptionKey: 'superPanel.projectConfig.items.environment.arch.description'
  },
  'environment.hostname': {
    labelKey: 'superPanel.projectConfig.items.environment.hostname.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    sourceType: 'runtime',
    descriptionKey: 'superPanel.projectConfig.items.environment.hostname.description'
  },
  'environment.localIp': {
    labelKey: 'superPanel.projectConfig.items.environment.localIp.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    sourceType: 'runtime',
    descriptionKey: 'superPanel.projectConfig.items.environment.localIp.description'
  },
  'environment.cwd': {
    labelKey: 'superPanel.projectConfig.items.environment.cwd.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    sourceType: 'runtime',
    descriptionKey: 'superPanel.projectConfig.items.environment.cwd.description'
  },
  'environment.projectRoot': {
    labelKey: 'superPanel.projectConfig.items.environment.projectRoot.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    sourceType: 'runtime',
    descriptionKey: 'superPanel.projectConfig.items.environment.projectRoot.description'
  },

  // ==================== 接口配置 ====================
  'api.apiPrefix': {
    labelKey: 'superPanel.projectConfig.items.api.apiPrefix.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.REBUILD,
    filePath: 'src/modules/project-config/project-config.service.js',
    descriptionKey: 'superPanel.projectConfig.items.api.apiPrefix.description'
  },
  'api.corsEnabled': {
    labelKey: 'superPanel.projectConfig.items.api.corsEnabled.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'app.js',
    descriptionKey: 'superPanel.projectConfig.items.api.corsEnabled.description'
  },
  'api.rateLimit': {
    labelKey: 'superPanel.projectConfig.items.api.rateLimit.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/project-config/project-config.service.js',
    descriptionKey: 'superPanel.projectConfig.items.api.rateLimit.description'
  },
  'api.requestTimeout': {
    labelKey: 'superPanel.projectConfig.items.api.requestTimeout.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.REBUILD,
    filePath: 'src/modules/project-config/project-config.service.js',
    descriptionKey: 'superPanel.projectConfig.items.api.requestTimeout.description'
  },
  'api.maxBodySize': {
    labelKey: 'superPanel.projectConfig.items.api.maxBodySize.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'app.js',
    descriptionKey: 'superPanel.projectConfig.items.api.maxBodySize.description'
  },
  'api.maxFileSize': {
    labelKey: 'superPanel.projectConfig.items.api.maxFileSize.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/upload.config.js',
    descriptionKey: 'superPanel.projectConfig.items.api.maxFileSize.description'
  },
  'api.corsOrigin': {
    labelKey: 'superPanel.projectConfig.items.api.corsOrigin.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'app.js',
    descriptionKey: 'superPanel.projectConfig.items.api.corsOrigin.description'
  },
  'api.rateLimitWindow': {
    labelKey: 'superPanel.projectConfig.items.api.rateLimitWindow.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/project-config/project-config.service.js',
    descriptionKey: 'superPanel.projectConfig.items.api.rateLimitWindow.description'
  },

  // ==================== 存储配置 ====================
  'storage.upload.dir': {
    labelKey: 'superPanel.projectConfig.items.storage.upload.dir.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/upload.config.js',
    descriptionKey: 'superPanel.projectConfig.items.storage.upload.dir.description'
  },
  'storage.upload.maxSize': {
    labelKey: 'superPanel.projectConfig.items.storage.upload.maxSize.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/upload.config.js',
    descriptionKey: 'superPanel.projectConfig.items.storage.upload.maxSize.description'
  },
  'storage.upload.allowedTypes': {
    labelKey: 'superPanel.projectConfig.items.storage.upload.allowedTypes.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/upload.config.js',
    descriptionKey: 'superPanel.projectConfig.items.storage.upload.allowedTypes.description'
  },
  'storage.upload.staticPrefix': {
    labelKey: 'superPanel.projectConfig.items.storage.upload.staticPrefix.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/upload.config.js',
    descriptionKey: 'superPanel.projectConfig.items.storage.upload.staticPrefix.description'
  },
  'storage.github.enabled': {
    labelKey: 'superPanel.projectConfig.items.storage.github.enabled.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/upload.config.js',
    descriptionKey: 'superPanel.projectConfig.items.storage.github.enabled.description'
  },
  'storage.github.owner': {
    labelKey: 'superPanel.projectConfig.items.storage.github.owner.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'superPanel.projectConfig.items.storage.github.owner.description'
  },
  'storage.github.repo': {
    labelKey: 'superPanel.projectConfig.items.storage.github.repo.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'superPanel.projectConfig.items.storage.github.repo.description'
  },
  'storage.github.branch': {
    labelKey: 'superPanel.projectConfig.items.storage.github.branch.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'superPanel.projectConfig.items.storage.github.branch.description'
  },
  'storage.github.pathPrefix': {
    labelKey: 'superPanel.projectConfig.items.storage.github.pathPrefix.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'superPanel.projectConfig.items.storage.github.pathPrefix.description'
  },
  'storage.github.maxSize': {
    labelKey: 'superPanel.projectConfig.items.storage.github.maxSize.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/upload.config.js',
    descriptionKey: 'superPanel.projectConfig.items.storage.github.maxSize.description'
  },
  'storage.backup.dir': {
    labelKey: 'superPanel.projectConfig.items.storage.backup.dir.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.RESTART,
    redirectPath: '/super-panel/database',
    descriptionKey: 'superPanel.projectConfig.items.storage.backup.dir.description'
  },
  'storage.backup.menuDir': {
    labelKey: 'superPanel.projectConfig.items.storage.backup.menuDir.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.RESTART,
    redirectPath: '/super-panel/menu-config',
    descriptionKey: 'superPanel.projectConfig.items.storage.backup.menuDir.description'
  },
  'storage.backup.i18nDir': {
    labelKey: 'superPanel.projectConfig.items.storage.backup.i18nDir.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.RESTART,
    redirectPath: '/super-panel/i18n',
    descriptionKey: 'superPanel.projectConfig.items.storage.backup.i18nDir.description'
  },
  'storage.backup.configDir': {
    labelKey: 'superPanel.projectConfig.items.storage.backup.configDir.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.RESTART,
    redirectPath: '/super-panel/config',
    descriptionKey: 'superPanel.projectConfig.items.storage.backup.configDir.description'
  },
  'storage.logs.dir': {
    labelKey: 'superPanel.projectConfig.items.storage.logs.dir.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/db-manager/db-manager.model.js',
    descriptionKey: 'superPanel.projectConfig.items.storage.logs.dir.description'
  },
  'storage.superPanel.license.dir': {
    labelKey: 'superPanel.projectConfig.items.storage.superPanel.license.dir.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/superPanel.license.config.js',
    descriptionKey: 'superPanel.projectConfig.items.storage.superPanel.license.dir.description'
  },
  'storage.superPanel.license.licensePath': {
    labelKey: 'superPanel.projectConfig.items.storage.superPanel.license.licensePath.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/superPanel.license.config.js',
    descriptionKey: 'superPanel.projectConfig.items.storage.superPanel.license.licensePath.description'
  },
  'storage.superPanel.license.publicKeyPath': {
    labelKey: 'superPanel.projectConfig.items.storage.superPanel.license.publicKeyPath.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/superPanel.license.config.js',
    descriptionKey: 'superPanel.projectConfig.items.storage.superPanel.license.publicKeyPath.description'
  },
  'storage.superPanel.license.timeGuardPath': {
    labelKey: 'superPanel.projectConfig.items.storage.superPanel.license.timeGuardPath.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/superPanel.license.config.js',
    descriptionKey: 'superPanel.projectConfig.items.storage.superPanel.license.timeGuardPath.description'
  },

  // ==================== 安全配置 ====================
  'security.jwt.expiresIn': {
    labelKey: 'superPanel.projectConfig.items.security.jwt.expiresIn.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/jwt.config.js',
    descriptionKey: 'superPanel.projectConfig.items.security.jwt.expiresIn.description'
  },
  'security.jwt.algorithm': {
    labelKey: 'superPanel.projectConfig.items.security.jwt.algorithm.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/jwt.config.js',
    descriptionKey: 'superPanel.projectConfig.items.security.jwt.algorithm.description'
  },
  'security.session.timeout': {
    labelKey: 'superPanel.projectConfig.items.security.session.timeout.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/system/config',
    redirectTab: 'security',
    descriptionKey: 'superPanel.projectConfig.items.security.session.timeout.description'
  },
  'security.layout.login.failedThreshold': {
    labelKey: 'superPanel.projectConfig.items.security.layout.login.failedThreshold.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/system/config',
    redirectTab: 'security',
    descriptionKey: 'superPanel.projectConfig.items.security.layout.login.failedThreshold.description'
  },
  'security.layout.login.lockDuration': {
    labelKey: 'superPanel.projectConfig.items.security.layout.login.lockDuration.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/system/config',
    redirectTab: 'security',
    descriptionKey: 'superPanel.projectConfig.items.security.layout.login.lockDuration.description'
  },
  'security.password.minLength': {
    labelKey: 'superPanel.projectConfig.items.security.password.minLength.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/system/config',
    redirectTab: 'security',
    descriptionKey: 'superPanel.projectConfig.items.security.password.minLength.description'
  },
  'security.password.requireUppercase': {
    labelKey: 'superPanel.projectConfig.items.security.password.requireUppercase.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/user/user.service.js',
    descriptionKey: 'superPanel.projectConfig.items.security.password.requireUppercase.description'
  },
  'security.password.requireLowercase': {
    labelKey: 'superPanel.projectConfig.items.security.password.requireLowercase.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/user/user.service.js',
    descriptionKey: 'superPanel.projectConfig.items.security.password.requireLowercase.description'
  },
  'security.password.requireNumber': {
    labelKey: 'superPanel.projectConfig.items.security.password.requireNumber.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/user/user.service.js',
    descriptionKey: 'superPanel.projectConfig.items.security.password.requireNumber.description'
  },
  'security.password.requireSymbol': {
    labelKey: 'superPanel.projectConfig.items.security.password.requireSymbol.label',
    editType: EDIT_TYPE.CODE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/user/user.service.js',
    descriptionKey: 'superPanel.projectConfig.items.security.password.requireSymbol.description'
  },
  'security.password.bcryptSaltRounds': {
    labelKey: 'superPanel.projectConfig.items.security.password.bcryptSaltRounds.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/app.config.js',
    descriptionKey: 'superPanel.projectConfig.items.security.password.bcryptSaltRounds.description'
  },
  'security.watermark.enabled': {
    labelKey: 'superPanel.projectConfig.items.security.watermark.enabled.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/system/config',
    redirectTab: 'system',
    descriptionKey: 'superPanel.projectConfig.items.security.watermark.enabled.description'
  },

  // ==================== 数据库配置 ====================
  'database.host': {
    labelKey: 'superPanel.projectConfig.items.database.host.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'superPanel.projectConfig.items.database.host.description'
  },
  'database.port': {
    labelKey: 'superPanel.projectConfig.items.database.port.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'superPanel.projectConfig.items.database.port.description'
  },
  'database.user': {
    labelKey: 'superPanel.projectConfig.items.database.user.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'superPanel.projectConfig.items.database.user.description'
  },
  'database.password': {
    labelKey: 'superPanel.projectConfig.items.database.password.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'superPanel.projectConfig.items.database.password.description'
  },
  'database.database': {
    labelKey: 'superPanel.projectConfig.items.database.database.label',
    editType: EDIT_TYPE.ENV_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: '.env',
    descriptionKey: 'superPanel.projectConfig.items.database.database.description'
  },
  'database.connectionLimit': {
    labelKey: 'superPanel.projectConfig.items.database.connectionLimit.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/db.config.js',
    descriptionKey: 'superPanel.projectConfig.items.database.connectionLimit.description'
  },
  'database.waitForConnections': {
    labelKey: 'superPanel.projectConfig.items.database.waitForConnections.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/db.config.js',
    descriptionKey: 'superPanel.projectConfig.items.database.waitForConnections.description'
  },
  'database.queueLimit': {
    labelKey: 'superPanel.projectConfig.items.database.queueLimit.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/db.config.js',
    descriptionKey: 'superPanel.projectConfig.items.database.queueLimit.description'
  },

  // ==================== 授权配置 ====================
  'superPanel.license.projectId': {
    labelKey: 'superPanel.projectConfig.items.superPanel.license.projectId.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/superPanel.license.config.js',
    descriptionKey: 'superPanel.projectConfig.items.superPanel.license.projectId.description'
  },
  'superPanel.license.strictMode': {
    labelKey: 'superPanel.projectConfig.items.superPanel.license.strictMode.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/superPanel.license.config.js',
    descriptionKey: 'superPanel.projectConfig.items.superPanel.license.strictMode.description'
  },
  'superPanel.license.licensePath': {
    labelKey: 'superPanel.projectConfig.items.superPanel.license.licensePath.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/superPanel.license.config.js',
    descriptionKey: 'superPanel.projectConfig.items.superPanel.license.licensePath.description'
  },
  'superPanel.license.publicKeyPath': {
    labelKey: 'superPanel.projectConfig.items.superPanel.license.publicKeyPath.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/superPanel.license.config.js',
    descriptionKey: 'superPanel.projectConfig.items.superPanel.license.publicKeyPath.description'
  },
  'superPanel.license.licenseServerUrl': {
    labelKey: 'superPanel.projectConfig.items.superPanel.license.licenseServerUrl.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/superPanel.license.config.js',
    descriptionKey: 'superPanel.projectConfig.items.superPanel.license.licenseServerUrl.description'
  },
  'superPanel.license.timeGuardPath': {
    labelKey: 'superPanel.projectConfig.items.superPanel.license.timeGuardPath.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/superPanel.license.config.js',
    descriptionKey: 'superPanel.projectConfig.items.superPanel.license.timeGuardPath.description'
  },
  'superPanel.license.maxFileSize': {
    labelKey: 'superPanel.projectConfig.items.superPanel.license.maxFileSize.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/superPanel.license.config.js',
    descriptionKey: 'superPanel.projectConfig.items.superPanel.license.maxFileSize.description'
  },
  'superPanel.license.allowedExtname': {
    labelKey: 'superPanel.projectConfig.items.superPanel.license.allowedExtname.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/config/superPanel.license.config.js',
    descriptionKey: 'superPanel.projectConfig.items.superPanel.license.allowedExtname.description'
  },

  // ==================== 邮箱配置 ====================
  'email.enabled': {
    labelKey: 'superPanel.projectConfig.items.email.enabled.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'email',
    descriptionKey: 'superPanel.projectConfig.items.email.enabled.description'
  },
  'email.defaultProvider': {
    labelKey: 'superPanel.projectConfig.items.email.defaultProvider.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/email/email.config.js',
    descriptionKey: 'superPanel.projectConfig.items.email.defaultProvider.description'
  },
  'email.host': {
    labelKey: 'superPanel.projectConfig.items.email.host.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'email',
    descriptionKey: 'superPanel.projectConfig.items.email.host.description'
  },
  'email.port': {
    labelKey: 'superPanel.projectConfig.items.email.port.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'email',
    descriptionKey: 'superPanel.projectConfig.items.email.port.description'
  },
  'email.secure': {
    labelKey: 'superPanel.projectConfig.items.email.secure.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'email',
    descriptionKey: 'superPanel.projectConfig.items.email.secure.description'
  },
  'email.username': {
    labelKey: 'superPanel.projectConfig.items.email.username.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'email',
    descriptionKey: 'superPanel.projectConfig.items.email.username.description'
  },
  'email.fromName': {
    labelKey: 'superPanel.projectConfig.items.email.fromName.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'email',
    descriptionKey: 'superPanel.projectConfig.items.email.fromName.description'
  },
  'email.send.maxRetries': {
    labelKey: 'superPanel.projectConfig.items.email.send.maxRetries.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/email/email.config.js',
    descriptionKey: 'superPanel.projectConfig.items.email.send.maxRetries.description'
  },
  'email.send.retryDelay': {
    labelKey: 'superPanel.projectConfig.items.email.send.retryDelay.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/email/email.config.js',
    descriptionKey: 'superPanel.projectConfig.items.email.send.retryDelay.description'
  },
  'email.send.timeout': {
    labelKey: 'superPanel.projectConfig.items.email.send.timeout.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/email/email.config.js',
    descriptionKey: 'superPanel.projectConfig.items.email.send.timeout.description'
  },
  'email.send.logEnabled': {
    labelKey: 'superPanel.projectConfig.items.email.send.logEnabled.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/email/email.config.js',
    descriptionKey: 'superPanel.projectConfig.items.email.send.logEnabled.description'
  },
  'email.passwordReset.tokenExpiresIn': {
    labelKey: 'superPanel.projectConfig.items.email.passwordReset.tokenExpiresIn.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/email/email.config.js',
    descriptionKey: 'superPanel.projectConfig.items.email.passwordReset.tokenExpiresIn.description'
  },
  'email.passwordReset.tokenLength': {
    labelKey: 'superPanel.projectConfig.items.email.passwordReset.tokenLength.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/email/email.config.js',
    descriptionKey: 'superPanel.projectConfig.items.email.passwordReset.tokenLength.description'
  },
  'email.passwordReset.maxActiveTokens': {
    labelKey: 'superPanel.projectConfig.items.email.passwordReset.maxActiveTokens.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/modules/email/email.config.js',
    descriptionKey: 'superPanel.projectConfig.items.email.passwordReset.maxActiveTokens.description'
  },

  // ==================== PLC配置 ====================
  'plc.activeProtocol': {
    labelKey: 'superPanel.projectConfig.items.plc.activeProtocol.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'superPanel.projectConfig.items.plc.activeProtocol.description'
  },
  'plc.supportedProtocols': {
    labelKey: 'superPanel.projectConfig.items.plc.supportedProtocols.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/plc/config/plcSetting.js',
    descriptionKey: 'superPanel.projectConfig.items.plc.supportedProtocols.description'
  },
  'plc.connection.host': {
    labelKey: 'superPanel.projectConfig.items.plc.connection.host.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'superPanel.projectConfig.items.plc.connection.host.description'
  },
  'plc.connection.port': {
    labelKey: 'superPanel.projectConfig.items.plc.connection.port.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'superPanel.projectConfig.items.plc.connection.port.description'
  },
  'plc.connection.unitId': {
    labelKey: 'superPanel.projectConfig.items.plc.connection.unitId.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'superPanel.projectConfig.items.plc.connection.unitId.description'
  },
  'plc.connection.rack': {
    labelKey: 'superPanel.projectConfig.items.plc.connection.rack.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'superPanel.projectConfig.items.plc.connection.rack.description'
  },
  'plc.connection.slot': {
    labelKey: 'superPanel.projectConfig.items.plc.connection.slot.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'superPanel.projectConfig.items.plc.connection.slot.description'
  },
  'plc.poll.fastInterval': {
    labelKey: 'superPanel.projectConfig.items.plc.poll.fastInterval.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'superPanel.projectConfig.items.plc.poll.fastInterval.description'
  },
  'plc.poll.slowInterval': {
    labelKey: 'superPanel.projectConfig.items.plc.poll.slowInterval.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'superPanel.projectConfig.items.plc.poll.slowInterval.description'
  },
  'plc.poll.reconnectDelay': {
    labelKey: 'superPanel.projectConfig.items.plc.poll.reconnectDelay.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'superPanel.projectConfig.items.plc.poll.reconnectDelay.description'
  },
  'plc.enablePoll': {
    labelKey: 'superPanel.projectConfig.items.plc.enablePoll.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'superPanel.projectConfig.items.plc.enablePoll.description'
  },
  'plc.enableWriteAudit': {
    labelKey: 'superPanel.projectConfig.items.plc.enableWriteAudit.label',
    editType: EDIT_TYPE.DATABASE,
    effectType: EFFECT_TYPE.IMMEDIATE,
    redirectPath: '/super-panel/config',
    redirectTab: 'plc',
    descriptionKey: 'superPanel.projectConfig.items.plc.enableWriteAudit.description'
  },
  'plc.maxWriteRetry': {
    labelKey: 'superPanel.projectConfig.items.plc.maxWriteRetry.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/plc/config/plcSetting.js',
    descriptionKey: 'superPanel.projectConfig.items.plc.maxWriteRetry.description'
  },
  'plc.timeouts.connect': {
    labelKey: 'superPanel.projectConfig.items.plc.timeouts.connect.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/plc/config/plcSetting.js',
    descriptionKey: 'superPanel.projectConfig.items.plc.timeouts.connect.description'
  },
  'plc.timeouts.read': {
    labelKey: 'superPanel.projectConfig.items.plc.timeouts.read.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/plc/config/plcSetting.js',
    descriptionKey: 'superPanel.projectConfig.items.plc.timeouts.read.description'
  },
  'plc.timeouts.readBatch': {
    labelKey: 'superPanel.projectConfig.items.plc.timeouts.readBatch.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/plc/config/plcSetting.js',
    descriptionKey: 'superPanel.projectConfig.items.plc.timeouts.readBatch.description'
  },
  'plc.timeouts.write': {
    labelKey: 'superPanel.projectConfig.items.plc.timeouts.write.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/plc/config/plcSetting.js',
    descriptionKey: 'superPanel.projectConfig.items.plc.timeouts.write.description'
  },
  'plc.timeouts.general': {
    labelKey: 'superPanel.projectConfig.items.plc.timeouts.general.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/plc/config/plcSetting.js',
    descriptionKey: 'superPanel.projectConfig.items.plc.timeouts.general.description'
  },
  'plc.multiDeviceEnabled': {
    labelKey: 'superPanel.projectConfig.items.plc.multiDeviceEnabled.label',
    editType: EDIT_TYPE.CONFIG_FILE,
    effectType: EFFECT_TYPE.RESTART,
    filePath: 'src/plc/config/plcSetting.js',
    descriptionKey: 'superPanel.projectConfig.items.plc.multiDeviceEnabled.description'
  }
}

/** 根据配置 key 获取元数据 */
export function getConfigMeta(key: string): ConfigMetaItem | null {
  return CONFIG_META[key] || null
}

/** 获取修改方式的显示配置 */
export function getEditTypeConfig(editType: EditType) {
  return EDIT_TYPE_CONFIG[editType] || EDIT_TYPE_CONFIG[EDIT_TYPE.CODE]
}

/** 获取生效方式的显示配置 */
export function getEffectTypeConfig(effectType: EffectType) {
  return EFFECT_TYPE_CONFIG[effectType] || EFFECT_TYPE_CONFIG[EFFECT_TYPE.RESTART]
}
