/**
 * ==========================================
 * License 授权导入页面国际化配置
 * ==========================================
 * 用于 /license/import 页面
 * 使用方式：将下面的 license 对象复制到对应的国际化配置文件中
 *   - zh-CN.js：复制中文配置
 *   - en-US.js：复制英文配置
 */

// ==================== 中文配置（zh-CN.js） ====================
export const zhCNLicense = {
  // 品牌信息
  brandTitle: '授权管理系统',
  brandDesc: '安全、稳定、可靠的软件授权解决方案',

  // 功能特性
  featureRsa: 'RSA 非对称加密',
  featureTimeGuard: '时间防回退保护',
  featureMachineBind: '机器码硬件绑定',

  // 表单标题
  importFormTitle: '授权文件导入',

  // 授权状态
  statusValid: '授权有效',
  statusInvalid: '授权无效',
  expireTime: '过期时间',
  permanentValid: '永久有效',

  // 机器码
  currentMachineId: '当前机器码',
  copy: '复制',
  copySuccess: '复制成功',
  copyFailed: '复制失败',
  machineIdTip: '请将此机器码发送给供应商以生成授权文件',

  // 上传区域
  dragUploadTip: '将 .lic 授权文件拖到此处，或点击上传',
  fileSizeTip: '仅支持 .lic 格式的授权文件',
  remove: '移除',
  pleaseSelectFile: '请先选择授权文件',

  // 导入成功
  importSuccessTitle: '授权导入成功',
  importSuccess: '授权文件导入成功',
  licenseId: '授权ID',
  project: '项目名称',
  licenseType: '授权类型',
  issuedAt: '签发时间',
  maxUsers: '最大用户数',
  unlimited: '无限制',

  // 操作按钮
  importLicense: '导入授权',
  enterSystem: '进入系统',
  refreshStatus: '刷新状态',
  cannotGetStatus: '无法获取授权状态',

  // 授权类型
  typeTrial: '试用版',
  typeStandard: '标准版',
  typeEnterprise: '企业版',
  typePerpetual: '永久版',

  // 授权失效原因
  reasonUnknown: '未知原因',
  reasonFileNotFound: '授权文件不存在或验证失败',
  reasonProjectMismatch: '项目不匹配',
  reasonMachineMismatch: '机器码不匹配（硬件绑定）',
  reasonExpired: '授权已过期',
  reasonMissingFeatures: '缺少功能授权',
  reasonTimeRollback: '检测到系统时间回退',
  reasonNetworkSyncFailed: '联网时间校准失败'
}

// ==================== 英文配置（en-US.js） ====================
export const enUSLicense = {
  // Brand Info
  brandTitle: 'License Management System',
  brandDesc: 'Secure, stable and reliable software licensing solution',

  // Features
  featureRsa: 'RSA Asymmetric Encryption',
  featureTimeGuard: 'Anti-Tamper Time Protection',
  featureMachineBind: 'Machine Code Hardware Binding',

  // Form Title
  importFormTitle: 'Import License File',

  // License Status
  statusValid: 'License Valid',
  statusInvalid: 'License Invalid',
  expireTime: 'Expire Time',
  permanentValid: 'Permanent Valid',

  // Machine ID
  currentMachineId: 'Current Machine ID',
  copy: 'Copy',
  copySuccess: 'Copied successfully',
  copyFailed: 'Copy failed',
  machineIdTip: 'Please send this machine ID to the vendor to generate a license file',

  // Upload Area
  dragUploadTip: 'Drag the .lic license file here, or click to upload',
  fileSizeTip: 'Only .lic format license files are supported',
  remove: 'Remove',
  pleaseSelectFile: 'Please select a license file first',

  // Import Success
  importSuccessTitle: 'License Imported Successfully',
  importSuccess: 'License file imported successfully',
  licenseId: 'License ID',
  project: 'Project Name',
  licenseType: 'License Type',
  issuedAt: 'Issued At',
  maxUsers: 'Max Users',
  unlimited: 'Unlimited',

  // Action Buttons
  importLicense: 'Import License',
  enterSystem: 'Enter System',
  refreshStatus: 'Refresh Status',
  cannotGetStatus: 'Unable to get license status',

  // License Types
  typeTrial: 'Trial',
  typeStandard: 'Standard',
  typeEnterprise: 'Enterprise',
  typePerpetual: 'Perpetual',

  // License Invalid Reasons
  reasonUnknown: 'Unknown reason',
  reasonFileNotFound: 'License file not found or verification failed',
  reasonProjectMismatch: 'Project mismatch',
  reasonMachineMismatch: 'Machine code mismatch (hardware binding)',
  reasonExpired: 'License expired',
  reasonMissingFeatures: 'Missing feature authorization',
  reasonTimeRollback: 'System time rollback detected',
  reasonNetworkSyncFailed: 'Network time synchronization failed'
}
