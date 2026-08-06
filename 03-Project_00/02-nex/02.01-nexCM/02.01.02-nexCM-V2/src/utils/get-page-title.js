/**
 * get-page-title.js - 页面标题工具
 * 
 * 根据路由 meta.title 和系统标题生成浏览器标签标题
 * 格式：页面标题 - 系统标题
 */
import defaultSettings from '@/settings'

const title = defaultSettings.title || '医疗设备上位机管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
