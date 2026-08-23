/**
 * 多语言工具函数单元测试
 * 
 * 测试 src/utils/i18n.js 中的所有函数
 * 
 * @author nexCM Team
 * @date 2026-08-22
 */

const {
  getLangValue,
  processLangFields,
  getLangFromRequest,
  normalizeLang,
  buildLangObject
} = require('../../src/utils/i18n')

describe('多语言工具函数测试', () => {
  describe('normalizeLang - 语言标准化', () => {
    test('应该将 zh-CN 标准化为 zh-CN', () => {
      expect(normalizeLang('zh-CN')).toBe('zh-CN')
    })

    test('应该将 en-US 标准化为 en-US', () => {
      expect(normalizeLang('en-US')).toBe('en-US')
    })

    test('应该将 zh 标准化为 zh-CN', () => {
      expect(normalizeLang('zh')).toBe('zh-CN')
    })

    test('应该将 en 标准化为 en-US', () => {
      expect(normalizeLang('en')).toBe('en-US')
    })

    test('应该将空值标准化为 zh-CN（默认）', () => {
      expect(normalizeLang('')).toBe('zh-CN')
      expect(normalizeLang(null)).toBe('zh-CN')
      expect(normalizeLang(undefined)).toBe('zh-CN')
    })
  })

  describe('buildLangObject - 构建多语言对象', () => {
    test('应该构建包含中英文的对象', () => {
      const result = buildLangObject('中文', 'English')
      expect(result).toEqual({
        'zh-CN': '中文',
        'en-US': 'English'
      })
    })

    test('当英文为空时，应该使用中文值', () => {
      const result = buildLangObject('中文', '')
      expect(result['en-US']).toBe('中文')
    })
  })

  describe('getLangValue - 获取对应语言的值', () => {
    const jsonField = {
      'zh-CN': '中文值',
      'en-US': 'English Value'
    }

    test('应该获取中文值', () => {
      expect(getLangValue(jsonField, 'zh-CN')).toBe('中文值')
    })

    test('应该获取英文值', () => {
      expect(getLangValue(jsonField, 'en-US')).toBe('English Value')
    })

    test('当值为字符串时，应该直接返回', () => {
      expect(getLangValue('直接字符串', 'zh-CN')).toBe('直接字符串')
    })

    test('当值为 null 时，应该返回空字符串', () => {
      expect(getLangValue(null, 'zh-CN')).toBe('')
    })
  })

  describe('processLangFields - 处理查询结果中的多语言字段', () => {
    test('应该处理对象中的多语言字段', () => {
      const data = {
        id: 1,
        role_name: { 'zh-CN': '管理员', 'en-US': 'Administrator' },
        description: { 'zh-CN': '系统管理员', 'en-US': 'System Admin' }
      }
      const result = processLangFields(data, ['role_name', 'description'], 'en-US')
      expect(result.role_name).toBe('Administrator')
      expect(result.description).toBe('System Admin')
    })

    test('应该处理数组中的多语言字段', () => {
      const data = [
        { id: 1, role_name: { 'zh-CN': '管理员', 'en-US': 'Administrator' } },
        { id: 2, role_name: { 'zh-CN': '工程师', 'en-US': 'Engineer' } }
      ]
      const result = processLangFields(data, ['role_name'], 'en-US')
      expect(result[0].role_name).toBe('Administrator')
      expect(result[1].role_name).toBe('Engineer')
    })
  })

  describe('getLangFromRequest - 从请求中获取语言参数', () => {
    test('应该从 query 中获取 lang 参数', () => {
      const req = { query: { lang: 'en-US' }, body: {}, headers: {} }
      expect(getLangFromRequest(req)).toBe('en-US')
    })

    test('应该从 headers 的 accept-language 获取', () => {
      const req = { query: {}, body: {}, headers: { 'accept-language': 'en-US,en;q=0.9' } }
      expect(getLangFromRequest(req)).toBe('en-US')
    })

    test('当没有语言参数时，应该返回默认值 zh-CN', () => {
      const req = { query: {}, body: {}, headers: {} }
      expect(getLangFromRequest(req)).toBe('zh-CN')
    })

    test('query 优先级高于 headers', () => {
      const req = {
        query: { lang: 'zh-CN' },
        body: {},
        headers: { 'accept-language': 'en-US,en;q=0.9' }
      }
      expect(getLangFromRequest(req)).toBe('zh-CN')
    })
  })
})
