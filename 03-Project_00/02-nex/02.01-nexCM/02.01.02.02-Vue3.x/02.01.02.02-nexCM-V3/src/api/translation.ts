/**
 * 翻译 API
 * 后端路由前缀 /prod-api/v2/translation
 */
import request from '@/utils/request/request'

/**
 * 获取翻译配置
 */
export function requestGetTranslationConfigApi() {
  return request({
    url: '/translation/config',
    method: 'get'
  })
}

/**
 * 保存翻译配置
 * @param {Object} config - 配置对象
 */
export function requestSaveTranslationConfigApi(config: Record<string, unknown>) {
  return request({
    url: '/translation/config/save',
    method: 'post',
    data: config
  })
}

/**
 * 测试翻译配置
 */
export function requestTestTranslationConfigApi() {
  return request({
    url: '/translation/config/test',
    method: 'post'
  })
}

/**
 * 翻译文本
 * @param {string} text - 待翻译文本
 * @param {string} source - 源语言编码
 * @param {string} target - 目标语言编码
 */
export function requestTranslateApi(text: string, source: string, target: string) {
  return request({
    url: '/translation/translate',
    method: 'post',
    data: { text, source, target },
    hideLoading: true, // 翻译请求不显示全局 loading，避免批量翻译时全屏 loading 遮罩
    skipPending: true // 跳过重复请求取消逻辑，批量翻译时每个请求都是独立的，避免被下一个请求取消
  })
}

/**
 * 批量翻译
 * @param {Array} items - 待翻译数组 [{ key, value }]
 * @param {string} source - 源语言编码
 * @param {string} target - 目标语言编码
 */
export function requestTranslateBatchApi(items: (string|number)[], source: string, target: string) {
  return request({
    url: '/translation/translate/batch',
    method: 'post',
    data: { items, source, target },
    hideLoading: true, // 批量翻译请求不显示全局 loading
    skipPending: true // 跳过重复请求取消逻辑
  })
}
