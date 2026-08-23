/**
 * 授权管理前端配置
 */
export default {
  /** 时间校准源（留空使用公共时间源，多源容错：百度/淘宝/京东/worldtimeapi） */
  licenseServerUrl: process.env.VUE_APP_LICENSE_SERVER_URL || '公共时间源（百度/淘宝/京东 多源容错）',

  /** 授权类型映射 */
  licenseTypes: [
    { value: 'trial', label: '试用版', tag: 'info' },
    { value: 'standard', label: '标准版', tag: '' },
    { value: 'enterprise', label: '企业版', tag: 'warning' },
    { value: 'perpetual', label: '永久版', tag: 'success' }
  ]
}
